import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import RoomsManagement from "@/pages/admin/roomsManagement";
import UsersManagement from "@/pages/admin/UsersManagement";
import type { RouteObject } from "react-router";

export const adminRoutes: RouteObject = {
  path: "/",
  element: <AdminLayout />,
  children: [
    //admin routes
    {
      path: "/admin",
      element: <AdminDashboard />,
    },
    {
      path: "/admin/users",
      element: <UsersManagement />,
    },
    {
      path: "/admin/rooms",
      element: <RoomsManagement />,
    },
  ],
};
