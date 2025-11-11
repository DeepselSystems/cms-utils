export interface SlugParseResult {
  lang: string | null;
  path: string;
}

export interface ErrorResponse {
  error: true;
  status?: number;
  message?: string;
  parseError?: string;
}

export interface NotFoundResponse {
  notFound: true;
  status: number;
  detail: string;
  public_settings?: Record<string, unknown>;
  lang?: string;
}

export interface BlogListResponse {
  posts: Record<string, unknown>[];
}

export type ApiResponse =
  | Record<string, unknown>
  | ErrorResponse
  | NotFoundResponse
  | BlogListResponse;
