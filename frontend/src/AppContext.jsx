import { createContext, useContext, useState, useCallback, useEffect } from "react";
import * as api from "./api";

const AppContext = createContext(null);

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error("useApp must be used inside AppProvider");
    return ctx;
}

function loadDarkMode() {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") return true;
    if (saved === "false") return false;
    return true;
}

export function AppProvider({ children }) {
    const [darkMode, setDarkMode] = useState(loadDarkMode);
    const [user, setUser] = useState(null);
    const [token, setTokenState] = useState(() => localStorage.getItem("token"));
    const [cart, setCart] = useState([]);

    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [productsError, setProductsError] = useState(null);

    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersError, setOrdersError] = useState(null);

    useEffect(() => {
        document.body.classList.toggle("dark-mode", darkMode);
        localStorage.setItem("darkMode", String(darkMode));
    }, [darkMode]);

    const toggleDarkMode = useCallback(() => setDarkMode((prev) => !prev), []);

    // Load products from API
    useEffect(() => {
        setProductsLoading(true);
        setProductsError(null);
        api.fetchProducts()
            .then((data) => setProducts(data))
            .catch((err) => setProductsError(err.message))
            .finally(() => setProductsLoading(false));
    }, []);

    // Restore session from token
    useEffect(() => {
        if (!token) return;
        api.fetchMe()
            .then((u) => setUser(u))
            .catch(() => {
                api.setToken(null);
                setTokenState(null);
            });
    }, [token]);

    // Load orders when user logs in
    const refreshOrders = useCallback(() => {
        if (!token) return;
        setOrdersLoading(true);
        setOrdersError(null);
        api.fetchOrders()
            .then((data) => setOrders(data))
            .catch((err) => setOrdersError(err.message))
            .finally(() => setOrdersLoading(false));
    }, [token]);

    useEffect(() => {
        if (user) refreshOrders();
    }, [user, refreshOrders]);

    const login = useCallback(async (username, password) => {
        const data = await api.login(username, password);
        api.setToken(data.token);
        setTokenState(data.token);
        setUser(data.user);
        return data.user;
    }, []);

    const register = useCallback(async (username, email, password) => {
        const data = await api.register(username, email, password);
        api.setToken(data.token);
        setTokenState(data.token);
        setUser(data.user);
        return data.user;
    }, []);

    const logout = useCallback(() => {
        api.setToken(null);
        setTokenState(null);
        setUser(null);
        setCart([]);
        setOrders([]);
    }, []);

    const updateProfile = useCallback(async (updates) => {
        const updated = await api.updateMe(updates);
        setUser(updated);
    }, []);

    // Cart (client-side, backed by products from API)
    const addToCart = useCallback((productId) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.productId === productId);
            if (existing) {
                return prev.map((item) =>
                    item.productId === productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { productId, quantity: 1 }];
        });
    }, []);

    const removeFromCart = useCallback((productId) => {
        setCart((prev) => prev.filter((item) => item.productId !== productId));
    }, []);

    const updateQuantity = useCallback((productId, quantity) => {
        if (quantity < 1) return;
        setCart((prev) =>
            prev.map((item) =>
                item.productId === productId ? { ...item, quantity } : item
            )
        );
    }, []);

    const clearCart = useCallback(() => setCart([]), []);

    const cartItems = cart.map((item) => {
        const product = products.find((p) => p._id === item.productId);
        return { ...item, product };
    });

    const cartTotal = cartItems.reduce(
        (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
        0
    );

    const placeOrder = useCallback(
        async (shippingInfo) => {
            const orderData = {
                items: cartItems.map((i) => ({
                    productId: i.productId,
                    name: i.product?.name || "Unknown",
                    quantity: i.quantity,
                    price: i.product?.price || 0,
                })),
                total: cartTotal,
                shipping: shippingInfo,
            };
            const order = await api.createOrder(orderData);
            setOrders((prev) => [order, ...prev]);
            clearCart();
            return order;
        },
        [cartItems, cartTotal, clearCart]
    );

    const value = {
        darkMode,
        toggleDarkMode,
        user,
        login,
        register,
        logout,
        updateProfile,
        cart,
        cartItems,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        products,
        productsLoading,
        productsError,
        orders,
        ordersLoading,
        ordersError,
        refreshOrders,
        placeOrder,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
