export const baseCookiesOptions: Cookies.CookieAttributes = {
  path: "/",
  secure: process.env.NODE_ENV === "production",
};
