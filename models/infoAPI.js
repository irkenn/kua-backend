//This model handles all the communication with spoonacular API
const { default: axios } = require("axios");
const { API_TOKEN, BASE_URL } = require("../config");
require("axios");



class infoAPI {
    
    //centralized request method to avoid the repetition of try/catch blocks

    static request(endpoint, data={}, method='get', keyword, unit=undefined, amount=undefined){
        console.debug("API call: ", "endpoint", endpoint, "data", data, "method", method, "keyword", keyword, "unit", unit, "amount", amount );
        
        const url = `${BASE_URL}/${endpoint}`;

        const headers = { "x-api-key": API_TOKEN};
    
    
    
    }

    static async searchIngredient ( ingredientName ){
        const res = await axios.get(this.base_url);

    }
    
    //search for a ingredient
    
    //get ingredient info
    
    //calculate the nutritional info per measure of the ingredient
};


