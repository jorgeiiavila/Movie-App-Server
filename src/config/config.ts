const Config = {
  saltRounds: 10,
  port: process.env.PORT || 8080,
  mongoURL: process.env.MONGO_URL || "mongodb://localhost:27017/",
  db: process.env.DB || "movie-app",
  jwtSecretKey: process.env.JWT_SECRET_KEY || "movie-app",
  tmdb_api_key: process.env.TMDB_API_KEY,
};

export default Config;
