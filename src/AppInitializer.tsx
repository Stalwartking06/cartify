import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  loginSuccess,
  logout,
  setAuthChecked,
} from "./features/auth/authSlice";
import { setCart } from "./features/cart/cartSlice";
import { getCartApi } from "./services/cart.api";
import type { AppDispatch } from "./app/store";
import { isTokenExpired } from "./utils/auth.utils";

const AppInitializer = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const init = async () => {
      try {
        const user = localStorage.getItem("user");
        const token = JSON.parse(localStorage.getItem("token") || "null");
        if (token && isTokenExpired(token)) {
          dispatch(logout());
          return;
        }
        if (token && user) {
          let parsedUser;

          try {
            parsedUser = JSON.parse(user);
          } catch {
            console.warn("Invalid user data in localStorage");
            localStorage.removeItem("user");
            return;
          }

          dispatch(loginSuccess(parsedUser));

          try {
            const cart = await getCartApi();

            const mappedCart =
              cart?.items?.map((i: any) => ({
                id: i.productId?._id,
                title: i.productId?.title,
                price: i.priceAtThatTime,
                qty: i.quantity,
                image: i.productId?.images?.[0]?.url,
              })) || [];

            dispatch(setCart(mappedCart));
          } catch (err) {
            console.error("Cart load failed", err);
            dispatch(setCart([]));
          }
        }
      } finally {
        // 🔥 ALWAYS RUN
        dispatch(setAuthChecked());
      }
    };

    init();
  }, [dispatch]);

  return null;
};

export default AppInitializer;
