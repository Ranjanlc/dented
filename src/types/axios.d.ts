declare module "axios" {
  interface CustomAxiosError extends Error {
    response: {
      data: {
        message: string;
      };
    };
  }
}
export { CustomAxiosError };
