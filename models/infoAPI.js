//This model handles all the communication with spoonacular API
const { default: axios } = require("axios");
const { API_TOKEN, API_BASE_URL } = require("../config");
const { BadRequestError } = require("../expressError");


require("axios");



class infoAPI {
    
    //centralized request method to avoid the repetition of try/catch blocks

    static async request(endpoint, params, method='get'){
        
        const url = `${API_BASE_URL}/${endpoint}`;
        const headers = { "x-api-key": API_TOKEN };

        console.debug("API call: ", "url", url, "params", params, "method", method);
        

        try{
            const res = await axios({url, method, params, headers});
            return res.data;
        }catch(err){
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    
    }

    static async searchIngredient ( ingredientName ){
        // The query consist in the query which is the ingredientName, number is set to 100 which is the maximum amount of results per request
        const queryParams = { query: ingredientName, number:100 };
        const res = await this.request('search', queryParams );
        return res.results;
    }
    
    static async ingredientInformation ( ingredientId ){
        //The ingredient ID comes from the searchIngredient, this takes the relevant information like 
        //ID, portion and unit to retrieve the information from the app
        const queryParams = { id: ingredientId };
        const res = await this.request(`${ingredientId}/information`);
        return res;
    }

    static async ingredientCalculate( ingredientData ){
        const { id, amount, unit } = ingredientData;
        if ( !id || !amount || ! unit) throw new BadRequestError("Mising arguments");

        //Since the thre required parameters are there, ingredientData passes as the queryParameters
        const res = await this.request(`${id}/information`, ingredientData);
        return res;
    }

    //search for a ingredient
    
    //get ingredient info
    
    //calculate the nutritional info per measure of the ingredient
};


module.exports =  infoAPI ;