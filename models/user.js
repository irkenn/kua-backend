"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const { BCRYPT_WORK_FACTOR } = require("../config.js");
const { createToken } = require("../helpers/tokens");
// Helper functions
const { sqlForPartialUpdate } = require("../helpers/helpers");


const { NotFoundError, BadRequestError } = require("../expressError");
const { query } = require("express");



class User {

    //urlImage still needs to be processed elsewere

    static async authenticate( { username, email, password }){
        // find the user first with either the username or the email
        // the app won't give extra information about if the username or email is already regitered
        
        let queryLine;
        let queryParams;
        
        if (username){
            queryLine = 'username';
            queryParams = username;
        }else if (email){
            const hashedEmail = crypto.createHash('sha256').update(email).digest('hex');
            queryLine = 'email';    
            queryParams = hashedEmail;
        }
                  
        const query = ` SELECT   id,
                                username,
                                password
                        FROM users
                        WHERE ${queryLine} = $1`;        
            
        const result = await db.query(query, [queryParams])
        const user = result.rows[0];
        
        if (user) {
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true) {
              delete user.password;
              return user;
            }
        }
        throw new BadRequestError(`Invalid username/email and password`);
    }


    static async register( { username, password, email, bioInfo, urlImage } ){
        // email is hashed before the query using sha256
        const hashedEmail = crypto.createHash('sha256').update(email).digest('hex');
         
        //The username and email are "UNIQUE" in the table, the query checks if they're available 
        const duplicateCheck = await db.query(
            `SELECT username
             FROM users
             WHERE username = $1 OR email = $2`,
          [username, hashedEmail],
        );
  
        if (duplicateCheck.rows[0]) {
          throw new BadRequestError(`Sorry, but the username or email has already taken, please try another: username: ${username} email: ${email}`);
        }
        //password is hashed with bcrypt before being stored in the database
        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users
                (username,
                password,
                email,
                bio_info,
                url_image)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING   username,
                            bio_info AS "bioInfo",
                            url_image AS "urlImage"`,
            [   username,
                hashedPassword,
                hashedEmail,
                bioInfo,
                urlImage ]
        );
        
        const user = result.rows[0];
        //Add the token as part of the signup process
        const token = createToken(user);
        user.token = token;
        
        return user;
    }


    static async get( username ){
        const userRes = await db.query(
            `SELECT id,
                    username,
                    bio_info AS "bioInfo",
                    url_image AS "urlImage"
            FROM users
            WHERE username = $1`,
            [username]
        );
        const user = userRes.rows[0];
        
        if (!user) throw new NotFoundError(`No user: ${username}`);
        
        const userRecipes = await db.query(
            `SELECT *
            FROM recipe_info 
            WHERE recipe_info.user_id = $1`, [user.id]);
        
        user.recipes = userRecipes.rows;
        return user;
    }

    static async search( usernameKeyword ){
        
        const userRes = await db.query(
            `SELECT id,
                    username,
                    bio_info AS "bioInfo",
                    url_image AS "urlImage"
            FROM users
            WHERE username ILIKE $1`,
            [`%${usernameKeyword}%`]
        );
        
        return userRes.rows;
    }

    static async update( data, JWTUserData ){
        // In this case, the password and the email cannot be modified.
        
        // ++++ So de deal here is to compare probably the username from the JWT
        // In order to prevent an old Token from modifiying further
        const { username } = JWTUserData;
        const { password, email } = data;
        // If the authentication is not correct it will throw an error
        
        await this.authenticate({ username, password });

        //the query will be based on the hashed email address
        const hashedEmail = crypto.createHash('sha256').update(email).digest('hex');
        
        // username can change, but not email or password
        delete data.password;
        delete data.email;

        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                username : "username",
                bioInfo: "bio_info",
                urlImage: "url_image"
            });
        const usernameVarIdx = "$" + (values.length + 1);
        
        const query = `UPDATE users
                        SET ${setCols}
                        WHERE email = ${usernameVarIdx}
                        RETURNING   id,
                                    username,
                                    bio_info AS "bioInfo",
                                    url_image AS "urlImage"`;
        
        const result = await db.query(query, [...values, hashedEmail]);
        
        //generate and include also a new Token in the response.
        const user = result.rows[0];
      
        return user;
    }

    static async delete( data ){

        const { email, password } = data;
        // If the authentication is not correct it will throw an error
        await this.authenticate({ email, password });

        const result = await db.query(
            `DELETE 
            FROM users
            WHERE username = $1
            RETURNING id, username`, 
            [data.username]
        );
        if(!result.rows[0]) throw new NotFoundError(`User not found`);
        
        //return the user info
        return result.rows[0];
    }

}

module.exports = User;