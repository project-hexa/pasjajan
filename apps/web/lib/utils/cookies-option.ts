export const cookiesOptions: Cookies.CookieAttributes = {
  path: "/",
  secure: process.env.NODE_ENV === "production",
};
