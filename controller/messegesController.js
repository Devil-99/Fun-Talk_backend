const messegeModel = require("../model/messegeModel");

module.exports.addMessege = async (req,res,next)=>{
    try{
        const {from , to , messege} = req.body;
        const data = await messegeModel.create({
            messege: {text: messege},
            users : [from,to],
            sender : from
        });
        if(data)
            return res.json({msg: "Messege added successfully"})
        else
            return res.json({msg: "Failed to add messege to the database"})
    }
    catch(exc){
        next(exc);
    }
};

module.exports.getAllMessege = async (req,res,next)=>{
    try{
        const {from,to} = req.body;
        const messeges =await messegeModel.find({
            users:{
                $all: [from, to],
            },
        }).sort({updatedAt:1});
        const projectedMesseges = messeges.map((msg)=>{
            return {
                fromSelf: msg.sender.toString() === from,
                messege: msg.messege.text,
                messegeId: msg._id,
                date: msg.createdAt
            };
        });
        res.json(projectedMesseges);
    }catch(exc){
        next(exc);
    }
};

module.exports.deleteMessege = async (req,res,next)=>{
    try{
        const {msgID} = req.body;
        const deletedMsg= await messegeModel.deleteOne({
            _id:msgID
        });
        if(deletedMsg){
            return res.json({msg: "Messege deleted successfully"})
        }
        else{
            return res.json({msg: "Failed to delete messege to the database"})
        }
    }
    catch(exc){
        next(exc);
    }
};