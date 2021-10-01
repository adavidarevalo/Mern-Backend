const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController")
const {check} = require("express-validator")


router.post("/", 
     [
       check("name", "The name is required").not().isEmpty(),
       check("email", "The email is required").isEmail(),
       check("password", "The password must have a minimum of 6 characters").isLength({ min: 6 })
     ],
     userController.createNewUser 
);

module.exports = router