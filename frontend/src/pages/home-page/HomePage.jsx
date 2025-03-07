import React from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';

import canteen from '../../assets/canteen.jpg';

import stationary from '../../assets/stationary.png';
import pharmacy from '../../assets/pharmacy.png';
import mart from '../../assets/mart.jpg';

import { getAllFoodItems } from '../../redux/food/food.actions';
const Homepage = () => {
  return (
    <div>
      {/* <div className="landing-page-div">
        <div className="landing-page-header"> </div>
      </div> */}
      <div className="menu">
        <div className="menu-header">
          <h3>Our Retailers...</h3>
        </div>
        <div className="menu-card-div">
          <div className="menu-card">
            <div className="red">
              <h1>Stationary</h1>
            </div>
            <img src={mart} className="image" alt="tea" />
            <div>
              <Link
                to="/food/breakfast"
                onClick={() => getAllFoodItems('breakfast')}
              >
                <button className="button">See More</button>
              </Link>
            </div>
          </div>
          <div className="menu-card">
            <div className="red">
              <h1>Ritesh Khaja</h1>
            </div>
            <img src={canteen} className="dosa" alt="dosa" />
            <div>
              <Link to="/food/indian" onClick={() => getAllFoodItems('indian')}>
                <button className="button">See More</button>
              </Link>
            </div>
          </div>
          <div className="menu-card">
            <div className="red">
              <h1>AR Mart</h1>
            </div>
            <img src={stationary} className="chinese" alt="noodles" />
            <div>
              <Link
                to="/food/chinese"
                onClick={() => getAllFoodItems('chinese')}
              >
                <button className="button">See More</button>
              </Link>
            </div>
          </div>
          <div className="menu-card breakfast">
            <div className="red">
              <h1>Inus Pharmacy</h1>
            </div>
            <img src={pharmacy} className="samosa" alt="samosa" />
            <div>
              <Link to="/food/chat" onClick={() => getAllFoodItems('chat')}>
                <button className="button">See More</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Homepage;
