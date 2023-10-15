"use strict";

const db = require("../db");

//Helper function
const { sqlForPartialUpdate } = require("../helpers/helpers");

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

        //This query is a mini version of 'recipes' it does not include the ingredients.
        const query = `SELECT   
                          r.id,
                          r.title,
                          r.cal_count AS "calCount",
                          r.preparation,
                          r.description,
                          r.created_at AS "createdAt",
                          r.servings,
                          r.url_image AS "urlImage",
                            (SELECT 
                                jsonb_build_object
                                (
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
                        WHERE title ILIKE ${queryLine}`

        const recipeRes = await db.query(query, [...queryKeywords] )

        return recipeRes.rows[0];
    }

    static async get( recipeID ) {
      // this will retrieve the recipe based on the id
      const query = `SELECT
                        r.id,
                        r.title,
                        r.cal_count AS "calCount",
                        r.preparation,
                        r.description,
                        r.created_at AS "createdAt",
                        r.servings,
                        r.url_image AS "urlImage",
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
                      GROUP BY r.id, r.title, r.cal_count, r.preparation, r.description, r.created_at, r.servings, r.url_image, r.user_id;`
  
        
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
                              cal_count AS "calCount",
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
                                cal_count AS "calCount",
                                preparation,
                                description,
                                created_at AS "createdAt",
                                servings,
                                url_image AS "urlImage"`;      

      console.log('query', query)
      console.log('[...values, id, userId]', [...values, id, userId]);
      
      const result = await db.query(query, [...values, id, userId]);

      if (result.rows[0]){
        return result.rows[0];
      }else if(result.rows[0]?.userId != userId){
        //If the user is not the owner of the recipe
        throw new UnauthorizedError();
      }
      throw new BadRequestError();
    }
  }

  module.exports = Recipe;






  