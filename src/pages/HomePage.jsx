import { useState, useEffect } from "react";
import HeroSection from "../components/sections/HeroSection";
import MarqueeSection from "../components/sections/MarqueeSection";
import CollectionSection from "../components/sections/CollectionSection";
import FeaturedProducts from "../components/sections/FeaturedProducts";
import NewDesignSection from "../components/sections/NewDesignSection";
import ReviewsSection from "../components/sections/ReviewsSection";
import MenswearSection from "../components/sections/MenswearSection";
import FashionTrends from "../components/sections/FashionTrends";
import ContactSection from "../components/sections/ContactSection";
import ApiPage from "../api/ApiPage";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await ApiPage.fetchProducts('collection', 0);
        setProducts(data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div id="mainContent">
      <HeroSection />
      <MarqueeSection />
      <CollectionSection />
      <FeaturedProducts products={products} loading={loading} />
      <NewDesignSection />
      <ReviewsSection />
      <MenswearSection />
      <FashionTrends />
      <ContactSection />
    </div>
  );
}
