const Joi = require("joi")
const mongoose = require("mongoose")

// create item model 
const Items = mongoose.model("Item", new mongoose.Schema({
    Name: {
        type: String,
        minlength: 4,
        maxlength: 125,
        required: true
    },
    Description: {
        type: String,
        minlength: 4,
        maxlength: 1024,
        required: true
    },
    Price: {
        type: Number,
        min: 5,
        required: true
    },
    Categery:{
        type: String,
        enum:  ["Smart Phones","Accessories", "Laptop"],
        required: true
    },
    SellingBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required:true
    }
})
)

// validate input using joi for creating new item
function inputValidation(item){
    const inputSchema = {
        Name: Joi.string().min(4).max(125).required(),
        Description:Joi.string().min(4).max(1024).required(),
        Price: Joi.number().min(5).required(),
        Categery: Joi.string().max(20).required().required(),
        SellingBy: Joi.string(),
    }
    
    return Joi.validate(item, inputSchema)
}

// validate input using joi for updating item
function modifyItemValidation(item){
    const inputSchema = {
        Name: Joi.string().min(4).max(125),
        Description:Joi.string().min(4).max(1024),
        Price: Joi.number().min(5),
        Categery: Joi.string().max(20),
        SellingBy: Joi.string(),
    }
    
    return Joi.validate(item, inputSchema)
}

exports.Items = Items;
exports.inputValidation = inputValidation;
exports.modifyItemValidation = modifyItemValidation;

