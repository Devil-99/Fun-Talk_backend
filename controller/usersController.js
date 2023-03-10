const User = require("../model/userModel");

module.exports.registerMiddleware = async (req,res,next)=>{
    try{
        const {username, email, password} = req.body;
        const usernameCheck = await User.findOne({username});
        if(usernameCheck)
            return res.json({msg:"Username is already used", status: false});
        const emailCheck = await User.findOne({email});
        if(emailCheck)
            return res.json({msg:"Email is already used", status: false});

        const user = await User.create({username,email,password});
        return res.json({status:true , user});
    }
    catch(exception){
        next(exception);
    }
};


module.exports.loginMiddleware = async (req,res,next)=>{
    try{
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if(!user)
            return res.json({msg:"Incorrect Username", status: false});

        const isPasswordValid = (password === user.password);
        if(!isPasswordValid)
            return res.json({msg:"Incorrect Password", status: false});

        return res.json({status:true , user});
    }
    catch(exception){
        next(exception);
    }
};


module.exports.getAllUsers = async (req,res,next)=>{
    try{
        const allusers = await User.find({ _id: {$ne: req.params.id} }).select([
            "email",
            "username",
            "_id"
        ]);
        return res.json(allusers);
    }catch(exception){
        next(exception);
    }
};