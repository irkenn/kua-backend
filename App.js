"use strict";

const express = require("express");
const cors = require("cors"); 
const morgan = require("morgan");

const { NotFoundError } = require("./expressError");

const app = express();

// Middleware JWT and login management
const { authenticateJWT, ensureLogin } = require("./middleware/auth");

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
// if it finds the token in the headers it will add it to res.locals.kuaUser
app.use(authenticateJWT);

//Require the routes
const searchRoutes = require("./routes/search");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const recipeRoutes = require("./routes/recipe");


//** +++++++ROUTES+++++++  */
// ensureLogin is used in the routes that are protected and require login
app.use("/search", ensureLogin, searchRoutes);
app.use("/user", ensureLogin, userRoutes);
app.use("/recipe", ensureLogin, recipeRoutes);
app.use("/auth", authRoutes);
//** +++++++END OF ROUTES+++++++  */


/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
    return next(new NotFoundError());
  });
  
  /** Generic error handler; anything unhandled goes here. */
  app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;
  
    return res.status(status).json({
      error: { message, status },
    });
  });
  
  module.exports = app;