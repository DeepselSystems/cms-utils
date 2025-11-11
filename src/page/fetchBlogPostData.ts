import type { ApiResponse } from './types';

/**
 * Fetches Blog-Post-Content data from the backend by language and slug
 */
export async function fetchBlogPostData(
  lang: string,
  slug: string,
  authToken: string | null = null,
  astroRequest: Request | null = null,
  backendHost: string = 'http://localhost:8000',
): Promise<ApiResponse> {
  try {
    // Format the slug properly
    const formattedSlug = slug.replace(/^\/blog\//, '');

    // Determine the URL based on whether a language is provided
    const url =
      lang && lang !== 'default'
        ? `${backendHost}/blog_post/website/${lang}/${formattedSlug}`
        : `${backendHost}/blog_post/website/default/${formattedSlug}`;

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
      return { notFound: true, status: 404, detail };
    }

    try {
      // Parse the JSON
      return await response.json();
    } catch (parseError: any) {
      console.error(`Failed to parse response: ${parseError.message}`);
      return { error: true, parseError: parseError.message };
    }
  } catch (error: any) {
    console.error('Error fetching page data:', error);
    return { error: true, message: error.message };
  }
}
