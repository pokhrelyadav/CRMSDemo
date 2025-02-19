import React, { useEffect } from "react";
import { connect } from "react-redux";
import Loader from "../../components/loader/Loader";
import FoodCard from "../../components/food-card/FoodCard";
import { getAllFoodsList } from "../../redux/food/food.actions";
import "./Product.css";

const Product = ({ foods, loading, getAllFoodsList }) => {
  useEffect(() => {
    getAllFoodsList(10); // Change the limit as needed
  }, [getAllFoodsList]);

  return (
    <div className="product-root">
      <h1 >All Products</h1>
      {loading && <Loader />}

      <div className="recommended-products">
        <h2>Recommended Products</h2>
        <div className="food-page">
          {/* Recommended products */}
          <p>No recommendations yet.</p>
        </div>
      </div>

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
