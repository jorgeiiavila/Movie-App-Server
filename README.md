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
