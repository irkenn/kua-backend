//This model handles all the communication with spoonacular API
const { default: axios } = require("axios");
const { API_TOKEN, API_BASE_URL } = require("../config");
require("axios");



class infoAPI {
    
    //centralized request method to avoid the repetition of try/catch blocks

    static async request(endpoint, params, method='get'){
        
        const url = `${API_BASE_URL}/${endpoint}`;
        const headers = { "x-api-key": API_TOKEN };

        console.debug("API call: ", "url", url, "params", params, "method", method);
        

        try{
            const res = await axios({url, method, params, headers});
            console.log("This is red.data from the API", res.data);
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
        return res;
    }
    
    //search for a ingredient
    
    //get ingredient info
    
    //calculate the nutritional info per measure of the ingredient
};


module.exports =  infoAPI ;