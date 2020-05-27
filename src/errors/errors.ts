export class CustomError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const formatMessage = (message = "", ...args: string[]) =>
  message.replace(/{(\d+)}/g, (subStr, [index]) => args[index]);

export const ErrorEnums = {
  INCOMPLETE_FORM: "Please complete the form",
  AUTH_FAILED: "Authentication failed, missing token or session expired.",
  USERNAME_ALREADY_TAKEN:
    "The username you selected is already taken, please choose another.",
  USER_OR_PASSWORD_INCORRECT: "The user or password are incorrect.",
  NOT_FOUND: "Not Found",
  MISSING_TOKEN: "Token is missing in request.",
  INVALID_TOKEN: "Token is expired or invalid.",
  INTERNAL_ERROR: "Internal Server Error",
  INVALID_FILM_ID: "The film id sent is invalid.",
  MISSING_IN_DB: "Element missing in database.",
  MISMATCHED_IDS: "ID in params is different to ID in body.",
  INVALID_LIST_NAME: "The list name is invalid.",
  MISSING_QUERY: "Missing query in request.",
  MISSING_FEEDBACK_ID: "Missing feedback id in request.",
  INCORRECT_STATUS: "Incorrect feedback status in request.",
  NOT_ENOUGH_PRIVILEGES: "Not enough privileges to access this section.",
  INVALID_PASSWORD: "Password needs at least eight characters.",
  REPEATED_USERNAME_OR_EMAIL: "Username or email are already in use.",
} as const;

export const Errors = {
  INCOMPLETE_FORM: () => {
    return new CustomError(400, ErrorEnums.INCOMPLETE_FORM);
  },
  AUTH_FAILED: () => {
    return new CustomError(400, ErrorEnums.AUTH_FAILED);
  },
  USERNAME_ALREADY_TAKEN: () => {
    return new CustomError(400, ErrorEnums.USERNAME_ALREADY_TAKEN);
  },
  USER_OR_PASSWORD_INCORRECT: () => {
    return new CustomError(400, ErrorEnums.USER_OR_PASSWORD_INCORRECT);
  },
  NOT_FOUND: () => {
    return new CustomError(404, ErrorEnums.NOT_FOUND);
  },
  MISSING_TOKEN: () => {
    return new CustomError(400, ErrorEnums.MISSING_TOKEN);
  },
  INVALID_TOKEN: () => {
    return new CustomError(400, ErrorEnums.INVALID_TOKEN);
  },
  INVALID_FILM_ID: () => {
    return new CustomError(400, ErrorEnums.INVALID_FILM_ID);
  },
  MISSING_IN_DB: () => {
    return new CustomError(400, ErrorEnums.MISSING_IN_DB);
  },
  MISMATCHED_IDS: () => {
    return new CustomError(400, ErrorEnums.MISMATCHED_IDS);
  },
  INVALID_LIST_NAME: () => {
    return new CustomError(400, ErrorEnums.INVALID_LIST_NAME);
  },
  MISSING_QUERY: () => {
    return new CustomError(400, ErrorEnums.MISSING_QUERY);
  },
  MISSING_FEEDBACK_ID: () => {
    return new CustomError(400, ErrorEnums.MISSING_FEEDBACK_ID);
  },
  INCORRECT_STATUS: () => {
    return new CustomError(400, ErrorEnums.INCORRECT_STATUS);
  },
  NOT_ENOUGH_PRIVILEGES: () =>
    new CustomError(403, ErrorEnums.NOT_ENOUGH_PRIVILEGES),
  INVALID_PASSWORD: () => new CustomError(400, ErrorEnums.INVALID_PASSWORD),
  REPEATED_USERNAME_OR_EMAIL: () =>
    new CustomError(409, ErrorEnums.REPEATED_USERNAME_OR_EMAIL),
} as const;
