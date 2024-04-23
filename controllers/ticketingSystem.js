const ticketsSchema = require("../models/ticketingSystem")
const carListings = require("../models/carListings")
const users = require("../models/login")
const {StatusCodes} = require("http-status-codes")



const launchComplaint = async(req,res)=>{
    req.body.user_id = req.user.userID
    const owner = await carListings.findOne({_id:req.body.item})
    req.body.itemOwnerId = owner.ownerId
    req.body.resolveStatus = false
    console.log(req.body)
    const ticket = await ticketsSchema.create(req.body)
    if (!ticket){
        res.status(StatusCodes.OK).json({message:"no items in body",data:{},status_code:StatusCodes.OK})
    }
    res.status(StatusCodes.CREATED).json({message:"created item",data:ticket,status_code:StatusCodes.CREATED})

} 


const getComplaintsOnMyProduct = async(req, res)=>{
    const user = req.user.userID
    const tickets = await ticketsSchema.find({itemOwnerId:user, isDeleted:false}).sort('createdAt')   
    if(!tickets){
        res.status(StatusCodes.OK).json({message:"no complaints",data:{},status_code:StatusCodes.OK})
    }
    res.status(StatusCodes.OK).json({message:"these are the complaints", data:tickets, status_code:StatusCodes.OK}) 
}


const getMyComplaints = async(req, res)=>{
    const user = req.user.userID
    const tickets = await ticketsSchema.find({user_id:user}).sort('createdAt')
    if(!tickets){
        res.status(StatusCodes.OK).json({message:"no complaints",data:{},status_code:StatusCodes.OK})
    }
    res.status(StatusCodes.OK).json({message:"these are your complaints", data: tickets, status_code:StatusCodes.OK}) 
}

const adminGetAllComplaints = async(req,res)=>{
    const tickets = await ticketsSchema.find({resolveStatus:false, isDeleted:false}).sort('createdAt')
    if (!tickets){
        res.status(StatusCodes.OK).json({message:"no complaints",data:{},status_code:StatusCodes.OK})
    }
    res.status(StatusCodes.OK).json({message:"these are the complaints", data: tickets, status_code:StatusCodes.OK}) 
}

const updateComplaintResolveStatus = async(req, res)=>{
    const item_id = req.params.id
    const update_status = {resolveStatus: true}
    const statusUpdate = await ticketsSchema.findOneAndUpdate({_id:item_id}, update_status, {new:true, runValidators:true})
    res.status(StatusCodes.OK).json({message:"update Succesful", data: statusUpdate, status_code:StatusCodes.OK})
}

const deleteComplaint = async (req, res) => {
    const item_id = req.params.id;
    try {
      const deletedComplaint = await ticketsSchema.findByIdAndDelete(item_id);
      if (!deletedComplaint) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "Complaint not found", data: {}, status_code: StatusCodes.NOT_FOUND });
      }
      res.status(StatusCodes.OK).json({ message: "Complaint deleted successfully", data: deletedComplaint, status_code: StatusCodes.OK });
    } catch (error) {
      console.error("Error deleting complaint:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to delete complaint", error: error.message, status_code: StatusCodes.INTERNAL_SERVER_ERROR });
    }
  };

  const softdelete = async(req, res) => {
    const item_id = req.params.id;
    const deletedComplaint = await ticketsSchema.findByIdAndUpdate(item_id, {isDeleted:true})
     if (!deletedComplaint) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "Complaint not found", data: {}, status_code: StatusCodes.NOT_FOUND });
      }
      res.status(StatusCodes.OK).json({ message: "Complaint deleted successfully", data: deletedComplaint, status_code: StatusCodes.OK }); 
  }
  

const customersComplaintTheMost = async(req,res)=>{
    const tickets = await ticketsSchema.find({})
    console.log(tickets)
    let freq = {}
    for (let i = 0; i < tickets.length; i++){
        if (!freq[tickets[i].user_id]){
            freq[tickets[i].user_id] = 1
        }
        else{
        freq[tickets[i].user_id]+=1
        }
    }
    const largestValue = Math.max(...Object.values(freq));
    const largestObject = Object.entries(freq).find(([key, value]) => value === largestValue);
    console.log(largestObject)
     const user_details = await users.findOne({_id:largestObject[0]})
    console.log(user_details)
    const responseObject = {username:user_details.username, email:user_details.email, complaint_frequency: largestObject[1]}
    res.status(StatusCodes.OK).json({message:"success", data:responseObject , status_code:StatusCodes.OK})
}

const ownerComplaintTheMost = async(req,res)=>{
    const tickets = await ticketsSchema.find({})
    console.log(tickets)
    let freq = {}
    for (let i = 0; i < tickets.length; i++){
        if (!freq[tickets[i].itemOwnerId]){
            freq[tickets[i].itemOwnerId] = 1
        }
        else{
        freq[tickets[i].itemOwnerId]+=1
        }
    }
    const largestValue = Math.max(...Object.values(freq));
    const largestObject = Object.entries(freq).find(([key, value]) => value === largestValue);
    const user_details = await users.findOne({_id:largestObject[0]})
    const responseObject = {username:user_details.username, email:user_details.email, complaint_frequency: largestObject[1]}
    res.status(StatusCodes.OK).json({message:"success", data:responseObject , status_code:StatusCodes.OK})
}

module.exports = {launchComplaint, getComplaintsOnMyProduct, getMyComplaints, updateComplaintResolveStatus, deleteComplaint, adminGetAllComplaints, customersComplaintTheMost, ownerComplaintTheMost, softdelete}