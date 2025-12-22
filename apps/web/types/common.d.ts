interface ActionResult {
  ok: boolean;
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

interface APIError {
  message?: string;
  errors?: Record<string, string[]>;
  status?: number;
}
