interface ActionResult<T = unknown> {
  ok: boolean;
  message: string;
  data?: T;
  description?: string;
  errors?: Record<string, string[]>;
  status?: number;
}

interface APIError {
  message?: string;
  description?: string;
  errors?: Record<string, string[]>;
  status?: number;
}
