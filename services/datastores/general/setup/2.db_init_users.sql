-- Workspace readonly role
CREATE ROLE r_restroy_workspaces_read NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;
GRANT USAGE ON SCHEMA workspace_management TO r_restroy_workspaces_read;
GRANT SELECT ON ALL TABLES IN SCHEMA workspace_management TO r_restroy_workspaces_read;
ALTER DEFAULT PRIVILEGES IN SCHEMA workspace_management GRANT SELECT ON TABLES TO r_restroy_workspaces_read;

-- Workspace readwrite role
CREATE ROLE r_restroy_workspaces_readwrite NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;
GRANT USAGE ON SCHEMA workspace_management TO r_restroy_workspaces_readwrite;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA workspace_management TO r_restroy_workspaces_readwrite;
ALTER DEFAULT PRIVILEGES IN SCHEMA workspace_management GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO r_restroy_workspaces_readwrite;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA workspace_management TO r_restroy_workspaces_readwrite;
ALTER DEFAULT PRIVILEGES IN SCHEMA workspace_management GRANT USAGE ON SEQUENCES TO r_restroy_workspaces_readwrite;

-- Workspace readonly user
CREATE USER u_restroy_workspaces_read WITH PASSWORD 'password123';
GRANT CONNECT ON DATABASE restroy TO u_restroy_workspaces_read;
GRANT r_restroy_workspaces_read TO u_restroy_workspaces_read;

-- Workspace readwrite user
CREATE USER u_restroy_workspaces_readwrite WITH PASSWORD 'password123';
GRANT CONNECT ON DATABASE restroy TO u_restroy_workspaces_readwrite;
GRANT r_restroy_workspaces_readwrite TO u_restroy_workspaces_readwrite;

ALTER USER u_restroy_workspaces_read SET search_path TO workspace_management;
ALTER USER u_restroy_workspaces_readwrite SET search_path TO workspace_management;
ALTER USER restroy_admin SET search_path TO workspace_management;
