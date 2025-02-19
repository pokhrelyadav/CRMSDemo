import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Loader from "../../components/loader/Loader";
import FoodCard from "../../components/food-card/FoodCard";
import { getAllFoodsList } from "../../redux/food/food.actions";
import "./Product.css";

const Product = ({ foods, loading, getAllFoodsList }) => {
  const [recommendedFoods, setRecommendedFoods] = useState([]);

  useEffect(() => {
    getAllFoodsList(20); // Fetch all foods
  }, [getAllFoodsList]);

  useEffect(() => {
    if (foods.length > 0) {
      // Pick the first food item as an example (you can modify this logic)
      const orderedFood = foods[0].title; // Or another way to select a food item based on the user's choice

      // Make the request to get recommendations for the selected food
      axios
        .get(`http://localhost:8000/recommend?food=${orderedFood}`)
        .then((response) => {
          // Ensure the backend is sending recommended foods correctly
          setRecommendedFoods(response.data.recommended);
        })
        .catch((error) => {
          console.error("Error fetching recommendations:", error);
        });
    }
  }, [foods]); // Run when foods list is updated

  return (
    <div className="product-root">
      <h1>All Products</h1>
      {loading && <Loader />}

      {/* Recommended Products */}
      <div className="recommended-products">
        <h2>Recommended Products</h2>
        <div className="food-page">
          {recommendedFoods.length > 0 ? (
            recommendedFoods.map((food, index) => (
              // You can modify this to pass more data if needed, for now passing the title
              <FoodCard key={index} food={{ title: food }} />
            ))
          ) : (
            <p>No recommendations available.</p>
          )}
        </div>
      </div>

      {/* All Products */}
      <div className="all-products">
        <h2>All Products</h2>
        <div className="food-page">
          {foods?.map((food) => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  foods: state.food.foods,
  loading: state.food.loading,
});

export default connect(mapStateToProps, { getAllFoodsList })(Product);
