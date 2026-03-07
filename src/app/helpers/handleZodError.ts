import { ZodError } from "zod";
import {
  TErrorSources,
  TGenericErrorResponse,
} from "../interfaces/error.types";

export const handleZodError = (
  err: ZodError
): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = [];

  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path[issue.path.length - 1] as string,
      message: issue.message,
    });
  });

  return {
    statusCode: 400,
    message: "Validation Error",
    errorMessages: errorSources,
  };
};