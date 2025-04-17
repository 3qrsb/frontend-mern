import { configureStore, combineReducers, compose } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { authorizationProvider } from "../utils/auth-axios";
import cartSlice from "./cart/cart-slice";
import { productListSlice } from "./products/slice-list";
import productDetailsSlice from "./products/slice-details";
import productFilterSlice from "./products/search-list";
import orderListSlice from "./orders/slice-list";
import userOrderSlice from "./orders/user-orders";
import orderDetailSlice from "./orders/order-details";
import loginSlice from "./users/login-slice";
import userDetailsSlice from "./users/user-details";
import userListSlice from "./users/user-list";
import currencySlice from "./settings/currencySlice";
import exchangeRatesSlice from "./settings/exchangeRatesSlice";
import reviewsSlice from "./reviews/review-slice";

const reducers = combineReducers({
  productList: productListSlice.reducer,
  cart: cartSlice.reducer,
  productDetail: productDetailsSlice.reducer,
  productFilter: productFilterSlice.reducer,
  login: loginSlice.reducer,
  userDetails: userDetailsSlice.reducer,
  userList: userListSlice.reducer,
  orders: orderListSlice.reducer,
  userOrder: userOrderSlice.reducer,
  orderDetail: orderDetailSlice.reducer,
  currency: currencySlice.reducer,
  exchangeRates: exchangeRatesSlice.reducer,
  reviews: reviewsSlice.reducer,
});

const persistConfig = {
  key: "root",
  storage,
};
const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

authorizationProvider(store);
