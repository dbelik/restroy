-- Script that creates schemas and extensions for the database.
-- Various tables will be created using migrations.
DROP SCHEMA public CASCADE;
CREATE SCHEMA workspace_management;
ALTER SCHEMA workspace_management OWNER TO restroy_admin;
SET search_path TO workspace_management;

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA workspace_management;
COMMENT ON EXTENSION pg_stat_statements IS 'Execution statistics of all SQL statements executed';
