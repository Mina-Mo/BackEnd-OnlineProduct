
// middleware to check the user preauthrization for updatiing or deleting item

const {Items} = require("../Models/Item")
const mongoose =require("mongoose")

module.exports = async function preAccess (req, res, next){
   if(!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).send("Id is not Found!!")
   try{
      const item = await Items.findOne({_id: req.params.id})
      if(!item) return res.status(404).send("Id is not Found!!!")
      if(JSON.stringify(req.user._id)!== JSON.stringify(item.SellingBy._id)) return res.status(401).send("Access denied")
      next()
   }catch(ex){
      res.status(500).send("something failed")
   }
   
}

