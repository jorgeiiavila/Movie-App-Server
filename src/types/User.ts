export type UserDTO = {
  _id: string;
  name: string;
  username: string;
  email: string;
  type: "user" | "admin";
};
