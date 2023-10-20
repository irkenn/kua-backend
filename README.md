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

### Instructions

### 1.Authentication

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

The [response](#API_response) should look like this:  
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
The response will look the same way as with the auth process: [response](#API_response)

lkm












