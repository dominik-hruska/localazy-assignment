import type { ApiError } from "~/types/errors";

export const getErrorMessage = (error: unknown, fallback: string) => {
  if (!error) return "";

  const err = error as ApiError;
  return err.data?.statusMessage ?? err.statusMessage ?? err.message ?? fallback;
};
