"use strict";

const db = require("../db");

//Helper function
const { sqlForPartialUpdate } = require("../helpers/helpers");
const infoAPI = require("./infoAPI");

const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
  } = require("../expressError");


class Recipe {

    static async search( keywordsArray ){
        
        //Creates a query based on the amount of keywords that keywordsArray contains 
        
        // should be handled in the route I believe
        if (!keywordsArray) throw new NotFoundError(`No search keywords provided`);

        let queryLine = [];
        let queryKeywords = [];
        keywordsArray.map((i, idx) => {
                            //formatted appropiately for SQL query
                            queryLine.push(`$${idx + 1}`)
                            queryKeywords.push(`%${i}%`)
                            }) 
        queryLine = queryLine.join(' OR title ILIKE ');

        const query = `SELECT
                        r.id,
                        r.title,
                        r.preparation,
                        r.description,
                        r.created_at AS "createdAt",
                        r.servings,
                        r.url_image AS "urlImage",
                        (
                          SELECT ROUND(AVG(ra.rating), 1)
                          FROM rating_votes AS "ra"
                          WHERE ra.recipe_id = r.id
                      ) AS "avgRating",
                      (
                        SELECT ROUND(SUM(i.kcal), 0)
                        FROM ingredients AS "i"
                        WHERE i.recipe_id = r.id
                      ) AS "calCount",
                      (
                        SELECT ROUND(SUM(i.protein) / r.servings, 0)
                        FROM ingredients AS "i"
                        WHERE i.recipe_id = r.id
                      ) AS "proteinPerServing",
                      (
                        SELECT ROUND(SUM(i.fat) / r.servings, 0)
                        FROM ingredients AS "i"
                        WHERE i.recipe_id = r.id
                      ) AS "fatPerServing",
                      (
                        SELECT ROUND(SUM(i.carbohydrates) / r.servings, 0)
                        FROM ingredients AS "i"
                        WHERE i.recipe_id = r.id
                      ) AS "carbohydratesPerServing",
                      (
                        SELECT ROUND(SUM(i.fiber) / r.servings, 0)
                        FROM ingredients AS "i"
                        WHERE i.recipe_id = r.id
                      ) AS "fiberPerServing",
                      (
                        SELECT ROUND(SUM(i.kcal) / r.servings, 0)
                        FROM ingredients AS "i"
                        WHERE i.recipe_id = r.id
                      ) AS "calPerServing",
                        (
                            SELECT jsonb_build_object(
                                'id', u.id,
                                'username', u.username,
                                'bioInfo', u.bio_info,
                                'urlImage', u.url_image
                            )
                            FROM users AS "u"
                            WHERE u.id = r.user_id
                        ) AS "user",
                        jsonb_agg(
                            jsonb_build_object(
                                'id', i.id,
                                'name', i.name,
                                'unit', i.unit,
                                'amount', i.amount,
                                'kCal', i.kcal,
                                'protein', i.protein,
                                'fiber', i.fiber,
                                'fat', i.fat,
                                'carbohydrates', i.carbohydrates
                            )
                        ) AS "ingredients"
                    FROM recipe_info AS "r"
                    LEFT JOIN users AS "u" ON (r.user_id = u.id)
                    LEFT JOIN ingredients AS "i" ON (r.id = i.recipe_id)
                    WHERE title ILIKE ${queryLine}
                    GROUP BY r.id, r.title, r.preparation, r.description, r.created_at, r.servings, r.url_image, r.user_id;`;

        //This query is a mini version of 'recipes' it does not include the ingredients.

        const recipeRes = await db.query(query, [...queryKeywords] )

        if(!recipeRes.rows[0]) throw new NotFoundError(`The query didn't produced any results`);

        return recipeRes.rows;
    }

    static async get( recipeID ) {
      // this will retrieve the recipe based on the id
     
      const query = `SELECT
                        r.id,
                        r.title,
                        r.preparation,
                        r.description,
                        r.created_at AS "createdAt",
                        r.servings,
                        r.url_image AS "urlImage",
                        (
                          SELECT ROUND(AVG(ra.rating), 1)
                          FROM rating_votes AS "ra"
                          WHERE ra.recipe_id = r.id
                      ) AS "avgRating",
                      (
                        SELECT ROUND(SUM(i.kcal), 0)
                        FROM ingredients AS "i"
                        WHERE i.recipe_id = r.id
                      ) AS "calCount",
                      (
                        SELECT ROUND(SUM(i.kcal) / r.servings, 0)
                        FROM ingredients AS "i"
                        WHERE i.recipe_id = r.id
                      ) AS "calPerServing",
                      (
                        SELECT ROUND(SUM(i.protein) / r.servings, 0)
                        FROM ingredients AS "i"
                        WHERE i.recipe_id = r.id
                      ) AS "proteinPerServing",
                      (
                        SELECT ROUND(SUM(i.fat) / r.servings, 0)
                        FROM ingredients AS "i"
                        WHERE i.recipe_id = r.id
                      ) AS "fatPerServing",
                      (
                        SELECT ROUND(SUM(i.carbohydrates) / r.servings, 0)
                        FROM ingredients AS "i"
                        WHERE i.recipe_id = r.id
                      ) AS "carbohydratesPerServing",
                      (
                        SELECT ROUND(SUM(i.fiber) / r.servings, 0)
                        FROM ingredients AS "i"
                        WHERE i.recipe_id = r.id
                      ) AS "fiberPerServing",
                        (
                            SELECT jsonb_build_object(
                                'id', u.id,
                                'username', u.username,
                                'bioInfo', u.bio_info,
                                'urlImage', u.url_image
                            )
                            FROM users AS "u"
                            WHERE u.id = r.user_id
                        ) AS "user",
                        jsonb_agg(
                            jsonb_build_object(
                                'id', i.id,
                                'name', i.name,
                                'unit', i.unit,
                                'amount', i.amount,
                                'kCal', i.kcal,
                                'protein', i.protein,
                                'fiber', i.fiber,
                                'fat', i.fat,
                                'carbohydrates', i.carbohydrates
                            )
                        ) AS "ingredients"
                    FROM recipe_info AS "r"
                    LEFT JOIN users AS "u" ON (r.user_id = u.id)
                    LEFT JOIN ingredients AS "i" ON (r.id = i.recipe_id)
                    WHERE r.id = $1
                    GROUP BY r.id, r.title, r.preparation, r.description, r.created_at, r.servings, r.url_image, r.user_id;`;
      
      const response = await db.query(query, [recipeID]);

      if (!response) throw new NotFoundError(`No recipe with ID ${recipeID}`);

      return response.rows[0];
    }


    static async new( { userId, title, preparation, description, servings, urlImage } ){
      
      // jsonschema will handle if there are missing parameters
      const query = `INSERT INTO recipe_info
                        (user_id,
                        title,
                        preparation,
                        description,
                        servings,
                        url_image,
                        created_at)
                    VALUES ($1, $2, $3, $4, $5, $6, current_timestamp)
                    RETURNING id,
                              user_id AS "userID",
                              title,
                              preparation,
                              description,
                              created_at AS "createdAt",
                              servings,
                              url_image AS "urlImage"`;

      const result = await db.query(query, [userId, title, preparation, description, servings, urlImage]);
      
      return result.rows[0];
    }


    static async update( recipeData, userId ){

      const { id } = recipeData;
      delete recipeData.id;
      const { setCols, values } = sqlForPartialUpdate(
        recipeData,
        {  
          title: "title",
          preparation : "preparation",
          description : "description",
          servings : "servings",
          urlImage : "url_image"
        });
      
      const idIndex = "$"+(values.length + 1);
      const indexUserId = "$"+(values.length + 2);
      
      const query = `UPDATE recipe_info
                      SET ${setCols}
                      WHERE id = ${idIndex} AND user_id = ${indexUserId}   
                      RETURNING id,
                                user_id AS "userId",
                                title,
                                preparation,
                                description,
                                created_at AS "createdAt",
                                servings,
                                url_image AS "urlImage"`;      

      
      const result = await db.query(query, [...values, id, userId]);

      if (result.rows[0]){
        return result.rows[0];
      }else if(result.rows[0]?.userId != userId){
        //If the user is not the owner of the recipe
        throw new UnauthorizedError();
      }
      // else there was a problem with the request
      throw new BadRequestError();
    }
  
    static async addSingleIngredient( ingredient, userId, recipeId ){

      const{ name, unit, amount  }= ingredient;
    
      // This is to search for the appropiate recipe info
      const ingredientInfo = await infoAPI.ingredientCalculate( ingredient );

      if(!ingredientInfo)throw new BadRequestError();
        
      let kcal = "";
      let protein = "";
      let fiber = "";
      let fat = "";
      let carbohydrates = "";
      
      //Finds the appropiate values from the array of objects
      for(const nutrient of ingredientInfo.nutrition.nutrients){
        
        if(nutrient.name === 'Protein'){ 
          protein = nutrient.amount;
        }
        else if(nutrient.name === 'Carbohydrates'){ 
          carbohydrates = nutrient.amount;
        }
        else if(nutrient.name == 'Calories'){ 
          kcal = nutrient.amount;
        }
        else if(nutrient.name == 'Fat'){
          fat = nutrient.amount;
        }
        else if(nutrient.name == 'Fiber'){
          fiber = nutrient.amount;          
        }
      }
      
      // Add the ingredient to the database (still)
      const query = `INSERT INTO ingredients
                        ( recipe_id, 
                          name, 
                          unit, 
                          amount, 
                          kcal, 
                          protein, 
                          fiber, 
                          fat, 
                          carbohydrates)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                    RETURNING id,
                              recipe_id AS "recipeId", 
                              name, 
                              unit, 
                              amount, 
                              kcal, 
                              protein, 
                              fiber, 
                              fat, 
                              carbohydrates`;

      const response = await db.query(query, [recipeId, name, unit, amount, kcal, protein, fiber, fat, carbohydrates]);

      return response.rows[0];
    }

    static async addIngredients( recipeId, ingredientList, userId ){
      
      //Checks if the recipe exists in the database
      const query1 = `SELECT * FROM recipe_info
                                WHERE id=$1`
      const response = await db.query(query1, [recipeId]);
      
      // Authentication verifies that the user editing the the recipe is the owner
      if(!response.rows[0]) throw new BadRequestError("Ivalid recipe id");
      else if( response.rows[0].user_id != userId ) throw new UnauthorizedError();

      const responseArray = [];

      for ( const ingredientId in ingredientList ){
        const ingredient = ingredientList[ingredientId];
        const response = await this.addSingleIngredient( ingredient, userId, recipeId );
        responseArray.push(response);
      }
      return responseArray;
    }

    static async home(){
      
      //This query is a mini version of 'recipes' it does not include all the ingredients details and nutrition facts.
      const query = `SELECT
                        r.id,
                        r.title,
                        r.preparation,
                        r.description,
                        r.created_at AS "createdAt",
                        r.servings,
                        r.url_image AS "urlImage",
                        (
                          SELECT ROUND(AVG(ra.rating), 1)
                          FROM rating_votes AS "ra"
                          WHERE ra.recipe_id = r.id
                      ) AS "avgRating", 
                      (
                        SELECT ROUND(SUM(i.kcal), 0)
                        FROM ingredients AS "i"
                        WHERE i.recipe_id = r.id
                      ) AS "calCount",
                      (
                        SELECT ROUND(SUM(i.kcal) / r.servings, 0)
                        FROM ingredients AS "i"
                        WHERE i.recipe_id = r.id
                      ) AS "calPerServing",
                        (
                            SELECT jsonb_build_object(
                                'id', u.id,
                                'username', u.username,
                                'bioInfo', u.bio_info,
                                'urlImage', u.url_image
                            )
                            FROM users AS "u"
                            WHERE u.id = r.user_id
                        ) AS "user"
                    FROM recipe_info AS "r"
                    LEFT JOIN users AS "u" ON (r.user_id = u.id)
                    GROUP BY r.id, r.title, r.preparation, r.description, r.created_at, r.servings, r.url_image, r.user_id
                    ORDER BY r.created_at DESC;`;

        const recipeRes = await db.query( query );

        return recipeRes.rows;
    }

  }

  module.exports = Recipe;






  