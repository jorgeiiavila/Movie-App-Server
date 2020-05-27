# Movie App Server

## Description

Movie App is a simple web application for helping the user keep track of which movies he/she wants to watch, which he/she has already seen and which are his/her favorites. It also allows you to post ratings and reviews about the movies.

It uses MongoDB for the database and tMDB API for fetching the information about the movies.

This a project for my web development class.

## Dependencies

- NodeJS
- MongoDB

## Running Instructions

1. Run `npm i` or `yarn install` to install project's dependencies.
2. Run command `npm run dev` or `yarn run dev` to run the server in dev mode.

## Other Considerations

The application uses tMDB for the movie data fetching so, in order for the application to be fully functional, you need to register at tMDB to generate an API key and add it to a .env file as TMDB_API_KEY.

## Endpoints Documentation

The application has two types of endpoints: User and Film.

### User Endpoints (api/user)

User endpoints are public.

#### /register - POST

Register is used to create a new user. It expects the body of the user. The body must have username, name, email and password.

#### /authenticate - POST

Authenticate is for the user to login to the system. It expects the username and password in the body.

### Film Endpoints (api/film)

All film endpoints require the user to be logged in, otherwise they are not accesible.

#### /load/:id - GET

Loads the film's data.

#### /search - GET

Searches for films that match the specified query.

#### /list/:list - POST

Adds a new film to the list specified in the :list param.

#### /list/:list - GET

Loads all the films in the list specified in the :list param.

#### /list/:list/:filmID - DELETE

Removes the film with :filmID from the list specified in the :list param.

#### /feedback - POST

Creates a new Feedback. It expects the rating, review and filmID.

#### /feedback/:id - PATCH

Updates the feedback with :id.

#### /feedback/pending - GET

Gets all the feedbacks with status pending. This route is only accesible by the admin.

#### /feedback/:feedbackID/:status - PUT

Updated the feedback with :feedbackID with the :status. This route is only accesible by the admin.
