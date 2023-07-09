CREATE TYPE workspace_management.user_purpose_enum AS ENUM (
  'personal',
  'business'
);

CREATE TYPE workspace_management.billing_interval_enum AS ENUM (
  'monthly',
  'yearly'
);

CREATE TABLE workspace_management.plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deactivated_at TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE TABLE workspace_management.users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  about TEXT NOT NULL DEFAULT '',
  email VARCHAR(255) UNIQUE NOT NULL,
  email_validated BOOLEAN NOT NULL DEFAULT FALSE,
  password VARCHAR(255) NOT NULL,
  purpose workspace_management.user_purpose_enum NOT NULL,
  features_seen JSONB NOT NULL DEFAULT '[]'::jsonb,
  last_login TIMESTAMP,
  timezone VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deactivated_at TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE TABLE workspace_management.teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  owner_id BIGINT NOT NULL,
  plan_id BIGINT NOT NULL,
  next_billing_date TIMESTAMP,
  failed_billing_attempts INT NOT NULL DEFAULT 0,
  next_payment_retry_date TIMESTAMP,
  total_bills_paid INT NOT NULL DEFAULT 0,
  billing_interval workspace_management.billing_interval_enum,
  trial_end_date TIMESTAMP,
  theme JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deactivated_at TIMESTAMP,
  deleted_at TIMESTAMP,

  FOREIGN KEY (plan_id) REFERENCES workspace_management.plans(id),
  FOREIGN KEY (owner_id) REFERENCES workspace_management.users(id)
);

CREATE TABLE workspace_management.user_invites (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  user_inviting_id BIGINT NOT NULL,
  team_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_inviting_id) REFERENCES workspace_management.users(id),
  FOREIGN KEY (team_id) REFERENCES workspace_management.teams(id)
);

CREATE TABLE workspace_management.permissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE workspace_management.roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  team_id BIGINT NOT NULL,

  FOREIGN KEY (team_id) REFERENCES workspace_management.teams(id)
);

CREATE TABLE workspace_management.role_permissions (
  role_id BIGINT NOT NULL,
  permission_id BIGINT NOT NULL,

  FOREIGN KEY (role_id) REFERENCES workspace_management.roles(id),
  FOREIGN KEY (permission_id) REFERENCES workspace_management.permissions(id)
);

CREATE TABLE workspace_management.team_members (
  team_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  invited_by BIGINT,
  joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES workspace_management.users(id),
  FOREIGN KEY (team_id) REFERENCES workspace_management.teams(id),
  FOREIGN KEY (role_id) REFERENCES workspace_management.roles(id)
);

CREATE TABLE workspace_management.boards (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  team_id BIGINT NOT NULL,
  owner_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deactivated_at TIMESTAMP,
  deleted_at TIMESTAMP,

  FOREIGN KEY (team_id) REFERENCES workspace_management.teams(id),
  FOREIGN KEY (owner_id) REFERENCES workspace_management.users(id)
);

CREATE TABLE workspace_management.boards_users (
  board_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  invited_by BIGINT,

  FOREIGN KEY (board_id) REFERENCES workspace_management.boards(id),
  FOREIGN KEY (user_id) REFERENCES workspace_management.users(id),
  FOREIGN KEY (role_id) REFERENCES workspace_management.roles(id),
  FOREIGN KEY (invited_by) REFERENCES workspace_management.users(id)
);

CREATE TABLE workspace_management.pipelines (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  interval VARCHAR(255) NOT NULL,
  next_date TIMESTAMP NOT NULL,
  structure JSONB NOT NULL DEFAULT '{}'::jsonb,
  executed_times INT NOT NULL DEFAULT 0,
  board_id BIGINT NOT NULL,
  hourly_executed_times SMALLINT NOT NULL DEFAULT 0,
  hourly_failed_times SMALLINT NOT NULL DEFAULT 0,
  daily_executed_times SMALLINT NOT NULL DEFAULT 0,
  daily_failed_times SMALLINT NOT NULL DEFAULT 0,
  weekly_executed_times SMALLINT NOT NULL DEFAULT 0,
  weekly_failed_times SMALLINT NOT NULL DEFAULT 0,
  monthly_executed_times SMALLINT NOT NULL DEFAULT 0,
  monthly_failed_times SMALLINT NOT NULL DEFAULT 0,
  yearly_executed_times SMALLINT NOT NULL DEFAULT 0,
  yearly_failed_times SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deactivated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,

  FOREIGN KEY (board_id) REFERENCES workspace_management.boards(id)
);

CREATE TYPE workspace_management.pipeline_status_enum AS ENUM (
  'pending',
  'running',
  'paused',
  'failed',
  'success'
);

CREATE TABLE workspace_management.pipeline_history (
  id SERIAL PRIMARY KEY,
  pipeline_id BIGINT NOT NULL,
  status workspace_management.pipeline_status_enum NOT NULL,
  started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deactivated_at TIMESTAMP,
  deleted_at TIMESTAMP,

  FOREIGN KEY (pipeline_id) REFERENCES workspace_management.pipelines(id)
);

CREATE TABLE workspace_management.plugins (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  tags VARCHAR(31)[] NOT NULL,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  creator_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (creator_id) REFERENCES workspace_management.users(id)
);

CREATE TABLE workspace_management.pipeline_items (
  id SERIAL PRIMARY KEY,
  pipeline_id BIGINT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  plugin_id BIGINT NOT NULL,

  FOREIGN KEY (pipeline_id) REFERENCES workspace_management.pipelines(id),
  FOREIGN KEY (plugin_id) REFERENCES workspace_management.plugins(id)
);
