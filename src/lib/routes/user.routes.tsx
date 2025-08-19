import type { RouteObject } from "react-router";
import UserLayout from "@/components/layout/UserLayout";
import UserDashboard from "@/pages/user/UserDashboard";
import UserProfile from "@/pages/user/UserProfile";

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
  ],
};