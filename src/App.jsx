import { useEffect } from "react";
import { CartProvider } from "./context/CartContext";
import { useHash } from "./hooks/useHash";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrdersPage from "./pages/OrdersPage";
import ContactPage from "./pages/ContactPage";
import AuthPage from "./pages/AuthPage";


function AppRouter() {
  const hash = useHash();

  const renderPage = () => {
    if (hash === "#home" || hash === "") return <><Navbar /><HomePage /><Footer /></>;
    if (hash === "#contact") return <><Navbar /><ContactPage /><Footer /></>;
    if (hash.startsWith("#collection/")) {
      const category = hash.replace("#collection/", "").split('?')[0];
      return <ShopPage category={category} />;
    }
    if (hash === "#collection") return <ShopPage category="new-arrivals" />;
    if (hash.startsWith("#product/")) {
      const id = hash.replace("#product/", "");
      return <ProductPage productId={id} />;
    }
    if (hash === "#cart") return <CartPage />;
    if (hash === "#address") return <CheckoutPage />;
    if (hash === "#payment") return <PaymentPage />;
    if (hash.startsWith("#order-success")) {
      const orderId = hash.replace("#order-success/", "").replace("#order-success", "");
      return <OrderSuccessPage orderId={orderId} />;
    }
    if (hash === "#checkout") {
      window.location.hash = "#cart";
      return null;
    }
    if (hash === "#orders") return <OrdersPage />;
    if (hash === "#login") return <AuthPage initialView="login" />;
    if (hash === "#signup") return <AuthPage initialView="signup" />;
    return <><Navbar /><HomePage /><Footer /></>;
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const observeElements = () => {
      const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
      reveals.forEach(el => observer.observe(el));
    };

    observeElements();

    // Watch for dynamic content changes
    const mutationObserver = new MutationObserver(() => observeElements());
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [hash]);

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      {renderPage()}
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppRouter />
    </CartProvider>
  );
}
