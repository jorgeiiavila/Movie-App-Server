import User, { IUser } from "../models/user";
import { Errors } from "../errors/errors";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { UserDTO } from "../types/User";

export async function register(user: IUser) {
  const userDoc = new User(user);
  userDoc.type = "user";
  userDoc.createdAt = new Date();
  await userDoc.save();
  return { data: userDoc, statusCode: 200 };
}

export async function authenticate(user: IUser, secretKey: string) {
  const userDoc = await User.findOne({ username: user.username }).then(
    (res) => res
  );

  if (!userDoc) throw Errors.USER_OR_PASSWORD_INCORRECT();

  if (bcrypt.compareSync(user.password, userDoc.password)) {
    const lightUser = {
      name: userDoc.name,
      username: userDoc.username,
      email: userDoc.email,
      type: userDoc.type,
    } as UserDTO;
    const token = jwt.sign(
      { id: userDoc._id, userType: userDoc.type },
      secretKey,
      { expiresIn: "1d" }
    );
    return { data: { user: lightUser, token }, statusCode: 200 };
  }

  throw Errors.USER_OR_PASSWORD_INCORRECT();
}
