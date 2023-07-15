INSERT INTO workspace_management.plans(
	id, name, description, price, features, created_at, updated_at, deactivated_at, deleted_at)
	VALUES (1, 'Basic', 'Basic features', 0, '{}', '2020-12-12', '2020-12-12', null, null);

INSERT INTO workspace_management.users(
	id, first_name, last_name, about, email, email_validated, password, purpose, features_seen, last_login, timezone, deactivated_at, deleted_at)
	VALUES (1, 'Restroy', 'Bot', 'Restroy Bot', 'bot@restroy.com', true, '', 'personal', '{}', null, 'UTC', null, null);

INSERT INTO workspace_management.teams(
	id, name, description, 
	owner_id, plan_id, next_billing_date, 
	failed_billing_attempts, next_payment_retry_date, total_bills_paid, 
	billing_interval, trial_end_date, theme, 
	created_at, updated_at, deactivated_at, 
	deleted_at)
	VALUES (
		1, 'Restroy Team', 'Restroy Team', 
		1, 1, null, 
		0, null, 0, 
		'yearly', null, '{}', '2020-12-12', '2020-12-12', null, null);

INSERT INTO workspace_management.boards(
	id, name, description, team_id, owner_id, created_at, updated_at, deactivated_at, deleted_at)
	VALUES (
		1, 'Restroy Board', 'Restroy Board',
		1, 1, '2020-12-12',
		'2020-12-12', null, null
	);

INSERT INTO workspace_management.plugins(
  id, name, description, settings, code, 
  creator_id
) VALUES (
    1, 'Hello World', 'Plugin to print hello world to the console',
    '{ "language": "Javascript" }', 'console.log("Hello World")',
    1
);
