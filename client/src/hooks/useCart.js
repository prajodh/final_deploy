import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const useCart = () => {
  const { currUser, clientSecret } = useSelector((state) => state.user_mod);
  const [cartItems, setCartItems] = useState([]);
  const userId = currUser ? currUser.data.username : null;
  var cartExists = false;

  const checkCartExistence = async () => {
    try {
      console.log(userId);
      const response = await fetch(`/api/v1/shoppingCart/isShoppingCartPresent/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currUser?.data?.token}`,
        },
      });
      const data = await response.json();
      cartExists = data.data.shoppingCart === true;
    } catch (error) {
      console.error('Error checking shopping cart existence:', error);
    }
  };

  const fetchCartItems = async () => {
    try {
      console.log(currUser?.data?.token)
      const response = await fetch(`/api/v1/shoppingCart/get_Shoppingcart/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currUser?.data?.token}`,
        },
      });
      const data = await response.json();
      setCartItems(data.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const handleUpdateCartItem = async (newItem) => {
    try {
      const flattenedItems = cartItems.flatMap(cart => cart.items);
      const updatedItems = [...flattenedItems, newItem];
      const response = await fetch(`/api/v1/shoppingCart/updateShoppingcart/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currUser?.data?.token}`,
        },
        body: JSON.stringify({ items: updatedItems }), // Send the updated array of items
      });
      if (response.ok) {
        const data = await response.json();
        setCartItems([data.data]); // Set the updated cartItems
        // console.log([data.data]);
        // alert('Item added to cart');
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error updating item in cart:', error);
    }
  };

  const handleAddToCart = async (item) => {
    try {
      await checkCartExistence(); // Wait for the result of checkCartExistence()
      // console.log(cartExists);
      if (!cartExists) {
        const response = await fetch(`/api/v1/shoppingCart/createShoppingcart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currUser?.data?.token}`,
          },
          body: JSON.stringify({
            user_id: userId,
            items: [item],
            isDeleted: true,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setCartItems([data.data]);
          // alert('Item added to cart');
        } else {
          throw new Error('Network response was not ok');
        }
      } else {
        await fetchCartItems();
        await handleUpdateCartItem(item);
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  // return true;
  };

  return {
    cartItems,
    setCartItems,
    handleAddToCart,
    clientSecret,
    userId,
  };
};

export default useCart;
