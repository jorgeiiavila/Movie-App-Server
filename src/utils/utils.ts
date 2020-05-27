import { Request, Response, NextFunction } from "express";
import { Errors, CustomError, ErrorEnums } from "../errors/errors";
import { Error } from "mongoose";

interface Res<T> {
  data: T;
  statusCode: number;
}

export function initConnection<T>(
  closure: () => Promise<Res<T>>,
  req: Request,
  res: Response,
  next?: NextFunction
) {
  closure()
    .then((x) => {
      if (next) next();
      else res.status(x.statusCode).json(x.data);
    })
    .catch((err: Error.ValidationError | CustomError) => {
      console.error(err.message);
      console.error(err.stack);
      const isError = isCustomError(err);

      res.status(isError ? (err as CustomError).statusCode : 500).json({
        message: isError ? err.message : ErrorEnums.INTERNAL_ERROR,
      });
    });
}

function isCustomError(
  error: Error.ValidationError | CustomError
): error is CustomError {
  return (error as CustomError).statusCode !== undefined;
}
