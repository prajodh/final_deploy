import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";

const Cart = ({ cartItems, setCartItems }) => {
  const { currUser } = useSelector((state) => state.user_mod);
  const userId = currUser ? currUser.data.username : null;

  const [totalPrice, setTotalPrice] = useState(0);
  const [rentalDays, setRentalDays] = useState({}); // Object to store rental days for each item

  const fetchCartItems = async () => {
    try {
      const response = await fetch(
        `/api/v1/shoppingCart/get_Shoppingcart/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currUser?.data?.token}`,
          },
        }
      );
      const data = await response.json();
      setCartItems(data.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handlePayment = async () => {
    console.log("asdhawdbhabsd", cartItems);
    if (currUser && currUser.data && currUser.data.token) {
      try {
        const stripe = await loadStripe(
          "pk_test_51Oy4XrKDZmp8eDSbYQN6Fam0JxugYee73NJNswgl4U5QrS20yiYAYDseStP3Orj0YnIMFjWWMwWX3r5i0qBE1wVX00FJbX1o30"
        );
  
        // Construct arrays to store durations and costs for each item
        const durations = [];
        const costs = [];
  
        cartItems[0].items.forEach((item) => {
          const itemRentalDays = rentalDays[item._id] || 1; // Default to 1 day if not set
          const itemCost = item.pricePerDay * itemRentalDays;
          durations.push(itemRentalDays);
          costs.push(itemCost);
        });
  
        const stripeRes = await fetch(
          "http://localhost:5173/api/v1/rent/stripePayment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${currUser.data.token}`,
            },
            body: JSON.stringify({
              durations: durations,
              costs: costs,
              item_ids: cartItems[0].items.map((item) => item._id),
            }),
          }
        );
        if (!stripeRes.ok) {
          throw new Error(`Failed to fetch client secret: ${stripeRes.status}`);
        }
  
        const session = await stripeRes.json();
  
        const result = stripe.redirectToCheckout({
          sessionId: session.data.id,
        });
      } catch (error) {
        console.error("Error fetching client secret:", error);
      }
    }
  };
  
  
  

  const calculateTotalPrice = () => {
    let total = 0;
    if (cartItems && cartItems[0] && cartItems[0].items) {
      cartItems[0].items.forEach((item) => {
        const itemRentalDays = rentalDays[item._id] || 1; // Default to 1 day if not set
        total += item.pricePerDay * itemRentalDays;
      });
    }
    setTotalPrice(total);
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [cartItems, rentalDays]); // Update total on cart or rental days change

  const handleRentalDaysChange = (e, itemId) => {
    setRentalDays({ ...rentalDays, [itemId]: parseInt(e.target.value) });
    calculateTotalPrice(); // Call this function to update the total price immediately
  };

  const handleDeleteFromCart = async (itemId) => {
    try {
      // Send DELETE request to the backend to delete the specified cart item
      const response = await fetch(
        `/api/v1/shoppingCart/deleteItemShoppingcart/${itemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currUser?.data?.token}`, // Include authorization header if needed
            user_id: userId,
          },
        }
      );

      // Check if the response is successful
      if (response.ok) {
        setCartItems((prevItems) => {
          // Create a copy of the current cartItems state
          const updatedCart = { ...prevItems[0] };

          // Filter the items array to remove the item with the specified ID
          updatedCart.items = updatedCart.items.filter(
            (item) => item._id !== itemId
          );

          // Return the updated cart as an array with one element (to maintain original structure)
          return [updatedCart];
        });

        // alert('Item deleted successfully!');
      } else {
        // Handle error case
        console.error("Error deleting item:", response.statusText);
        alert("Failed to delete the item. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting item from cart:", error);
      alert("Failed to delete the item. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-8">
        {/* <h1 className="text-3xl font-bold text-center mb-6">SHOPPING CART</h1> */}
        <h1 className="text-white font-bold text-center mb-6" style={{ fontSize: '3.5rem', position: 'relative', bottom: '45px', left: '530px', display: 'inline' }}>
  SHOPPING CART
</h1>

        {cartItems &&
          cartItems[0] &&
          cartItems[0].items.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md mb-4"
            >
              {/* Car details */}
              <div className="flex flex-col">
                <p className="font-bold text-black">{`${item.carMake} ${item.carModel}`}</p>
                <p className="text-black">Price Per Day: ${item.pricePerDay}</p>
                <div className="flex items-center mt-2">
                  <label
                    htmlFor={`rentalDays-${item._id}`}
                    className="mr-2 text-black"
                  >
                    Rental Days:
                  </label>
                  <input
                    type="number"
                    id={`rentalDays-${item._id}`}
                    min={1}
                    value={rentalDays[item._id] || 1} // Default to 1 day if not set
                    onChange={(e) => handleRentalDaysChange(e, item._id)}
                    className="border border-gray-700 rounded px-2 py-1 focus:outline-none focus:ring-blue-500 focus:ring-opacity-50"
                    style={{ color: "black", marginTop: "0.5rem" }} // Add margin-top
                  />
                </div>
              </div>

              {/* Delete button */}
              <button
                onClick={() => handleDeleteFromCart(item._id)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-4 focus:outline-none focus:shadow-outline"
              >
                Delete
              </button>
            </div>
          ))}

        {/* Total price */}
        <div className="font-bold text-right mb-4">
          Total Price: ${totalPrice}
        </div>
        {/* Proceed to payment button */}
        <div className="text-right">
          <button
            onClick={handlePayment}
            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              !Object.values(rentalDays).every(Boolean) ? "disabled" : ""
            }`}
            disabled={!Object.values(rentalDays).every(Boolean)} // Disable button if any rental day is missing
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
