/* eslint-disable @typescript-eslint/no-unused-vars */
import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ReservationsManagement from "@/pages/admin/ReservationsManagement";
import RoomConfiguration from "@/pages/admin/RoomConfiguration";
import RoomsManagement from "@/pages/admin/RoomsManagement";
import UsersManagement from "@/pages/admin/UsersManagement";
import type { Reservation } from "@/types";
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
    {
      path: "/admin/reservations",
      element: <ReservationsManagement/>,
    },
  ],
};
