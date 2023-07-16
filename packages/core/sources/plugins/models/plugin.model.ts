import PluginSettingsModel from './plugin-settings.model';

export default class PluginModel {
  id: string;

  name: string;

  description: string;

  tags: string[];

  settings: PluginSettingsModel;

  code: string;

  creator_id: string;

  created_at: string;

  updated_at: string;

  deleted_at?: string;
}
