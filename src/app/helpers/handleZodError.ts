import mongoose from "mongoose";
import {
  TErrorSources,
  TGenericErrorResponse,
} from "../interfaces/error.types";
import { ZodError } from "zod";

export const handleZodError = (
  err: ZodError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = [];
  err.issues.forEach((errorObject: any) => {
    errorSources.push({
      path: errorObject.path,
      message: errorObject.message,
    });
  });
  return {
    statusCode: 400,
    message: "Zod error",
    errorMessages: errorSources,
  };
};
