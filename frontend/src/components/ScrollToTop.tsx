import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Disable the browser's default scroll restoration logic on reload
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    // Instantly scroll window to top coordinates
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
