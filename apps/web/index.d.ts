declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_TEMPORARY_AUTH_TOKEN: string;
    }
  }
}

export {};
