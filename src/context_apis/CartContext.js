import React, { createContext, useContext, useState } from 'react';


const CartContext = createContext();

// Custom hook to use the cartContext
export const useCartContext = () => {
  return useContext(CartContext);
};


const CartProvider = ({ children }) => {

  const [cart, setCart] = useState([]);
  const [selectedRestaurant,setSelectedRestaurant]=useState({})

  const addToCart = (item) => {
    console.log("add to cart is called ! ", item)

    let status = null
    setCart((prevCart) => {
      if (prevCart.some(cartItem => cartItem.item._id === item.item._id)) {
        status = false
        return prevCart.filter(cartItem => cartItem.item._id !== item.item._id);
      } else {
        status = true
        return [...prevCart, item];
      }
    });
    return status

  };

  const updateCartItem = (itemId, newQuantity) => {
  
    setCart((prevCart) => {
      const updatedCart = prevCart.map((cartItem) => {
        if (cartItem.item._id === itemId) {
          return { ...cartItem, quantity: newQuantity };
        }
        return cartItem;
      });
  
      // Remove the item if the quantity is 0
      return updatedCart.filter((cartItem) => cartItem.quantity > 0);
    });
  };

  
  const isOnCart = (itemId) => {
    return cart.some(cartItem => cartItem.item._id === itemId);
  };
  

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.item._id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };


  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, clearCart,updateCartItem,isOnCart,selectedRestaurant,setSelectedRestaurant }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };
