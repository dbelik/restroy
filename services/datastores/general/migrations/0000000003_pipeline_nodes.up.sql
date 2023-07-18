CREATE TABLE workspace_management.pipeline_nodes (
  id SERIAL PRIMARY KEY,
  settings TEXT NOT NULL, -- Text, because it's encrypted
  pipeline_id BIGINT NOT NULL,
  plugin_id BIGINT NOT NULL,

  FOREIGN KEY (pipeline_id) REFERENCES workspace_management.pipelines(id) ON DELETE CASCADE
);

CREATE INDEX pipeline_nodes_pipeline_id
  ON workspace_management.pipeline_nodes(pipeline_id)
  WHERE pipeline_id IS NOT NULL; 
