export const getToken = () => {
  return process.env.NEXT_PUBLIC_TEMPORARY_AUTH_TOKEN;
};

export const getApiBaseUrl = () => {
  const rawBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const withoutTrailingSlash = rawBase.replace(/\/+$/, "");
  return withoutTrailingSlash.replace(/\/api$/, "");
};
