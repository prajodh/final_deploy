const carListings = require("../models/carListings")
const rentItems = require("../models/renting")
const shoppingCart = require("../models/shoppingCart")
const login = require("../models/login")
const {StatusCodes} = require("http-status-codes")
const stripe = require('stripe')(process.env.STRIPE_BE_KEY)

const rentItem = async(req,res)=>{
    const owner_id = await carListings.findOne({_id:req.body.item_id})
    req.body.owner_id = owner_id.ownerId.toString()
    const user_id = req.user.userID
    req.body.user_id = user_id
    const rentItem = await rentItems.create(req.body)
    const update = await carListings.findOneAndUpdate({_id:req.body.item_id},{rentStatus:true},{new:true, runValidators:true})
    res.status(StatusCodes.OK).json({message:"item rented", data:{rentItem}, status_code:StatusCodes.OK})
}

const stripePayment = async(req, res) => {
    const request = req.body;
    console.log(request);

    // Validate request body
    if (!Array.isArray(request.durations) || !Array.isArray(request.costs) || !Array.isArray(request.item_ids)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid request body" });
    }

    try {
        // Calculate total cost and construct line items array
        let total = 0;
        const lineItems = await Promise.all(request.item_ids.map(async (itemId, index) => {
            const cost = Number(request.costs[index]);
            total += cost * Number(request.durations[index]);

            const item = await carListings.findOne({ _id: itemId });
            if (!item) {
                throw new Error(`Item with ID ${itemId} not found`);
            }

            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: `${item.carMake} ${item.carModel}`
                    },
                    unit_amount: Math.round(cost * 100), // amount in cents
                },
                quantity: 1, // assuming one unit for now
            };
        }));

        // Create session with Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: "http://localhost:5173/paymentSuccess",
            cancel_url: "http://localhost:5173/paymentCancel"
        });

        res.status(StatusCodes.OK).json({ message: "success", data: { id: session.id }, status_code: StatusCodes.OK });
    } catch (error) {
        console.error("Error processing payment:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to process payment", error: error.message });
    }
};



const sendPaymentEmail = async(req,res)=>{ 
    const user = await login.findOne({_id:req.user.userID})   
    const text = "your payment for the item for the cost of "+req.body.total+" is done"
    console.log(user.email)
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
          to: user.email, 
          from: 'hpass609@gmail.com', 
          subject: 'Payment Done',
          text: text,
    }
    const info = sgMail.send(msg)          
    res.status(StatusCodes.OK).json({message:"success", data:"email has been sent", status_code:StatusCodes.OK})


}




const mostRentedItems = async(req,res)=>{
    const items = await rentItems.find({})
    let freq = {}
    for (let i = 0; i < items.length; i++){
        if (!freq[items[i].item_id]){
            freq[items[i].item_id] = 1
        }
        else{
        freq[items[i].item_id]+=1
        }
    }
    const largestValue = Math.max(...Object.values(freq));
    const largestObject = Object.entries(freq).find(([key, value]) => value === largestValue);
    const itemDetails = await carListings.findOne({_id:largestObject[0]})
    const responseObject = {itemdetails:itemDetails, item_frequency: largestObject[1]}
    console.log(responseObject)
    res.status(StatusCodes.OK).json({message:"success", data:responseObject , status_code:StatusCodes.OK})
}


const mostRentedItemsForUser = async(req,res)=>{
    console.log(req.user.userID)
    const items = await rentItems.find({owner_id:req.user.userID})
    let freq = {}
    for (let i = 0; i < items.length; i++){
        if (!freq[items[i].item_id]){
            freq[items[i].item_id] = 1
        }
        else{
        freq[items[i].item_id]+=1
        }
    }
    const largestValue = Math.max(...Object.values(freq));
    const largestObject = Object.entries(freq).find(([key, value]) => value === largestValue);
    const itemDetails = await carListings.findOne({_id:largestObject[0]})
    const responseObject = {itemdetails:itemDetails, item_frequency: largestObject[1]}
    res.status(StatusCodes.OK).json({message:"success", data:responseObject , status_code:StatusCodes.OK})
}



const itemRentedByUser = async(req, res)=>{
    const user = req.user.userID
    console.log(user)
    const rentItem = await rentItems.find({user_id:user})
    console.log(rentItem)
    const array = []
    for(let i =0; i<rentItem.length;i++){
        const item  = await carListings.findOne({_id:rentItem[i].item_id})
        array.push(item)
    }
    return res.status(StatusCodes.OK).json({message:"success", data:array , status_code:StatusCodes.OK})

}

module.exports = {rentItem, stripePayment,sendPaymentEmail, mostRentedItems, mostRentedItemsForUser, itemRentedByUser}