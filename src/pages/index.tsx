import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "@/app.layout";
import NotFound from "./notFound";
import StarterPage from "./StarterPage";
import { authRoutes } from "@/lib/routes/auth.routes";


const router = createBrowserRouter([
  {
    // Wraps the entire app in the root layout
    element: <RootLayout />,
    // Mounted where the <Outlet /> component is inside the root layout
    children: [
      //   { path: "/", element: <LandingPage /> },
      {
        path: "/",
        element: <StarterPage />,
      },
      authRoutes,
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
