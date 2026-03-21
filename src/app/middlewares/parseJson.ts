import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/appError";

export const parseJSONFields = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      fields.forEach((field) => {
        if (req.body[field]) {
          req.body[field] = JSON.parse(req.body[field]);
        }
      });
      next();
    } catch (error) {
      next(new AppError(400, "Invalid JSON format in request body"));
    }
  };
};