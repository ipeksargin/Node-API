const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const {registerValidation, loginValidation} = require('../validation');

//register baslangic
router.post('/register', async (req, res) => {
    const {error} = registerValidation(req.body);

    if(error) return res.status(400).send(error.details[0].message);
     //res.send(validation);
    //if(!req.body.name || !req.body.email || !req.body.password )
       //return res.status(400).json({message : "Error"});

    // email 
    // database check 
    // if exist return 400 with error message. 

    const isUserExist = await User.findOne({email:req.body.email});
    if(isUserExist)
    {
       return res.status(400).json({error:"This user is already exist."});
    }
// hash the password

const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
  //create a new user
    const user = new User({
       name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try{
       
       const savedUser = await user.save();
       console.log("Success");
        return res.send(savedUser);
    }catch(err){
      console.log(err);
      return res.send(err);
    }
});
//register bitti

//login
router.post('/login', async (req,res) => {
  const {error} = loginValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);


  //checking if the user exists
  const isUserExist = await User.findOne({email:req.body.email}); 
  if(!isUserExist)
  {
     return res.status(400).json({error:"This user hasn't been found.Email is not found."});
  }

  //if password is ok
  const validPassword = await bcrypt.compare(req.body.password, isUserExist.password);
  if(!validPassword)
  {
     return res.status(400).json({error:"Wrong password!"});
  }


  //create token


  const token = jwt.sign({_id: isUserExist._id}, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);
  res.send('Success'); 


});


module.exports = router;