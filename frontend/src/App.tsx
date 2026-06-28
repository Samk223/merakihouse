import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import AppRoutes from "./routes/AppRoutes";

const queryClient = new QueryClient();

function App() {
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