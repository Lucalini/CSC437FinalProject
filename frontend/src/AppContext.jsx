import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { PRODUCTS, INITIAL_REVIEWS, INITIAL_ORDERS } from "./data";

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
  const [cart, setCart] = useState([]);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [nextReviewId, setNextReviewId] = useState(INITIAL_REVIEWS.length + 1);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => setDarkMode((prev) => !prev), []);

  const login = useCallback((name, email) => {
    setUser({
      name,
      email,
      address: "123 Market St, San Jose, CA 95112",
      preferredMaterial: "PLA",
      notifications: "Email",
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setCart([]);
  }, []);

  const updateProfile = useCallback((updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

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
    const product = PRODUCTS.find((p) => p.id === item.productId);
    return { ...item, product };
  });

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
    0
  );

  const addReview = useCallback(
    (review) => {
      setReviews((prev) => [...prev, { ...review, id: nextReviewId }]);
      setNextReviewId((prev) => prev + 1);
    },
    [nextReviewId]
  );

  const getProductReviews = useCallback(
    (productId) => reviews.filter((r) => r.productId === productId),
    [reviews]
  );

  const placeOrder = useCallback(
    (shippingInfo) => {
      const orderNum = 1043 + orders.length;
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const itemsSummary = cartItems
        .map((i) => `${i.product?.name} (${i.quantity})`)
        .join(", ");
      const newOrder = {
        id: `PM-${orderNum}`,
        date: dateStr,
        status: "Processing",
        items: itemsSummary,
      };
      setOrders((prev) => [newOrder, ...prev]);
      clearCart();
      return newOrder;
    },
    [cartItems, orders.length, clearCart]
  );

  const value = {
    darkMode,
    toggleDarkMode,
    user,
    login,
    logout,
    updateProfile,
    cart,
    cartItems,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    reviews,
    addReview,
    getProductReviews,
    orders,
    placeOrder,
    products: PRODUCTS,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
