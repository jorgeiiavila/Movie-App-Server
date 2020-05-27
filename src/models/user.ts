import { Schema, model, Document } from "mongoose";
import * as bcrypt from "bcrypt";
import Config from "../config/config";
import { ListItem, IListItem } from "./listItem";
import { Errors } from "../errors/errors";

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, required: true },
  type: { type: String, required: true },
  toWatch: [ListItem],
  watched: [ListItem],
  favorites: [ListItem],
});

export interface IUserDocument extends Document {
  username: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  type: "user" | "admin";
  toWatch: IListItem[];
  watched: IListItem[];
  favorites: IListItem[];
}

UserSchema.pre<IUserDocument>("save", async function (next) {
  if (this.isNew) {
    const existingUser = await UserModel.findOne({
      $or: [{ username: this.username }, { email: this.email }],
    });
    if (existingUser) throw Errors.REPEATED_USERNAME_OR_EMAIL();
    if (this.password.length < 8) throw Errors.INVALID_PASSWORD();
    this.password = bcrypt.hashSync(this.password, Config.saltRounds);
  }
  next();
});

export interface IUser {
  username: IUserDocument["username"];
  name: IUserDocument["name"];
  email: IUserDocument["email"];
  password: IUserDocument["password"];
  createdAt: IUserDocument["createdAt"];
}

const UserModel = model<IUserDocument>("User", UserSchema);

async function init() {
  const admin = await UserModel.findOne({ type: "admin" });
  if (!admin) {
    const adminDoc = new UserModel({
      name: "admin",
      username: "admin",
      email: "admin",
      password: "admin123",
      createdAt: new Date(),
      type: "admin",
    });
    await adminDoc.save();
  }
}

init();

export default UserModel;
