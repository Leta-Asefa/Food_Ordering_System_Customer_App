import React, { createContext, useState } from 'react';


const CartContext = createContext();


const CartProvider = ({ children }) => {

  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    
    let status=null
    setCart((prevCart) => {
        if (prevCart.some(cartItem => cartItem.name === item.name)) {
            status=false
            return prevCart.filter(cartItem => cartItem.name !== item.name);
        } else {
            status=true
            return [...prevCart, item];
        }
    });

    return status

  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };


  return (
    <CartContext.Provider value={{ cart, setCart,addToCart,removeFromCart,clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };
