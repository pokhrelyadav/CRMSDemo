import {
  ADD_TO_CART,
  CLEAR_ITEM_FROM_CART,
  REMOVE_FROM_CART,
  FETCH_RECOMMENDATIONS_REQUEST,
  FETCH_RECOMMENDATIONS_SUCCESS,
  FETCH_RECOMMENDATIONS_FAIL,
} from "./cart.types";

export const AddToCart = (item) => ({
  type: ADD_TO_CART,
  payload: item,
});

export const clearItemFromCart = (itemId) => ({
  type: CLEAR_ITEM_FROM_CART,
  payload: itemId,
});

export const removeFromCart = (item) => ({
  type: REMOVE_FROM_CART,
  payload: item,
});
