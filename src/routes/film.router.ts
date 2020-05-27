import { Router } from "express";
import { IFeedback } from "../models/feedback";
import { initConnection } from "../utils/utils";
import * as FilmLogic from "../logic/film.logic";
import { FilmData, Search } from "../types/film";
import { Errors } from "../errors/errors";
import { IListItem } from "../models/listItem";
import ListName from "../types/ListType";
import { FeedbackStatus } from "../types/Feedback";

const router = Router();

router.get("/load/:id", (req, res, next) => {
  const filmID = req.params.id;
  const userID = res.locals.userID;

  if (isNaN(Number(filmID))) {
    next(Errors.INVALID_FILM_ID());
    return;
  }
  initConnection<FilmData>(
    () => FilmLogic.fetchFilm(userID, Number(filmID)),
    req,
    res
  );
});

router.get("/search", (req, res, next) => {
  const query = req.query.query as string;
  if (!query) {
    next(Errors.MISSING_QUERY());
    return;
  }
  initConnection(() => FilmLogic.searchFilms(query), req, res);
});

router.post("/list/:list", (req, res, next) => {
  const list = req.params.list;
  const listItem = req.body;

  if (!["toWatch", "watched", "favorites"].some((x) => x === list)) {
    next(Errors.INVALID_LIST_NAME());
    return;
  }

  if (!listItem.title || !listItem.poster_path || !listItem.filmID) {
    next(Errors.INCOMPLETE_FORM());
    return;
  }

  if (isNaN(Number(listItem.filmID))) {
    next(Errors.INVALID_FILM_ID());
    return;
  }

  initConnection<IListItem>(
    () => FilmLogic.addToList(res.locals.userID, list, listItem),
    req,
    res
  );
});

router.get("/list/:list", (req, res, next) => {
  const list = req.params.list as ListName;

  if (!["toWatch", "watched", "favorites"].some((x) => x === list)) {
    next(Errors.INVALID_LIST_NAME());
    return;
  }

  initConnection(() => FilmLogic.fetchList(res.locals.userID, list), req, res);
});

router.delete("/list/:list/:filmID", (req, res, next) => {
  const userID = res.locals.userID;
  const list = req.params.list as ListName;
  const filmID = req.params.filmID;

  if (!["toWatch", "watched", "favorites"].some((x) => x === list)) {
    next(Errors.INVALID_LIST_NAME());
    return;
  }

  if (isNaN(Number(filmID))) {
    next(Errors.INVALID_FILM_ID());
    return;
  }

  initConnection<number>(
    () => FilmLogic.removeFromList(userID, list, Number(filmID)),
    req,
    res
  );
});

router.post("/feedback", (req, res) => {
  const feedback = req.body as IFeedback;
  feedback.review = feedback.review.trim();
  const userID = res.locals.userID;
  initConnection<IFeedback>(
    () => FilmLogic.postFeedback(userID, feedback),
    req,
    res
  );
});

router.patch("/feedback/:id", (req, res, next) => {
  const feedbackID = req.params.id;
  const feedback = req.body as IFeedback;

  if (Object.keys(feedback).length === 0) {
    next(Errors.INCOMPLETE_FORM());
    return;
  }
  if (feedbackID !== feedback._id) {
    next(Errors.MISMATCHED_IDS());
    return;
  }

  initConnection<IFeedback>(
    () => FilmLogic.updateFeedback(feedbackID, feedback),
    req,
    res
  );
});

router.get("/feedback/pending", (req, res, next) => {
  const userType = res.locals.userType;

  if (userType !== "admin") {
    next(Errors.NOT_ENOUGH_PRIVILEGES());
    return;
  }

  initConnection(() => FilmLogic.fetchPendingFeedbacks(), req, res);
});

router.put("/feedback/:feedbackID/:status", (req, res, next) => {
  const feedbackID = req.params.feedbackID;
  const status = req.params.status as FeedbackStatus;
  const userType = res.locals.userType;

  if (userType !== "admin") {
    next(Errors.NOT_ENOUGH_PRIVILEGES());
    return;
  }

  if (!feedbackID) {
    next(Errors.MISSING_FEEDBACK_ID());
    return;
  }
  if (["pending", "accepted", "rejected"].every((x) => x != status)) {
    next(Errors.INCORRECT_STATUS());
    return;
  }

  initConnection(
    () => FilmLogic.updateFeedbackStatus(feedbackID, status),
    req,
    res
  );
});

export default router;
