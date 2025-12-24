export const handleApiResponse = async <T = undefined>(
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
      data: undefined,
      description: err?.description,
      errors: err?.errors,
      status: err?.status,
    };
  }
};
