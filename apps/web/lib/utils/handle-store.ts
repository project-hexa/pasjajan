export const handleStore = async <T = undefined>(
  tryFnc: () => Promise<T>,
  successMessage?: string,
  defaultErrorMessage = "Terjadi Kesalahan",
) => {
  try {
    const data = await tryFnc();

    return {
      ok: true,
      message: successMessage ?? "",
      ...(data !== undefined ? { data } : {}),
    };
  } catch (error) {
    const err = error as APIError;

    return {
      ok: false,
      message: err?.message ?? defaultErrorMessage,
      description: err?.description,
      errors: err?.errors,
      status: err?.status,
    };
  }
};
