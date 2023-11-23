# Kúa Food App (backend)


## General description about Kúa Food App
This is the backend of Kúa food app, which is a social network app around food and nutrition. 
Its purpose is to allow users to create digital recipes that can be shared between members of the app.
The app uses sn external API: [Spoonacular API](https://spoonacular.com/food-api/docs) from which fetches ingredients info and a detailed version of their nutritional values.

## Implemented features


### Tech Stack and functionalities

The app uses the environment provided by **Node-Express**. 
Some of the features are:
1. API authentication with JSON Web Tokens
1. API calls with AXIOS
1. Passwords encryption with bcrypt email encryption with SHA-256
1. Middleware with Morgan and secured with CORS
1. Server side data validation with JSON Schema
1. Communication with PostgreSQL with NodePG

Database management is done through **PostgreSQL**.

The backend API with its database is currently deployed using [Render](https://render.com), with the following endpoint ```https://kua-backend.onrender.com```

## Instructions

### Authentication

Kua API requires users to sign up and authenticate to obtain a valid token, which is required for any further interaction with the app

The following **authentication** request are done to endpoint 
```
https://kua-backend.onrender.com/auth
```

#### Signing up
Users need to sign up to use the API. 
For signing up, the user should make a HTTP request the following way:  

Request: ```POST```  
Endpoint: ```https://kua-backend.onrender.com/auth/signup```  
JSON body:  
```json
{
  "username": "John Doe",
  "email": "john_doe@aol.com",
  "password": "JoHn_Do3&&",
  "bioInfo": "This is my personal info that's gonna be displayed in my bio"
  "urlImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOWzTBt65oJxMTZCk0xevZezcExJQC7toe1Q&usqp=CAU"
}
```
In this case ```bioInfo``` and ```urlImage```are optional fields.
**Constrains**
Username is a unique identifier, so it cannot have any spaces in between, and in the case of being duplicated it will return an error.


The [response](#API-response) should look like this:  
```json
{
	"id": 5,
	"username": "John Doe",
	"bioInfo": "This is my personal info that's gonna be displayed in my bio",
	"urlImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOWzTBt65oJxMTZCk0xevZezcExJQC7toe1Q&usqp=CAU",
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvaG4gRG9lIiwidXNlcklkIjo1LCJpYXQiOjE2OTc4Mjc5MDB9.u2wB0vbXJBAjY_HXp9jWrQeOOqdgRZJ9yTn0kMPWvJI"
}
```
With a **201 Created** status code and the addition of a ```token```.

#### Login in

For already registered users that want to obtain a new ```token``` the request is made the following way:

Request: ```POST```  
Endpoint: ```https://kua-backend.onrender.com/auth/token```  
JSON body:  
```json
{
  "username": "John Doe",
  "email": "john_doe@aol.com",
  "password": "JoHn_Do3&&",
}
```
In this case ```password``` is a necessary field, ```username```or ```email```can be used alternateviley, there's no need to use both for this process.
The response will look the same way as with the auth process: [response](#API-response)

### User pages

From now on, in order to access the rest of the app features. The browser should include the token in the headers. The given token should be included under the name ```kua_token```, for any given request the token should be included.

#### User homepage

To retrieve the information from the user homepage, the information should be requested the following way:

Request: ```GET```
Endpoint: ```https://kua-backend.onrender.com/user/home```  

Reqest headers:
```json 
kua_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJhdG1hbiIsInVzZXJJZCI6MywiaWF0IjoxNjk2OTAxMDQ5fQ.uRGCVSYt72bsJgJfKDO1TtRkkWlns1Pui252YS73vg0
```

The response will be an array of objects, each object corresponds to a recipe stored in the database. Each recipe object includes relevant information about the user.

```json
[
	{
		"id": 1,
		"title": "Peas with rice",
		"calCount": 1200,
		"preparation": "Prepare the rice and mix it with peas",
		"description": "Easy an tasty recipe with an interesting twist",
		"createdAt": null,
		"servings": 2,
		"urlImage": "www.google.com",
		"avgRating": "4.5",
		"user": {
			"id": 1,
			"bioInfo": "My favorite recipes are cereal and instant noodles",
			"urlImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPpHLOST0fhz_-NIOTpe9jnxAsw8IpHc5Wrg&usqp=CAU",
			"username": "Anita"
		}
	},
	{
		"id": 2,
		"title": "Cheesecake",
		"calCount": 3000,
		"preparation": "Create a base with crushed cookies and use cheese for the topping",
		"description": "Prefect desert for every ocasion",
		"createdAt": null,
		"servings": 15,
		"urlImage": "www.yahoo.com",
		"avgRating": null,
		"user": {
			"id": 5,
			"bioInfo": "My favorite recipes are cereal and instant noodles",
			"urlImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPpHLOST0fhz_-NIOTpe9jnxAsw8IpHc5Wrg&usqp=CAU",
			"username": "John Doe"
		}
	}
]
```

#### User personal info

This endpoint will fetch information about a specific user, it requires the username to get information. 

Request: ```GET```
Endpoint: ```https://kua-backend.onrender.com/user/John%20Doe```

Reqest headers:
```json 
kua_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJhdG1hbiIsInVzZXJJZCI6MywiaWF0IjoxNjk2OTAxMDQ5fQ.uRGCVSYt72bsJgJfKDO1TtRkkWlns1Pui252YS73vg0
```

The response will return the user info and will also include the recipes that the user has created.
```json
{
	"id": 5,
	"username": "John Doe",
	"bioInfo": "This is my personal info that's gonna be displayed in my bio",
	"urlImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOWzTBt65oJxMTZCk0xevZezcExJQC7toe1Q&usqp=CAU",
	"recipes": [
		{
			"id": 3,
			"user_id": 5,
			"title": "Pizza",
			"preparation": "Heat it in the microwave",
			"description": "Convenient and easy to make",
			"created_at": "2023-10-21T00:42:25.099Z",
			"servings": 2,
			"url_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPpHLOST0fhz_-NIOTpe9jnxAsw8IpHc5Wrg&usqp=CAU"
		}
	]
}
```

#### Update user personal info

To modify the user info, the request should include in the body the data valid for authentication ```username```, ```email``` and ```password```. The endpoint of the user  Only if the username and id matches the url endpoint and the provided token matches as well, the user information will be updated.
Only the fields of ```username```, ```bioInfo``` and ```urlImage``` can be updated. ```email``` and ```password``` cannot be updated.

Request: ```PATCH```
Endpoint: ```https://kua-backend.onrender.com/user/John%20Doe```

Reqest headers:
```json 
kua_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJhdG1hbiIsInVzZXJJZCI6MywiaWF0IjoxNjk2OTAxMDQ5fQ.uRGCVSYt72bsJgJfKDO1TtRkkWlns1Pui252YS73vg0
```
JSON body:
```json 
{
  "username": "New John Doe",
  "email": "john_doe@aol.com",
  "password": "JoHn_Do3&&",
  "bioInfo": "This is my personal info that's gonna be displayed in my bio",
  "urlImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOWzTBt65oJxMTZCk0xevZezcExJQC7toe1Q&usqp=CAU"
}
```

The response will be an object with the updated info.

#### Delete user

To delete a user, the request should include in the body the data valid for authentication. Only if the username and id matches the url endpoint and the provided token matches as well, the user will be deleted.

Request: ```DELETE```
Endpoint: ```https://kua-backend.onrender.com/user/New%20John%20Doe```

Reqest headers:

```json 
kua_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJhdG1hbiIsInVzZXJJZCI6MywiaWF0IjoxNjk2OTAxMDQ5fQ.uRGCVSYt72bsJgJfKDO1TtRkkWlns1Pui252YS73vg0
```

JSON body:

```json
{
  "username": "New John Doe",
  "email": "john_doe@aol.com",
  "password": "JoHn_Do3&&"
}
```

### Recipe pages

#### Create a new recipe

To create a new recipe send a post request with the information in the body of the request. It is important to include the ```userId``` value. The id can be obtained from a get request.

Request: ```POST```
Endpoint: ```https://kua-backend.onrender.com/recipe/```

Reqest headers:

```json
kua_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJhdG1hbiIsInVzZXJJZCI6MywiaWF0IjoxNjk2OTAxMDQ5fQ.uRGCVSYt72bsJgJfKDO1TtRkkWlns1Pui252YS73vg0
```

JSON body

```json
{
	"userId": 5,
	"title": "Pizza",
	"preparation": "Heat it in the microwave",
	"description": "Convenient and easy to make",
	"servings": 2,
	"urlImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPpHLOST0fhz_-NIOTpe9jnxAsw8IpHc5Wrg&usqp=CAU"
}
```

The response will include ```id``` that corresponds to the recipe created.

```json
{
	"id": 3,
	"userID": 5,
	"title": "Pizza",
	"calCount": null,
	"preparation": "Heat it in the microwave",
	"description": "Convenient and easy to make",
	"createdAt": "2023-10-21T00:42:25.099Z",
	"servings": 2,
	"urlImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPpHLOST0fhz_-NIOTpe9jnxAsw8IpHc5Wrg&usqp=CAU"
}
```

#### Edit a recipe

It is important to match the body ```id``` of the recipe with the url ```id``` being passed. Only if the user is the creator of the recipe it will be allowed to modify it, otherwise it will return an unauthorized message.

Request: ```PATCH```
Endpoint: ```https://kua-backend.onrender.com/recipe/3```

Reqest headers:

```json
kua_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJhdG1hbiIsInVzZXJJZCI6MywiaWF0IjoxNjk2OTAxMDQ5fQ.uRGCVSYt72bsJgJfKDO1TtRkkWlns1Pui252YS73vg0
```
In this case we're gonna update the calorie count 

```json
{
	"id": 3,
	"userID": 5,
	"calCount": 2000
}
```

#### Add ingredients to a recipe

### Search elements

The search functionallity of the API, retrieves posible matches for users, basedn on theis username, it can also search recipes based on the recipe name, the result is an array of the posible results.

#### Search for a username

To search for a username there's no need to add anything to the body, everything is done on the request parameters

Request: ```GET```
Endpoint: ```https://kua-backend.onrender.com/search/user/John%20Doe```

Reqest headers:

```json
kua_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJhdG1hbiIsInVzZXJJZCI6MywiaWF0IjoxNjk2OTAxMDQ5fQ.uRGCVSYt72bsJgJfKDO1TtRkkWlns1Pui252YS73vg0
```


The response is an array of all the matches that the keywords produced, only the public info is available.

```json
[
	{
		"id": 5,
		"username": "New John Doe",
		"bioInfo": "This is my personal info that's gonna be displayed in my bio",
		"urlImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOWzTBt65oJxMTZCk0xevZezcExJQC7toe1Q&usqp=CAU"
	}
]
```

#### Search for a recipe

Request: ```GET```
Endpoint: ```https://kua-backend.onrender.com/search/recipe/pizza```

Reqest headers:

```json
kua_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJhdG1hbiIsInVzZXJJZCI6MywiaWF0IjoxNjk2OTAxMDQ5fQ.uRGCVSYt72bsJgJfKDO1TtRkkWlns1Pui252YS73vg0
```

The result will include all the information about the recipe, its author info, ingredients list and average of ratings.

```json
[
	{
		"id": 3,
		"title": "Pizza",
		"calCount": 2000,
		"preparation": "Heat it in the microwave",
		"description": "Convenient and easy to make",
		"createdAt": null,
		"servings": 2,
		"urlImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPpHLOST0fhz_-NIOTpe9jnxAsw8IpHc5Wrg&usqp=CAU\"",
		"avgRating": "4.5",
		"user": {
			"id": 3,
			"bioInfo": "This is my personal info that is gonna be displayed in my bio",
			"urlImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOWzTBt65oJxMTZCk0xevZezcExJQC7toe1Q&usqp=CAU\"",
			"username": "John Doe"
		},
		"ingredients": [
			{
				"id": 1,
				"fat": 4,
				"kCal": 36.36,
				"name": "dough",
				"unit": "kg",
				"fiber": 0,
				"amount": 1,
				"protein": 0,
				"carbohydrates": 0
			},
			{
				"id": 2,
				"fat": 0,
				"kCal": 3.3,
				"name": "tomato sauce",
				"unit": "cup",
				"fiber": 0.21,
				"amount": 0.5,
				"protein": 0.21,
				"carbohydrates": 0.53
			}
		]
	}
]
```

#### Search for ingredients

This will query from Spoonacular API and retrieve all the ingredients that match the keyword


Request: ```GET```
Endpoint: ```https://kua-backend.onrender.com/search/ingredients/tomato```

Reqest headers:

```json
kua_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJhdG1hbiIsInVzZXJJZCI6MywiaWF0IjoxNjk2OTAxMDQ5fQ.uRGCVSYt72bsJgJfKDO1TtRkkWlns1Pui252YS73vg0
```

The result consist in an array of the posible results that could match the users item. The ```id``` is important in order to get more information about the ingredient

```json
[
		{
			"id": 11529,
			"name": "tomato",
			"image": "tomato.png"
		},
		{
			"id": 11954,
			"name": "tomatillos",
			"image": "tomatillos.jpg"
		},
		{
			"id": 6159,
			"name": "tomato soup",
			"image": "tomato-soup.png"
		},
		{
			"id": 11887,
			"name": "tomato paste",
			"image": "tomato-paste.jpg"
		}
]
  
```

#### Search for ingredient information

This will query from Spoonacular API and retrieve all the details about the ingredient based on the ingredient ```id``` from the search igredient query.

Request: ```GET```
Endpoint: ```https://kua-backend.onrender.com/search/ingredients/11529/information```

Reqest headers:

```json
kua_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJhdG1hbiIsInVzZXJJZCI6MywiaWF0IjoxNjk2OTAxMDQ5fQ.uRGCVSYt72bsJgJfKDO1TtRkkWlns1Pui252YS73vg0
```

The result contains relevant information like the ```possibleUnits``` which will be used in combination with quantity to calculate the total amount of calories of the recipe.


```json
{
	"id": 11529,
	"original": "tomatoes",
	"originalName": "tomatoes",
	"name": "tomatoes",
	"possibleUnits": [
		"small",
		"cherry",
		"large whole",
		"large",
		"medium whole",
		"g",
		"wedge",
		"Italian tomato",
		"medium",
		"oz",
		"plum tomato",
		"serving",
		"piece",
		"slice",
		"small whole",
		"NLEA serving",
		"cup"
	],
	"consistency": "solid",
	"shoppingListUnits": [
		"pieces"
	],
	"aisle": "Produce",
	"image": "tomato.png",
	"meta": [],
	"categoryPath": [
		"vegetable"
	]
}
```

#### Calculate nutrient information

To calculate the nutrient information, the app needs to send through the json body three values ```id```, ```amount``` and ```unit```, taken from ```possibleUnits``` in the search for ingredients information endpoint.

Request: ```GET```
Endpoint: ```https://kua-backend.onrender.com/search/ingredients/11529/calculate```

Reqest headers:

```json
kua_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJhdG1hbiIsInVzZXJJZCI6MywiaWF0IjoxNjk2OTAxMDQ5fQ.uRGCVSYt72bsJgJfKDO1TtRkkWlns1Pui252YS73vg0
```

Request JSON body

```json
{
	"id": 11529,
	"amount": 300,
	"unit": "g"
}
```

The response consists of a large object that contains all the information necesary to calculate and add the information to the recipe. The response body will look like this:

```json
{
	"id": 11529,
	"original": "tomatoes",
	"originalName": "tomatoes",
	"name": "tomatoes",
	"amount": 300,
	"unit": "g",
	"unitShort": "g",
	"unitLong": "grams",
	"possibleUnits": [
		"small",
		"cherry",
		"large whole",
		"large",
		"medium whole",
		"g",
		"wedge",
		"Italian tomato",
		"medium",
		"oz",
		"plum tomato",
		"serving",
		"piece",
		"slice",
		"small whole",
		"NLEA serving",
		"cup"
	],
	"estimatedCost": {
		"value": 88,
		"unit": "US Cents"
	},
	"consistency": "solid",
	"shoppingListUnits": [
		"pieces"
	],
	"aisle": "Produce",
	"image": "tomato.png",
	"meta": [],
	"nutrition": {
		"nutrients": [
			{
				"name": "Folic Acid",
				"amount": 0,
				"unit": "µg",
				"percentOfDailyNeeds": 0
			},
			{
				"name": "Sodium",
				"amount": 15,
				"unit": "mg",
				"percentOfDailyNeeds": 0.65
			},
			{
				"name": "Vitamin A",
				"amount": 2499,
				"unit": "IU",
				"percentOfDailyNeeds": 49.98
			},
			{
				"name": "Fluoride",
				"amount": 6.9,
				"unit": "mg",
				"percentOfDailyNeeds": 0
			},
			{
				"name": "Iron",
				"amount": 0.81,
				"unit": "mg",
				"percentOfDailyNeeds": 4.5
			},
			{
				"name": "Caffeine",
				"amount": 0,
				"unit": "mg",
				"percentOfDailyNeeds": 0
			},
			{
				"name": "Vitamin B2",
				"amount": 0.06,
				"unit": "mg",
				"percentOfDailyNeeds": 3.35
			},
			{
				"name": "Phosphorus",
				"amount": 72,
				"unit": "mg",
				"percentOfDailyNeeds": 7.2
			},
			{
				"name": "Vitamin C",
				"amount": 41.1,
				"unit": "mg",
				"percentOfDailyNeeds": 49.82
			},
			{
				"name": "Manganese",
				"amount": 0.34,
				"unit": "mg",
				"percentOfDailyNeeds": 17.1
			},
			{
				"name": "Vitamin K",
				"amount": 23.7,
				"unit": "µg",
				"percentOfDailyNeeds": 22.57
			},
			{
				"name": "Zinc",
				"amount": 0.51,
				"unit": "mg",
				"percentOfDailyNeeds": 3.4
			},
			{
				"name": "Vitamin B6",
				"amount": 0.24,
				"unit": "mg",
				"percentOfDailyNeeds": 12
			},
			{
				"name": "Vitamin E",
				"amount": 1.62,
				"unit": "mg",
				"percentOfDailyNeeds": 10.8
			},
			{
				"name": "Lycopene",
				"amount": 7710,
				"unit": "µg",
				"percentOfDailyNeeds": 0
			},
			{
				"name": "Potassium",
				"amount": 711,
				"unit": "mg",
				"percentOfDailyNeeds": 20.31
			},
			{
				"name": "Fiber",
				"amount": 3.6,
				"unit": "g",
				"percentOfDailyNeeds": 14.4
			},
			{
				"name": "Calories",
				"amount": 54,
				"unit": "kcal",
				"percentOfDailyNeeds": 2.7
			},
			{
				"name": "Sugar",
				"amount": 7.89,
				"unit": "g",
				"percentOfDailyNeeds": 8.77
			},
			{
				"name": "Mono Unsaturated Fat",
				"amount": 0.09,
				"unit": "g",
				"percentOfDailyNeeds": 0
			},
			{
				"name": "Choline",
				"amount": 20.1,
				"unit": "mg",
				"percentOfDailyNeeds": 0
			},
			{
				"name": "Folate",
				"amount": 45,
				"unit": "µg",
				"percentOfDailyNeeds": 11.25
			},
			{
				"name": "Vitamin D",
				"amount": 0,
				"unit": "µg",
				"percentOfDailyNeeds": 0
			},
			{
				"name": "Net Carbohydrates",
				"amount": 8.07,
				"unit": "g",
				"percentOfDailyNeeds": 2.93
			},
			{
				"name": "Magnesium",
				"amount": 33,
				"unit": "mg",
				"percentOfDailyNeeds": 8.25
			},
			{
				"name": "Fat",
				"amount": 0.6,
				"unit": "g",
				"percentOfDailyNeeds": 0.92
			},
			{
				"name": "Carbohydrates",
				"amount": 11.67,
				"unit": "g",
				"percentOfDailyNeeds": 3.89
			},
			{
				"name": "Protein",
				"amount": 2.64,
				"unit": "g",
				"percentOfDailyNeeds": 5.28
			},
			{
				"name": "Poly Unsaturated Fat",
				"amount": 0.25,
				"unit": "g",
				"percentOfDailyNeeds": 0
			},
			{
				"name": "Cholesterol",
				"amount": 0,
				"unit": "mg",
				"percentOfDailyNeeds": 0
			},
			{
				"name": "Copper",
				"amount": 0.18,
				"unit": "mg",
				"percentOfDailyNeeds": 8.85
			},
			{
				"name": "Alcohol",
				"amount": 0,
				"unit": "g",
				"percentOfDailyNeeds": 0
			},
			{
				"name": "Vitamin B12",
				"amount": 0,
				"unit": "µg",
				"percentOfDailyNeeds": 0
			},
			{
				"name": "Calcium",
				"amount": 30,
				"unit": "mg",
				"percentOfDailyNeeds": 3
			},
			{
				"name": "Selenium",
				"amount": 0,
				"unit": "µg",
				"percentOfDailyNeeds": 0
			},
			{
				"name": "Vitamin B1",
				"amount": 0.11,
				"unit": "mg",
				"percentOfDailyNeeds": 7.4
			},
			{
				"name": "Vitamin B3",
				"amount": 1.78,
				"unit": "mg",
				"percentOfDailyNeeds": 8.91
			},
			{
				"name": "Saturated Fat",
				"amount": 0.08,
				"unit": "g",
				"percentOfDailyNeeds": 0.52
			},
			{
				"name": "Vitamin B5",
				"amount": 0.27,
				"unit": "mg",
				"percentOfDailyNeeds": 2.67
			}
		],
		"properties": [
			{
				"name": "Glycemic Index",
				"amount": 38,
				"unit": ""
			},
			{
				"name": "Glycemic Load",
				"amount": 3.07,
				"unit": ""
			},
			{
				"name": "Nutrition Score",
				"amount": 11.554782608695652,
				"unit": "%"
			}
		],
		"flavonoids": [
			{
				"name": "Cyanidin",
				"amount": 0,
				"unit": "mg"
			},
			{
				"name": "Petunidin",
				"amount": 0,
				"unit": "mg"
			},
			{
				"name": "Delphinidin",
				"amount": 0,
				"unit": "mg"
			},
			{
				"name": "Malvidin",
				"amount": 0,
				"unit": "mg"
			},
			{
				"name": "Pelargonidin",
				"amount": 0,
				"unit": "mg"
			},
			{
				"name": "Peonidin",
				"amount": 0,
				"unit": "mg"
			},
			{
				"name": "Catechin",
				"amount": 0,
				"unit": "mg"
			},
			{
				"name": "Epigallocatechin",
				"amount": 0,
				"unit": "mg"
			},
			{
				"name": "Epicatechin",
				"amount": 0,
				"unit": "mg"
			},
			{
				"name": "Epicatechin 3-gallate",
				"amount": 0,
				"unit": "mg"
			},
			{
				"name": "Epigallocatechin 3-gallate",
				"amount": 0,
				"unit": "mg"
			},
			{
				"name": "Theaflavin",
				"amount": 0,
				"unit": ""
			},
			{
				"name": "Thearubigins",
				"amount": 0,
				"unit": ""
			},
			{
				"name": "Eriodictyol",
				"amount": 0,
				"unit": ""
			},
			{
				"name": "Hesperetin",
				"amount": 0,
				"unit": "mg"
			},
			{
				"name": "Naringenin",
				"amount": 2.04,
				"unit": "mg"
			},
			{
				"name": "Apigenin",
				"amount": 0,
				"unit": "mg"
			},
			{
				"name": "Luteolin",
				"amount": 0,
				"unit": "mg"
			},
			{
				"name": "Isorhamnetin",
				"amount": 0,
				"unit": "mg"
			},
			{
				"name": "Kaempferol",
				"amount": 0.27,
				"unit": "mg"
			},
			{
				"name": "Myricetin",
				"amount": 0.39,
				"unit": "mg"
			},
			{
				"name": "Quercetin",
				"amount": 1.74,
				"unit": "mg"
			},
			{
				"name": "Theaflavin-3,3'-digallate",
				"amount": 0,
				"unit": ""
			},
			{
				"name": "Theaflavin-3'-gallate",
				"amount": 0,
				"unit": ""
			},
			{
				"name": "Theaflavin-3-gallate",
				"amount": 0,
				"unit": ""
			},
			{
				"name": "Gallocatechin",
				"amount": 0,
				"unit": "mg"
			}
		],
		"caloricBreakdown": {
			"percentProtein": 16.86,
			"percentFat": 8.62,
			"percentCarbs": 74.52
		},
		"weightPerServing": {
			"amount": 300,
			"unit": "g"
		}
	},
	"categoryPath": [
		"vegetable"
	]
}
```