const {StatusCodes} = require("http-status-codes")
const shoppingCart = require("../models/shoppingCart")
const jwt = require('jsonwebtoken');


const isShoppingCartPresent = async (req, res) => {
    const user = req.params.userId;
    const shoppingCartUser = await shoppingCart.find({ user_id: user, isDeleted: true });
    if (shoppingCartUser.length === 0) {
        console.log('no cart')
        res.status(StatusCodes.OK).json({ message: "No shopping cart", data: { shoppingCart: false }, status_code: StatusCodes.OK });
    } else {
        console.log('present')
        res.status(StatusCodes.OK).json({ message: "Shopping cart present", data: { shoppingCart: true, id: shoppingCartUser._id }, status_code: StatusCodes.OK });
    }
}



const createShoppingcart = async(req, res)=>{
    const user = req.body.user_id
    req.body.user_id = user
    const shoppingCart_doc = await shoppingCart.create(req.body)
    res.status(StatusCodes.CREATED).json({message:"success", data: shoppingCart_doc, status_code:StatusCodes.CREATED})
}

const get_Shoppingcart = async(req, res)=>{
    const shoppingcartUser = await shoppingCart.find({ user_id: req.params.userId, isDeleted: true })
    if (! shoppingcartUser){
        res.status(StatusCodes.OK).json({message:"no shopping cart", data:{}, status_code:StatusCodes.OK})
    }
    res.status(StatusCodes.OK).json({message:"success", data:shoppingcartUser, status_code:StatusCodes.OK})
}

const cartItems = async(req, res)=>{

}

const updateShoppingcart = async (req, res) => {
    try {
        const userId = req.params.userId;
        const shoppingCartUpdate = req.body;
        
        if (!shoppingCartUpdate.items || shoppingCartUpdate.items.length === 0) {
            throw new Error('No items provided for update');
        }

        // Find the shopping cart document by user ID
        const shoppingCartDoc = await shoppingCart.findOne({ user_id: userId });
        
        // Check if shopping cart document exists
        if (!shoppingCartDoc) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Shopping cart not found for user", data: {}, status_code: StatusCodes.NOT_FOUND });
        }

        // Create a set of existing item IDs to avoid duplicates
        const existingItemIds = new Set(shoppingCartDoc.items.map(item => item._id.toString()));

        // Filter the incoming items to exclude any that already exist in the cart
        const uniqueNewItems = shoppingCartUpdate.items.filter(item => !existingItemIds.has(item._id));

        if (uniqueNewItems.length === 0) {
            return res.status(StatusCodes.OK).json({ message: "No new unique items to add", data: shoppingCartDoc, status_code: StatusCodes.OK });
        }

        const updatedShoppingCart = await shoppingCart.findOneAndUpdate(
            { user_id: userId },
            { $push: { items: { $each: uniqueNewItems } } },
            { new: true, runValidators: true }
        );

        res.status(StatusCodes.OK).json({ message: "Update successful", data: updatedShoppingCart, status_code: StatusCodes.OK });
    } catch (error) {
        console.error('Error updating shopping cart:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error updating shopping cart", data: {}, status_code: StatusCodes.INTERNAL_SERVER_ERROR });
    }
};


const deleteItemShoppingcart = async (req, res) => {
    try {
        // Extract itemId from the request parameters
        const itemId = req.params.itemId;
        const userId = req.headers.user_id; // Assuming you have user info in req.user

        // Find the cart by userId
        // console.log(userId)
        const cart = await shoppingCart.findOne({ user_id: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Filter out the item with the specified ID from the cart items
        const updatedItems = cart.items.filter((item) => item._id.toString() !== itemId);

        // Update the cart's items array
        cart.items = updatedItems;

        // Save the updated cart
        await cart.save();

        // Return the updated cart
        res.status(200).json({ message: 'Cart item deleted successfully', cart });
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};



const recommendations = async(req, res)=>{
    const user_id = req.user.userId
    const shopping_cart = await shoppingCart.findOne({})
}

const deleteUserShoppingCart = async(req, res)=>{
    
}

module.exports = {isShoppingCartPresent , createShoppingcart, get_Shoppingcart, updateShoppingcart, deleteItemShoppingcart, recommendations}