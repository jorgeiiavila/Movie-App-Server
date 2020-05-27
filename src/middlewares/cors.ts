import { Request, Response, NextFunction } from "express";

function cors(req: Request, res: Response, next: NextFunction) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,PUT");

  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
}

export default cors;
