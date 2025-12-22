type APIError = {
  message?: string;
  errors?: Record<string, string[]>;
  status?: number;
};

export const handleStore = async (
  tryFnc: () => Promise<void>,
  successMessage: string,
  defaultErrorMessage = "Terjadi Kesalahan",
) => {
  try {
    await tryFnc();

    return {
      ok: true,
      message: successMessage,
    };
  } catch (error) {
    const err = error as APIError;

    return {
      ok: false,
      message: err?.message ?? defaultErrorMessage,
      errors: err?.errors,
      status: err?.status,
    };
  }
};
