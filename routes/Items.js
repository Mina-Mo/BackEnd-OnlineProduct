const express = require("express")
const _ = require("lodash")
const {Users} = require("../Models/User")
const auth = require("../middleWare/auth")
const preAccess = require("../middleWare/preAccess")
const ascyncMiddleWare = require("../middleWare/AsyncMiddleWare")
const {Items, inputValidation, modifyItemValidation} = require("../Models/Item.js")

// create router
const router = express.Router();

// route for getting all items
router.get("/", ascyncMiddleWare(async(req, res)=>{
    const result = await Items.find().populate("SellingBy", "Name Email ").select("Name Description Price SellingBy Categery")
     res.send(result)
}))

// route for creating new item passing the auth middleware
router.post("/", auth, ascyncMiddleWare(
    async(req, res)=>{
        const item = new Items({
            Name: req.body.Name,
            Description: req.body.Description,
            Price: req.body.Price,
            Categery: req.body.Categery,
            SellingBy: req.body.SellingBy
        })
        // validate input
        const validation = inputValidation(req.body)
        if(validation.error) return res.status(400).send(validation.error.details[0].message);
       
        // save item in Mongo DB
            await item.save()
        
        // add the item to the user created items list
            const createduser = await Users.findOne({_id: item.SellingBy._id})
            createduser.CreatedItems.push(item)
            await createduser.save()
            res.send(item)
}))

// route for modifing item passing the auth and preauthization middlewares
router.put("/:id", [auth, preAccess],ascyncMiddleWare(
    async(req, res)=>{

        // validate input
        const validation = modifyItemValidation(req.body);
        if(validation.error) return res.status(400).send(validation.error.details[0].message);

        //find and update the item
        const item = await Items.findOneAndUpdate({_id: req.params.id}, req.body, {new: true})

        // if there is no item by the required id return error
        if(!item || null )return res.status(404).send("Id is not Found!")
        res.send(item)
    }
))

// route for removing item passing the auth and preauthization middlewares
router.delete("/:id",[auth, preAccess],ascyncMiddleWare(
    async(req, res)=>{

        // find and delete the item
        const item = await Items.findByIdAndDelete({_id: req.params.id})

        // if there is no item by the required id return error
        if(!item|| null) return res.status(404).send("Id is not Found!!!")
       res.send(item.SellingBy._id)
}
))


module.exports = router;