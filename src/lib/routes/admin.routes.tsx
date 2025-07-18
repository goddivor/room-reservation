import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import RoomConfiguration from "@/pages/admin/RoomConfiguration";
import RoomsManagement from "@/pages/admin/RoomsManagement";
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
    {
      path: "/admin/room-config",
      element: <RoomConfiguration />,
    },
  ],
};
