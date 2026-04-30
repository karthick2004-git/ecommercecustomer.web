import { useState, useEffect } from "react";

export function useHash() {
  const [hash, setHash] = useState(window.location.hash || "#home");

  useEffect(() => {
    const handler = () => setHash(window.location.hash || "#home");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  return hash;
}
