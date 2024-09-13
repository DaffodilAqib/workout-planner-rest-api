const express = require("express");
const { createUser } = require("../controler/userControler");
const router = express.Router();

router.get('/list', (req, res, next) => {
    console.log("working fine");
    res.send("List of users");
})


router.post('/add', createUser);



module.exports = {
    path: '/users',
    router,
    requiresAuth: true
}