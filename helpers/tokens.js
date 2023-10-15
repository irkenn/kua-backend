const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

async function createToken(user) {
    console.log('createToken -> user', user);
    let payload = {
      username: user.username,
      userId : user.id
    };

    return await jwt.sign(payload, SECRET_KEY);
}


module.exports = { createToken };