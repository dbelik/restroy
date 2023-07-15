CREATE INDEX role_permissions_role_id 
  ON workspace_management.role_permissions(role_id)
  WHERE role_id IS NOT NULL;

CREATE INDEX team_members_team_id 
  ON workspace_management.team_members(team_id)
  WHERE team_id IS NOT NULL;

CREATE INDEX team_members_user_id 
  ON workspace_management.team_members(user_id)
  WHERE user_id IS NOT NULL;

CREATE INDEX boards_users_board_id 
  ON workspace_management.boards_users(board_id)
  WHERE board_id IS NOT NULL;

CREATE INDEX boards_users_user_id 
  ON workspace_management.boards_users(user_id)
  WHERE user_id IS NOT NULL;

CREATE INDEX pipeline_history_pipeline_id
  ON workspace_management.pipeline_history(pipeline_id)
  WHERE pipeline_id IS NOT NULL;
