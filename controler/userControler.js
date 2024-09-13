const { createUser } = require("../helper/userHelper");
const { encrypted } = require("../utils/encryption");
const { generateToken } = require("../utils/generateToken");

const controllers = {

}
controllers.createUser = (req, res, next) => {
    const { firstName, lastName, email, password, userTypeId, levelId, address, city, state } = req.body;
    const encPassword = encrypted(password);
    createUser(firstName, lastName, email, encPassword, userTypeId, levelId, address, city, state).then((result) => {
        res.send(result);
    }).catch((err) => {
        console.log("ddfdferr", err);
    })
}

const checkUser = async (req, res, next) => {
    const { email, password } = req.body;

    const userDetail = await checkUser(email);

    if (!userDetail) {
        res.status(404).send("Email not found");
    }

    const encPassword = encrypted(password);

    if (userDetail.password === encPassword) {
        const accessToken = generateToken(userDetail);
        const refreshToken = generateRefreshToken(userDetail);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,  // Can't be accessed via JavaScript
            secure: true,    // Only sent over HTTPS (enable in production)
            sameSite: 'Strict',  // Prevent CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Send access token as JSON response
        res.json({ accessToken });
        
    } else {
        res.status(403).send("Incorrect Password");
    }

    
}

module.exports = controllers;