import { fetchPublicSettings } from './fetchPublicSettings';
import type { ApiResponse } from './types';

/**
 * Fetches page data from the backend by language and slug
 */
export async function fetchPageData(
  lang: string | null,
  slug: string,
  isPreview: boolean = false,
  authToken: string | null = null,
  astroRequest: Request | null = null,
  backendHost: string = 'http://localhost:8000',
): Promise<ApiResponse> {
  try {
    // Format the slug properly, make sure it starts with a slash
    let formattedSlug = slug.startsWith('/') ? slug : `/${slug}`;
    // Backend will consider 'default' as the home slug
    if (formattedSlug === '/') {
      formattedSlug = '/default';
    }

    // Determine the URL based on whether a language is provided
    let url;
    if (lang && lang !== 'default') {
      url = `${backendHost}/page/website/${lang}${formattedSlug}`;
    } else {
      url = `${backendHost}/page/website/default${formattedSlug}`;
    }

    // Add preview parameter if enabled
    if (isPreview) {
      url += '?preview=true';
    }

    // Prepare fetch options
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      } as Record<string, string>,
    };

    // Send the current hostname to the backend for proper domain detection
    let hostname = null;

    // Server-side: Extract hostname from Astro request
    if (astroRequest) {
      const url = new URL(astroRequest.url);
      hostname = url.hostname;
    }
    // Client-side: Extract hostname from window
    else if (typeof window !== 'undefined') {
      hostname = window.location.hostname;
    }

    if (hostname) {
      fetchOptions.headers['X-Original-Host'] = hostname;
      fetchOptions.headers['X-Frontend-Host'] = hostname;
      // Note: Cannot override Host header due to browser security restrictions
    }

    // Add authentication headers if token exists (for both preview and protected content)
    let token = authToken;

    // If no token provided and we're in browser environment, try Capacitor Preferences
    if (!token && typeof window !== 'undefined') {
      try {
        const { Preferences } = await import('@capacitor/preferences');
        const tokenResult = await Preferences.get({ key: 'token' });
        token = tokenResult.value;
      } catch (e) {
        console.warn('Could not get token from Preferences:', e);
      }
    }

    if (token) {
      fetchOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    // Fetch the page data from the backend
    const response = await fetch(url, fetchOptions);

    // Handle authentication errors
    if (response.status === 401) {
      return { error: true, status: 401, message: 'Authentication required' };
    }

    // Only treat actual 404 as not found
    if (response.status === 404) {
      const { detail } = await response.json();
      console.warn('404', url, { detail });

      // When page is not found, still fetch menus and site settings
      try {
        const siteSettings = await fetchPublicSettings(null, astroRequest, lang, backendHost);
        return {
          notFound: true,
          status: 404,
          detail,
          public_settings: siteSettings,
          lang: lang || siteSettings?.default_language?.iso_code || 'en',
        };
      } catch (settingsError) {
        console.warn('Could not fetch site settings for 404 page:', settingsError);
        return { notFound: true, status: 404, detail };
      }
    }

    try {
      // Parse the JSON
      const jsonData = await response.json();

      return jsonData;
    } catch (parseError: any) {
      console.error(`Failed to parse response: ${parseError.message}`);
      return { error: true, parseError: parseError.message };
    }
  } catch (error: any) {
    console.error('Error fetching page data:', error);
    return { error: true, message: error.message };
  }
}
