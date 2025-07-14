import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useCheckAuthorization } from "../lib/authHelpers";

const RoleBasedRoute = ({ allowedRoles }) => {
  const { token, role } = useSelector((state) => state.auth);

  const isAuthorized = useCheckAuthorization(token, role, allowedRoles);

  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;
