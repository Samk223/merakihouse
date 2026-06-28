import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import AppRoutes from "./routes/AppRoutes";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Find the closest hoverable element/group/button/link
      const hoverTarget = target.closest<HTMLElement>(
        'button, a, [role="button"], .group, [class*="hover:"], [class*="group-hover:"]'
      );

      if (!hoverTarget) return;

      // Clear any sticky hover state after a delay (e.g., 800ms)
      // This allows the animation/zoom/scale to play on tap and then reset cleanly
      setTimeout(() => {
        const originalPointerEvents = hoverTarget.style.pointerEvents;
        hoverTarget.style.pointerEvents = "none";
        
        // Force reflow to apply the pointer-events style and clear hover pseudo-class
        void hoverTarget.offsetHeight;

        requestAnimationFrame(() => {
          hoverTarget.style.pointerEvents = originalPointerEvents;
        });
      }, 800);
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

// import { useEffect } from "react";
// import { supabase } from "./lib/supabase";

// function App() {
//   useEffect(() => {
//     async function testConnection() {
//       const { data, error } = await supabase
//         .from("test_connection")
//         .select("*");

//       console.log("Data:", data);
//       console.log("Error:", error);
//     }

//     testConnection();
//   }, []);

//   return <h1>Meraki House</h1>;
// }

// export default App;