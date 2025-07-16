import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "@/app.layout";
import NotFound from "./notFound";
import StarterPage from "./StarterPage";
import { authRoutes } from "@/lib/routes/auth.routes";

import { adminRoutes } from "@/lib/routes/admin.routes";


const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <StarterPage />,
      },
      authRoutes,
      adminRoutes,
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
