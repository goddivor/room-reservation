import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "@/app.layout";
import NotFound from "./notFound";
import LandingPage from "./landing";
import RoomsPage from "./RoomsPage";
import RoomTypeDetailPage from "./RoomTypeDetailPage";
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
      {
        path: "/rooms",
        element: <RoomsPage />,
      },
      {
        path: "/rooms/:roomTypeId",
        element: <RoomTypeDetailPage />,
      },
      authRoutes,
      adminRoutes,
      userRoutes,
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
