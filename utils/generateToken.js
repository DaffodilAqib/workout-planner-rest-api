const jwt = require("jsonwebtoken")

const generateToken = (user) => {
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m'
    });

    return token;

}


const generateRefreshToken = (user) => {
    const token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d'
    });

    return token;
}

module.exports = {
    generateToken,
    generateRefreshToken
}