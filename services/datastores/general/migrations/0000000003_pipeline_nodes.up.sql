CREATE TABLE workspace_management.pipeline_nodes (
  id SERIAL PRIMARY KEY,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  pipeline_id BIGINT NOT NULL,
  plugin_id BIGINT NOT NULL,

  FOREIGN KEY (pipeline_id) REFERENCES workspace_management.pipelines(id),
  FOREIGN KEY (plugin_id) REFERENCES workspace_management.plugins(id)
);

CREATE INDEX pipeline_nodes_pipeline_id
  ON workspace_management.pipeline_nodes(pipeline_id)
  WHERE pipeline_id IS NOT NULL; 
