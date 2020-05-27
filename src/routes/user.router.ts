import { Router } from "express";
import { initConnection } from "../utils/utils";
import * as UserLogic from "../logic/user.logic";
import { Errors } from "../errors/errors";
import { IUser } from "../models/user";

const router = Router();

function validateEmail(email: string) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

router.post("/register", (req, res, next) => {
  const user = req.body as IUser;
  user.username = user.username.trim();
  user.name = user.name.trim();
  user.email = user.email.trim();
  user.password = user.password.trim();

  if (!user.username || !user.name || !user.email || !user.password) {
    next(Errors.INCOMPLETE_FORM());
    return;
  }

  if (!validateEmail(user.email)) {
    next(Errors.INVALID_EMAIL());
    return;
  }

  initConnection(() => UserLogic.register(user), req, res);
});

router.post("/authenticate", (req, res, next) => {
  const user = req.body;
  const secretKey = req.app.get("secretKey");

  if (!user.username || !user.password) {
    next(Errors.INCOMPLETE_FORM());
    return;
  }

  initConnection(() => UserLogic.authenticate(user, secretKey), req, res);
});

export default router;
