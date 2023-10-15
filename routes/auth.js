"use strict";

const express = require("express");
const router = express.Router();

//JSON schema
const jsonschema = require("jsonschema");
const userSignUpSchema = require("../schemas/userRegisterSchema.json");
const userLoginShema = require("../schemas/userLoginSchema.json");

//JWT's and authentication
const { createToken } = require("../helpers/tokens");
const { ensureLogin } = require("../middleware/auth");

// Error handling
const { BadRequestError } = require("../expressError");
// User model
const User = require("../models/user");


router.post("/signup", async function( req, res, next){
    try{
        //User signup to add a new user to the database
        const validator = jsonschema.validate(req.body, userSignUpSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const response = await User.register( req.body );
        return res.status(201).json( response );

    }catch(err){
        return next(err);
    }
});


/**
 * This compares to the schema, users the User.auth method to validate and 
 * creates and return the corresponding JWT.
 */
router.post("/token", async function ( req, res, next){
    try{
        if (!req.body.username && !req.body.email) throw new BadRequestError(`Provide a username or email to log in`);
        
        const response = await User.authenticate(req.body);
       
        //any error in auth should be handled before here
        //Creation of the JWT and passed to the response
        const token = await createToken(response);
        response.token = token;
        return res.json( { response });

    }catch(err){
        return next(err);
    }
});

// router.post("/logout/:username", ensureLogin, async function ( req, res, next){
//     try{
//         if(res.locals.kuaUser.username === req.params.username){
//             delete res.locals.kuaUser;
//         }
//         console.log('res.locals.kuaUser', res.locals.kuaUser);
//         return res.json({ logout:true });
//     }catch(err){
//         return next(err);
//     }
// });


module.exports = router;