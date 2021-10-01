
const User = require("../models/User")
const bcryptjs = require('bcryptjs')
const { validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")

exports.authenticateUser = async(req, res)=>{
  //Validation 
  const Errors = validationResult(req)
  if(!Errors.isEmpty()){
    return res.status(400).json({Errors: Errors.array()})
  }

  const {email, password} = req.body;


  try{
    let UserAuthenticate = await User.findOne({email})
    if(!UserAuthenticate) {
      return res.status(400).json({msg: "The email is wrong"})
    }

    let passCorrect = await bcryptjs.compare(password, UserAuthenticate.password)
    if(!passCorrect){
      return res.status(400).json({ msg: "The password is wrong" })
    }

    //Token
    const payload = {
      userContainer: {
        id: UserAuthenticate.id
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
  }
}
exports.authorizedUser= async(req, res)=>{
  try {
    const user = await User.findById(req.userContainer.id).select("-password")
    res.json({user})
  } catch (error) {
    res.status(500).json({msg: "There was a Error"})
  }
}