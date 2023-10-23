"use strict";

const express = require("express");
const router = express.Router();

// Middleware function to require user to be logged in
const { ensureLogin } = require("../middleware/auth");

const { BadRequestError } = require("../expressError");


const infoAPI = require("../models/infoAPI");
const User = require("../models/user");
const Recipe = require("../models/recipe");


//quick guide
//req.query <- the terms according to the API
//req.headers <- that's for the Token
//req.body <- the JSON data in the request

// all the routes are under /search

router.get("/ingredients/:ingredientName", async function (req, res, next){
    try{
        //This fetches the info from Spoonacular API
        const response = await infoAPI.searchIngredient( req.params.ingredientName );
        return res.json( response );
    }catch(err){
        return next(err);
    }
});


router.get("/ingredients/:ingredientId/information", async function (req, res, next){
    try{
        //This gets the details about the ingredient, available units
        const response = await infoAPI.ingredientInformation( req.params.ingredientId );
        return res.json( response );

    }catch(err){
        return next(err);
    }

});

router.get("/ingredients/:ingredientId/calculate", async function (req, res, next){
    try{
        //This retrieves from the body the id, unit and amount and retrieve the corresponding nutrien value from the API
        const response = await infoAPI.ingredientCalculate( req.body );
        return res.json( response );
    }catch(err){
        return next(err);
    }

});

router.get("/user/:username", async function (req, res, next){
    try{
        const response = await User.search(req.params.username);
        return res.json( response );

    }catch(err){
        return next(err);
    }
});

router.get("/recipe/:recipeName", async function (req, res, next){
    try{
        //This will create an array of the keywords used for the query
        const keywords = req.params.recipeName.split(' ');

        const response = await Recipe.search(keywords);
        return res.json( response );

    }catch(err){
        return next(err);
    }
});


module.exports = router;