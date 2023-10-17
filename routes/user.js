"use strict";
// App config
const express = require("express");
const router = express.Router();

const { BadRequestError, NotFoundError } = require("../expressError");

const User = require("../models/user");
const Recipe = require("../models/recipe");
const { createToken } = require("../helpers/tokens");


// Schemas for authentication
const jsonschema = require("jsonschema");
const userEditSchema = require("../schemas/userEditSchema.json");
const userDeleteShema = require("../schemas/userDeleteSchema.json");

const bcrypt = require("bcrypt");

router.get("/home", async function( req, res, next){
    try{
        const response = await Recipe.home();
        return res.json( response );

    }catch (err){
        return next(err);
    }

});




router.get("/:username", async function(req, res, next){
    try{
        //Fetches the user from the database
        const response = await User.get(req.params.username);
        return res.json( response );
    }catch(err){
        return next(err);
    }
});


// For patch and delete the API will have an extra step
// that will compare the passed password with the one from the database.
// The password and the email cannot be modified.

router.patch("/:username", async function(req, res, next){
    try{
        const validator = jsonschema.validate(req.body, userEditSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }else if(res.locals.kuaUser.username === req.params.username ){
            const response = await User.update( req.body, res.locals.kuaUser );
            //Includes a new Token in the responses
            const token = await createToken(response);
            response.token = token;
            
            return res.json( response );
        }
        throw new NotFoundError();
    }catch(err){
        return next(err);
    }

});

router.delete("/:username", async function(req, res, next){
    try{
        const validator = jsonschema.validate(req.body, userDeleteShema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        else if(res.locals.kuaUser.username === req.params.username ){
            // Correct password and email are required before deleting the user
            await User.delete( req.body );
            console.log('What are we waiting for?')
            return res.status(204).json();
        }
        throw new NotFoundError();
    }catch(err){
        return next(err);
    }
})

module.exports = router;