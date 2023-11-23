"use strict";
// App config
const express = require("express");
const router = express.Router();
// Middleware


const { BadRequestError, NotFoundError } = require("../expressError");

const infoAPI = require("../models/infoAPI");
const Recipe = require("../models/recipe");

// Schemas for authentication
const jsonschema = require("jsonschema");
const recipeNewSchema = require("../schemas/recipeNewSchema.json");


router.get("/:recipeId", async function(req, res, next){
    try{
        //The route should be authenticated
        //Should there be an schema to compare with?
        //Fetches the recipe from the database
        
        const response = await Recipe.get(req.params.recipeId);
        return res.json( response );
    }catch(err){
        return next(err);
    }
});


router.post("/", async function(req, res, next){
    try{
        // The req.body should be caompared with an schema, then passed to the model
        const validator = jsonschema.validate(req.body, recipeNewSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        
        const response = await Recipe.new(req.body);
        
        return res.status(201).json( response );

    }catch(err){
        return next(err);
    }
});


router.patch("/:recipeId", async function (req, res, next){
    try{
        if(req.params.recipeId != req.body.id) throw new BadRequestError();
        
        //now make a route so only the owner of the recipe can alter it
        const currentUserId = res.locals.kuaUser.userId;

        const response = await Recipe.update(req.body, currentUserId);

        return res.json( response );
    }catch(err){
        return next(err);
    }

});


router.post("/:recipeId/add", async function ( req, res, next ){
    try{
        // It should it compare with some schema so all the information is there
                
        const userId = res.locals.kuaUser.userId;  
        const recipeId = req.params.recipeId;
        
        
        const response = await Recipe.addIngredients(recipeId, req.body, userId);
        return res.json( response );
    }catch(err){
        return next(err);
    }

});

module.exports = router;