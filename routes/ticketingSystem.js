const express = require("express")
const router = express.Router()



const {launchComplaint, getComplaintsOnMyProduct, getMyComplaints,deleteComplaint, updateComplaintResolveStatus, adminGetAllComplaints, customersComplaintTheMost, ownerComplaintTheMost, softdelete} = require("../controllers/ticketingSystem")

router.post("/launchComplaint", launchComplaint)
router.get("/getComplaintsOnMyProduct",getComplaintsOnMyProduct)
router.get("/getMyComplaints", getMyComplaints)
router.get("/adminGetAllComplaints",adminGetAllComplaints)
router.patch("/updateComplaintResolveStatus/:id",updateComplaintResolveStatus)
router.get("/adminCustomerWithMostComplaints/", customersComplaintTheMost)
router.get("/adminOwnerWithMostComplaints", ownerComplaintTheMost)
router.delete("/deleteComplaint/:id", softdelete);


module.exports = router