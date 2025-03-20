import React, { createContext, useContext, useState } from 'react';


const RestaurantsList = createContext();

// Custom hook to use the cartContext
export const useRestaurantsListContext = () => {
  return useContext(RestaurantsList);
};


const RestaurantsListProvider = ({ children }) => {

  const [popularRestaurants,setPopularRestaurants]=useState([])
  const [favouriteRestaurants,setFavouriteRestaurants]=useState([])


  return (
    <RestaurantsList.Provider value={{popularRestaurants,setPopularRestaurants,favouriteRestaurants,setFavouriteRestaurants }}>
      {children}
    </RestaurantsList.Provider>
  );
};

export { RestaurantsList, RestaurantsListProvider };
