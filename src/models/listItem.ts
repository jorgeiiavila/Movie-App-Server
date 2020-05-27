import { Schema, model, Document } from "mongoose";

export const ListItem: Schema = new Schema({
  title: { type: String, required: true },
  poster_path: { type: String, required: true },
  filmID: { type: Number, required: true },
  createdAt: { type: Date, required: true },
});

export interface IListItem extends Document {
  title: string;
  poster_path: string;
  filmID: number;
  createdAt: Date;
}
