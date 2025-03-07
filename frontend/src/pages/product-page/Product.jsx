// import React, { useEffect, useState } from "react";
// import { connect } from "react-redux";
// import Loader from "../../components/loader/Loader";
// import FoodCard from "../../components/food-card/FoodCard";
// import { getAllFoodsList } from "../../redux/food/food.actions";
// import axios from "axios";
// import "./Product.css";

// const Product = ({ foods, loading, getAllFoodsList }) => {
//   const [recommendations, setRecommendations] = useState([]);

//   useEffect(() => {
//     getAllFoodsList(10); // Change the limit as needed
//   }, [getAllFoodsList]);

//   const handleAddToCart = async (productId) => {
//     // Add product to cart logic here...

//     // Fetch recommendations from Flask backend
//     try {
//       const response = await axios.post("http://localhost:5000/recommend", {
//         product_id: productId,
//       });
//       setRecommendations(response.data.recommendations);
//     } catch (error) {
//       console.error("Error fetching recommendations:", error);
//     }
//   };

//   return (
//     <div className="product-root">
//       <h1>All Products</h1>
//       {loading && <Loader />}

//       <div className="recommended-products">
//         <h2>Recommended Products</h2>
//         <div className="food-page">
//           {recommendations.length > 0 ? (
//             recommendations.map((recommendedProduct) => (
//               <FoodCard
//                 key={recommendedProduct._id}
//                 food={recommendedProduct}
//               />
//             ))
//           ) : (
//             <p>No recommendations yet.</p>
//           )}
//         </div>
//       </div>

//       <div className="all-products">
//         <h2>All Products</h2>
//         <div className="food-page">
//           {foods?.map((food) => (
//             <FoodCard
//               key={food._id}
//               food={food}
//               onAddToCart={() => handleAddToCart(food._id)}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// const mapStateToProps = (state) => ({
//   foods: state.food.foods,
//   loading: state.food.loading,
// });

// export default connect(mapStateToProps, { getAllFoodsList })(Product);

import React, { useEffect } from "react";
import { connect } from "react-redux";
import Loader from "../../components/loader/Loader";
import FoodCard from "../../components/food-card/FoodCard";
import {
  getAllFoodsList,
  getAllRecommendFoodsList,
} from "../../redux/food/food.actions";
import "./Product.css";

const Product = ({
  recommendedFoods,
  foods,
  loading,
  getAllFoodsList,
  getAllRecommendFoodsList,
}) => {

  useEffect(() => {
    getAllRecommendFoodsList(3); // Fetch recommended products
  }, [getAllRecommendFoodsList]);

  useEffect(() => {
    getAllFoodsList(10); // Fetch all products
  }, [getAllFoodsList]);

  
  return (
    <div className="product-root">
      <h1>All Products</h1>
      {loading && <Loader />}

      {/* Recommended Products */}
      <div className="recommended-products">
        <h2>All Products</h2>
        <div className="food-page">
          {recommendedFoods?.length > 0 ? (
            recommendedFoods.map((food) => (
              <FoodCard key={food._id} food={food} />
            ))
          ) : (
            <p>No recommendations available.</p>
          )}
        </div>
      </div>

      {/* All Products */}
      <div className="all-products">
        <h2>Recommend Products</h2>
        <div className="food-page">
          {foods?.length > 0 ? (
            foods.map((food) => <FoodCard key={food._id} food={food} />)
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
  getAllFoodsList
})(Product);
