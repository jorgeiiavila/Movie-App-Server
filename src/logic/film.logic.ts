import Feedback, { IFeedback } from "../models/feedback";
import {
  fetchFilmTMDB,
  fetchFilmCastAndCrewTMDB,
  searchFilmsTMDB,
} from "../utils/tmdb";
import { FilmData, Search } from "../types/film";
import { Errors, CustomError, ErrorEnums } from "../errors/errors";
import { IListItem } from "../models/listItem";
import User from "../models/user";
import ListName from "../types/ListType";
import { FeedbackStatus } from "../types/Feedback";

export async function fetchFilm(userID: string, filmID: number) {
  const [film, castAndCrew, feedback, user] = await Promise.all([
    fetchFilmTMDB(filmID),
    fetchFilmCastAndCrewTMDB(filmID),
    Feedback.findOne({ filmID }),
    User.findById(userID),
  ]);

  const isToWatch = user?.toWatch.some((x) => x.filmID === filmID);
  const isFavorite = user?.favorites.some((x) => x.filmID === filmID);

  const data = {
    film,
    castAndCrew,
    feedback,
    isToWatch,
    isFavorite,
  } as FilmData;
  return { data, statusCode: 200 };
}

export async function searchFilms(query: string) {
  const search = await searchFilmsTMDB(query);
  const filteredResults = search.results.filter((x) => !!x.poster_path);
  const data = { ...search, results: filteredResults } as Search;
  return { data, statusCode: 200 };
}

export async function addToList(
  userID: string,
  listName: string,
  listItem: IListItem
) {
  const newListItem = { ...listItem, createdAt: new Date() } as IListItem;
  const user = await User.findById(userID);

  listItem.createdAt = new Date();

  if (listName === "toWatch") user?.toWatch.push(listItem);
  if (listName === "watched") user?.watched.push(listItem);
  if (listName === "favorites") user?.favorites.push(listItem);

  await user?.save();

  return { data: listItem, statusCode: 200 };
}

export async function removeFromList(
  userID: string,
  listName: ListName,
  filmID: number
) {
  const user = await User.findById(userID);

  if (listName === "toWatch")
    user!.toWatch = user!.toWatch.filter((x) => x.filmID !== filmID);
  if (listName === "watched") {
    user!.watched = user!.watched.filter((x) => x.filmID !== filmID);
    await Feedback.remove({ userID, filmID });
  }
  if (listName === "favorites")
    user!.favorites = user!.favorites.filter((x) => x.filmID !== filmID);

  await user?.save();

  return { data: filmID, statusCode: 200 };
}

export async function fetchList(userID: string, listName: ListName) {
  const user = await User.findById(userID);
  if (listName === "toWatch") return { data: user?.toWatch, statusCode: 200 };
  else if (listName === "watched")
    return { data: user?.watched, statusCode: 200 };
  return { data: user?.favorites, statusCode: 200 };
}

export async function postFeedback(userID: string, feedback: IFeedback) {
  const user = await User.findById(userID);
  const feedbackDoc = new Feedback(feedback);
  feedbackDoc.status = feedbackDoc.review ? "pending" : "accepted";
  feedbackDoc.userID = userID;
  const watchedItem = {
    title: feedbackDoc.title,
    poster_path: feedbackDoc.poster_path,
    createdAt: new Date(),
    filmID: feedback.filmID,
  };
  feedbackDoc.created_at = new Date();
  await feedbackDoc.save();

  user?.watched.push(watchedItem as IListItem);
  await user?.save();

  return { data: feedbackDoc, statusCode: 200 };
}

export async function updateFeedback(feedbackID: string, feedback: IFeedback) {
  const oldFeedback = await Feedback.findById({ _id: feedbackID });
  if (!oldFeedback) throw Errors.MISSING_IN_DB();

  oldFeedback.rating = feedback.rating ? feedback.rating : 0;
  oldFeedback.review = feedback.review ? feedback.review : "";
  oldFeedback.status = feedback.review ? "pending" : "accepted";

  await oldFeedback.save();

  return { data: oldFeedback, statusCode: 201 };
}

export async function getFeedbacks(userID: string) {
  const feedbacks = await Feedback.find({ userID });
  return { data: feedbacks, statusCode: 200 };
}

export async function fetchPendingFeedbacks() {
  const pendingFeedbacks = await Feedback.find({
    status: "pending",
    review: { $ne: "" },
  });
  return { data: pendingFeedbacks, statusCode: 200 };
}

export async function updateFeedbackStatus(
  feedbackID: string,
  status: FeedbackStatus
) {
  const feedback = await Feedback.findById(feedbackID);
  if (!feedback) throw Errors.NOT_FOUND();
  feedback.status = status;
  await feedback.save();
  return { data: feedback, statusCode: 201 };
}
