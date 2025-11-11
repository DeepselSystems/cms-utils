import { MenuItem, ProcessedMenuItem } from './types';
import type { SiteSettings } from '../types';

/*
Get menus based on the current selected language
*/
export const getCurrentLangMenus = (settings: SiteSettings): ProcessedMenuItem[] | null => {
  if (!settings || !settings.menus || !settings.menus.length) return null;

  let currentLang = localStorage.getItem('i18nextLng');

  // If no language is selected, use the default language
  if (!currentLang) {
    currentLang = settings.default_language.iso_code;
  }

  return settings.menus
    .map((menu) => processMenuItem(menu, currentLang))
    .filter((item): item is ProcessedMenuItem => item !== null);
};

/*
Process a menu item and its children recursively:
- Remove null items
- Only keep fields that are needed from the translation for the current language
- Remove other translations
*/
function processMenuItem(menuItem: MenuItem, currentLang: string): ProcessedMenuItem | null {
  const translation = menuItem.translations[currentLang];
  if (!translation) {
    return null;
  }

  // Process children recursively and filter out null items
  const children =
    menuItem.children && menuItem.children.length > 0
      ? menuItem.children
          .map((child) => processMenuItem(child, currentLang))
          .filter((item): item is ProcessedMenuItem => item !== null)
      : [];

  return {
    id: menuItem.id,
    position: menuItem.position,
    title: translation.title,
    url: translation.url,
    open_in_new_tab: translation.open_in_new_tab,
    children,
  };
}
