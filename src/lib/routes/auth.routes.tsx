// === AUTH ROUTES ===
// lib/routes/auth.routes.tsx
// **Commit**: `feat: implement authentication system`

import type { RouteObject } from "react-router";
import Auth from "../../pages/auth";
import Login from "../../pages/auth/login";
import SignUp from "../../pages/auth/signup";
import ForgotPassword from "../../pages/auth/forgot-password";

export const authRoutes = {
  path: "/auth",
  element: <Auth />,
  children: [
    { path: "/auth/login", element: <Login /> },
    { path: "/auth/signup", element: <SignUp /> },
    { path: "/auth/forgot-password", element: <ForgotPassword /> },
  ],
} as RouteObject;