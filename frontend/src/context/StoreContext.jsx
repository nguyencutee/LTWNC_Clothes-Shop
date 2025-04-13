import { createContext, useEffect, useState } from "react";
import React from 'react';
import axios from 'axios';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = React.useState({});
    const url = "http://localhost:4000";
    const [token, setToken] = React.useState("");
    const [food_list, setFoodList] = React.useState([]);

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                if (!itemInfo) {
                    console.warn(`Không tìm thấy thông tin sản phẩm với id: ${item}`);
                    continue;
                }
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount.toLocaleString("vi-VN") + " VNĐ";
    };

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list");
        setFoodList(response.data.data);
    };

    const loadCartData = async (token) => {
        const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
        setCartItems(response.data.cartData);
    };

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                const storedToken = localStorage.getItem("token");
                setToken(storedToken);
                await loadCartData(storedToken);
            }
        }
        loadData();
    }, []);

    // Đồng bộ giỏ hàng: Loại bỏ những mục không còn trong danh sách sản phẩm.
    useEffect(() => {
        setCartItems(prevCart => {
            const updatedCart = {};
            for (const itemId in prevCart) {
                // Kiểm tra xem sản phẩm với itemId có tồn tại trong danh sách food_list hay không.
                const productExists = food_list.find(product => product._id === itemId);
                if (productExists) {
                    updatedCart[itemId] = prevCart[itemId];
                }
            }
            return updatedCart;
        });
    }, [food_list]);

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
