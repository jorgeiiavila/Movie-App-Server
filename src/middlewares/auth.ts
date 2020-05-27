import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Errors } from "../errors/errors";

export function validateUser(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;

  if (!auth) {
    next(Errors.MISSING_TOKEN());
    return;
  }

  try {
    const token = auth!.split(" ")[1];
    const decoded = jwt.verify(token, req.app.get("secretKey")) as {
      id: string;
      userType: string;
    };
    res.locals.userID = decoded.id;
    res.locals.userType = decoded.userType;
    next();
  } catch (error) {
    next(Errors.INVALID_TOKEN());
  }
}
