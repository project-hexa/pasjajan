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
      description: err?.description,
      errors: err?.errors,
      status: err?.status,
    };
  }
};
