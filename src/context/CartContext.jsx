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
      const a = JSON.parse(localStorage.getItem("checkout_address"));
      return a || { name: "", phone: "", address: "", state: "", district: "", pincode: "" };
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
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, newQty) => {
    if (newQty <= 0) {
      setCart(prev => prev.filter(item => item.id !== productId));
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{
      cart, setCart,
      addToCart, removeFromCart, updateQuantity, clearCart,
      cartCount, cartTotal,
      address, setAddress
    }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
