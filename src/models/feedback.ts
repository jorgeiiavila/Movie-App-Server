import { Schema, model, Document } from "mongoose";
import { FeedbackStatus } from "../types/Feedback";

const Feedback: Schema = new Schema({
  title: { type: String, required: true },
  poster_path: { type: String, required: true },
  created_at: { type: Date, required: true },
  userID: { type: String, required: true },
  rating: { type: Number, required: true },
  review: { type: String },
  status: { type: String, required: true },
  filmID: { type: Number, required: true },
});

export interface IFeedback extends Document {
  _id: string;
  title: string;
  poster_path: string;
  created_at: Date;
  userID: string;
  rating: number;
  review: string;
  status: FeedbackStatus;
  filmID: number;
}

export default model<IFeedback>("Feedback", Feedback);
