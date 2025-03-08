import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Loader from "../../components/loader/Loader";
import FoodCard from "../../components/food-card/FoodCard";
import {
  getAllFoodsList,
  getAllRecommendFoodsList,
} from "../../redux/food/food.actions";
import "./Product.css";
import axios from "axios";

const Product = ({}) => {
  const [latestProductId, setLatestProductId] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  console.log({ latestProductId });

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/product/list");
        setProducts(res?.data?.productList);
        console.log(res);
      } catch (error) {
        console.log("Get products api hit failed...");
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        setLoading2(true);
        const res = await axios.post("http://127.0.0.1:5000/recommend", {
          product_id: latestProductId,
        });
        setRecommendedProducts(res?.data?.recommendations);
        return res?.data?.recommendations;
      } catch (error) {
        console.log("Get products api hit failed...");
      } finally {
        setLoading2(false);
      }
    };

    if (latestProductId) {
      fetchRecommendedProducts();
    }
  }, [latestProductId]);
  if (loading || loading2) {
    return <Loader />;
  }

  return (
    <div className="product-root">
      <h1>All Products</h1>
      {/* Recommended Products */}
      <div className="recommended-products">
        <h2>All Products</h2>
        <div className="food-page">
          {products?.length > 0 ? (
            products.map((food) => (
              <FoodCard
                key={food._id}
                food={food}
                setProductId={setLatestProductId}
              />
            ))
          ) : (
            <p>No products available.</p>
          )}
        </div>
      </div>

      <div className="all-products">
        <h2>Recommend Products</h2>
        <div className="food-page">
          {recommendedProducts?.length > 0 ? (
            recommendedProducts.map((food) => (
              <FoodCard key={food._id} food={food} />
            ))
          ) : (
            <p>No products available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Map state to props for both all products and recommended products
const mapStateToProps = (state) => ({
  recommendedFoods: state.food.recommendedFoods,
  foods: state.food.foods,
  // Ensure this exists in your Redux state
  loading: state.food.loading,
});

// Connect both action creators
export default connect(mapStateToProps, {
  getAllRecommendFoodsList,
  getAllFoodsList,
})(Product);
