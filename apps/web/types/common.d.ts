interface ActionResult {
  ok: boolean;
  message: string;
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
