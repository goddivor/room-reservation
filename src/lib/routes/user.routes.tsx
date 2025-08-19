import type { RouteObject } from "react-router";
import UserLayout from "@/components/layout/UserLayout";
import UserDashboard from "@/pages/user/UserDashboard";
import UserProfile from "@/pages/user/UserProfile";
import UserReservations from "@/pages/user/UserReservations";
import UserMessages from "@/pages/user/UserMessages";

export const userRoutes: RouteObject = {
  path: "/user",
  element: <UserLayout />,
  children: [
    {
      index: true,
      element: <UserDashboard />,
    },
    {
      path: "profile",
      element: <UserProfile />,
    },
    {
      path: "reservations",
      element: <UserReservations />,
    },
    {
      path: "messages",
      element: <UserMessages />,
    },
  ],
};