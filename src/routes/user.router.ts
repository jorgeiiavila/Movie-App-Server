import { Router } from "express";
import { initConnection } from "../utils/utils";
import * as UserLogic from "../logic/user.logic";
import { Errors } from "../errors/errors";

const router = Router();

router.post("/register", (req, res) => {
  const user = req.body;
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
