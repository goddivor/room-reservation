import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "@/app.layout";
import NotFound from "./notFound";
import LandingPage from "./landing";
import { authRoutes } from "@/lib/routes/auth.routes";
import { adminRoutes } from "@/lib/routes/admin.routes";
import { userRoutes } from "@/lib/routes/user.routes";


const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      authRoutes,
      adminRoutes,
      userRoutes,
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
