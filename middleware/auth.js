"use strict"

//JWT packages
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

const User = require("../models/user");

const { UnauthorizedError } = require("../expressError");

//Middleware is gonna be used to check for the authentication 

function authenticateJWT(req, res, next){
    try{
        const token =  req.headers?.kua_token;
        // const token = req.headers && req.headers.kua_token;
        
        if(token){
            //if there's a token if will update it in res.locals at the same time it verifies it.
            res.locals.kuaUser = jwt.verify(token, SECRET_KEY);
        }
        return next();
    }catch(err){
        return next(err);
    }

}

function ensureLogin(req, res, next){
    try{
        console.log("ensureLogin -> res.locals.kuaUser", res.locals.kuaUser);
        if(!res.locals.kuaUser) throw new UnauthorizedError();
        return next();
    }catch(err){
        return next(err);
    }
}



module.exports = {
    ensureLogin,
    authenticateJWT
};


