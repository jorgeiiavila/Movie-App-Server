import { CustomError, ErrorEnums } from "../errors/errors";
import { Error } from "mongoose";
import { Request, Response, NextFunction } from "express";

function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.message);
  console.error(err.stack);

  const isError = isCustomError(err);

  res.status(isError ? err.statusCode : 500).json({
    message: isError ? err.message : ErrorEnums.INTERNAL_ERROR,
  });
}

function isCustomError(error: CustomError): error is CustomError {
  return (error as CustomError).statusCode !== undefined;
}

export default errorHandler;
