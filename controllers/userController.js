
const User = require("../models/User")
const bcryptjs = require('bcryptjs')
const { validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")

exports.createNewUser = async(req, res) => {
  //Validation 
  const Errors = validationResult(req)
  if(!Errors.isEmpty()){
    return res.status(400).json({Errors: Errors.array()})
  }



  const {email, password} = req.body
  try{
    let userContainer = await User.findOne({email})
    if(userContainer){
      return res.status(400).json({msg: "User already exists"})
    }
    userContainer = new User(req.body)
    //Hashear Password
    const salt = await bcryptjs.genSalt(10);
    userContainer.password = await bcryptjs.hash(password, salt)
    await userContainer.save()

    const payload = {
      userContainer: {
        id: userContainer.id
      }

    }
    jwt.sign(payload, process.env.Secret, {
      expiresIn:3600
    }, (error, token)=>{
      if(error) throw error;

      res.json({token: token})
    })

  } catch(error){
    console.log(error)
    res.status(400).send("There are a Error")
  }
}