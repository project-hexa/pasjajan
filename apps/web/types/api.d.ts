interface BaseAPIResponse {
  success: boolean;
  message: string;
}

interface SuccessResponse<T> extends BaseAPIResponse {
  success: true;
  data: T;
}

interface ErrorResponse<E = Record<string, string[]>> extends BaseAPIResponse {
  success: false;
  errors?: E;
}

type APIResponse<T, E = Record<string, string[]>> =
  | SuccessResponse<T>
  | ErrorResponse<E>;

type APIError = {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
};

type ActionResult =
  | {
      ok: true;
      message: string;
    }
  | {
      ok: false;
      message: string;
      errors?: Record<string, string[]>;
      status?: number;
    };