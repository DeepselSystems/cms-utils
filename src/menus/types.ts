export interface MenuItem {
  id: number;
  parent_id: number | null;
  position: number;
  translations: Record<
    string,
    {
      open_in_new_tab: boolean;
      page_content_id: number;
      title: string;
      url: string | null;
      use_custom_url: boolean;
      use_page_title: boolean;
    }
  >;
  children: MenuItem[];
}

export interface ProcessedMenuItem {
  id: number;
  position: number;
  title: string;
  url: string | null;
  open_in_new_tab: boolean;
  children: ProcessedMenuItem[];
}
