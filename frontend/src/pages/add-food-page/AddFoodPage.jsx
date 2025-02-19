import React, { useState } from "react";
import { connect } from "react-redux";
import { addFoodItem } from "../../redux/food/food.actions";
import "./AddFoodPage.css";

const AddFoodPage = ({ isAuthenticated, loading, addFoodItem, history }) => {
  const [formData, setFormData] = useState({
    foodType: "",
    name: "",
    price: "",
    description: "",
    quantity: "",
  });

  const [image, setImage] = useState("");

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { name, price, description , foodType, quantity } = formData;

  const onSubmit = (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("foodType", foodType);
    formdata.append("name", name);
    formdata.append("price", price);
    formdata.append("description", description)
    formdata.append("quantity", quantity);
    formdata.append("image", image);

    addFoodItem(formdata, history);
  };

  return (
    <div className="root">
      <div className="add-food-div">
        <div>
          <h1>Add food item</h1>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              name="name"
              className="input"
              placeholder="Name"
              value={name}
              onChange={onChange}
            />
            <br />
            <input
              type="text"
              name="price"
              className="input"
              placeholder="Price"
              value={price}
              onChange={onChange}
            />
            <br />
            <input
              type="text"
              name="description"
              className="input"
              placeholder="Description"
              value={description}
              onChange={onChange}
            />
            <br/>
            <input
              type="text"
              name="quantity"
              className="input"
              placeholder="Quantity"
              value={quantity}
              onChange={onChange}
            />
            <br />
            <select name="foodType" value={foodType} onChange={onChange}>
              <option value="null">Stores List</option>
              <option value="breakfast">Store 1</option>
              <option value="indian">Store 2</option>
              <option value="chinese">Store 3</option>
              <option value="chat">Store 4</option>
            </select>
            <br />
            <input
              type="file"
              name="image"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <br />
            <button>Submit</button>
          </form>
        </div>
        <div>
          <img
            alt="img"
            src={
              image
                ? URL.createObjectURL(image)
                : "https://wallpaperaccess.com/full/1285990.jpg"
            }
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.food.loading,
});

export default connect(mapStateToProps, { addFoodItem })(AddFoodPage);
