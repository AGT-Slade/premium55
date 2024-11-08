import { createContext, useContext, useReducer } from "react";
//import logger from "use-reducer-logger";

export const Store = createContext(null);

const initialState = {
    userInfo: localStorage.getItem('userInfo') ? 
    JSON.parse(localStorage.getItem('userInfo')) : 
    null,

    cart: {
      shippingAddress: localStorage.getItem('shippingAddress') ? 
      JSON.parse(localStorage.getItem('shippingAddress')) : 
      {},

      paymentMethod: localStorage.getItem('paymentMethod') ? 
      localStorage.getItem('paymentMethod') : '',

      cartItems: localStorage.getItem('cartItems') ? 
                  JSON.parse(localStorage.getItem('cartItems')) : 
                  [],
    }
};



  function reducer(state, action) {
    switch (action.type) {
      case 'CART_ADD_ITEM': {
     
        //add to cart 
        const newItem = action.payload;
        const existItem = state.cart.cartItems.find((item) => item._id  === newItem._id);
      
        const cartItems = existItem ? state.cart.cartItems.map((item) => item._id === existItem._id ? newItem : item) 
        : [...state.cart.cartItems, newItem];
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        return {...state, cart: {...state.cart, cartItems: cartItems}};
      }
      case 'CART_REMOVE_ITEM': {
        const cartItems = state.cart.cartItems.filter((item) => item._id !== action.payload._id);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        return {...state, cart: {...state.cart, cartItems: cartItems}}
      }
      case 'CART_CLEAR': {
        return {...state, cart: {...state.cart, cartItems: []}}
      }
      case 'USER_SIGNIN': { 
        return {...state, userInfo: action.payload}
      }
      case 'USER_SIGNOUT': { 
        return {...state, userInfo: null, cart: {cartItems: [], shippingAddress: {}, paymentMethod: ''},}
      }
      case 'SAVE_SHIPPING_ADDRESS': { 
        return {...state, cart: {...state.cart, shippingAddress: action.payload}}
      }
      case 'SAVE_PAYMENT_METHOD': { 
        return {...state, cart: {...state.cart, paymentMethod: action.payload}}
      }
      default:
        return state;
    }
  }



export function StoreProvider(props) {
    const [state, ctxDispatch] = useReducer(reducer, initialState);

    if (!props) {
        throw new Error("StoreProvider requires a props object");
    }

    if (!props.children) {
        throw new Error("StoreProvider requires a children prop");
    }

    if (typeof props.children !== "object" || Array.isArray(props.children)) {
        throw new Error("StoreProvider's children prop must be a single React element");
    }

    const value = {state, ctxDispatch};
    return (
        <Store.Provider value={value}>
            {props.children}
        </Store.Provider>
    );
}

export const useStore = () => useContext(Store);