import type { MenuItem } from './menus/types';

export interface SiteSettings {
  domains: string[];
  available_languages: Array<{
    id: number;
    name: string;
    iso_code: string;
    emoji_flag: string;
  }>;
  default_language: {
    id: number;
    name: string;
    iso_code: string;
    emoji_flag: string;
  };
  auto_translate_pages: boolean;
  auto_translate_posts: boolean;
  has_openrouter_api_key: boolean;
  ai_autocomplete_model_id: number;
  show_post_author: boolean;
  show_post_date: boolean;
  show_chatbox: boolean;
  website_custom_code: string | null;
  menus: MenuItem[];
}
