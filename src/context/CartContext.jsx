import { createContext, useContext, useState, useEffect, useCallback } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const c = JSON.parse(localStorage.getItem("cart"));
      return Array.isArray(c) ? c : [];
    } catch {
      return [];
    }
  });

  const [address, setAddress] = useState(() => {
    try {
      const savedAddr = JSON.parse(localStorage.getItem("checkout_address"));
      return savedAddr || { name: "", phone: "", address: "", state: "", district: "", pincode: "" };
    } catch {
      return { name: "", phone: "", address: "", state: "", district: "", pincode: "" };
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("checkout_address", JSON.stringify(address));
  }, [address]);



  const addToCart = useCallback((product) => {
    setCart(prev => {
      // Use cartKey to differentiate same product with diff size/color
      const cartKey = `${product.id}-${product.size || ''}-${product.color || ''}`;
      const existing = prev.find(item => item.cartKey === cartKey);
      if (existing) {
        return prev.map(item =>
          item.cartKey === cartKey
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prev, { ...product, cartKey, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((cartKey) => {
    setCart(prev => prev.filter(item => item.cartKey !== cartKey && item.id !== cartKey));
  }, []);

  const updateQuantity = useCallback((cartKey, newQty) => {
    if (newQty <= 0) {
      setCart(prev => prev.filter(item => item.cartKey !== cartKey && item.id !== cartKey));
      return;
    }
    setCart(prev =>
      prev.map(item =>
        (item.cartKey === cartKey || item.id === cartKey) ? { ...item, quantity: newQty } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  // Base total (without GST)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  // GST total
  const cartGst = cart.reduce((sum, item) => {
    const gstPct = item.gst_percent || 0;
    const itemGst = Math.round(item.price * (gstPct / 100));
    return sum + itemGst * (item.quantity || 1);
  }, 0);
  const cartTotalWithGst = cartTotal + cartGst;

  return (
    <CartContext.Provider value={{
      cart, setCart,
      addToCart, removeFromCart, updateQuantity, clearCart,
      cartCount, cartTotal, cartGst, cartTotalWithGst,
      address, setAddress
    }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
