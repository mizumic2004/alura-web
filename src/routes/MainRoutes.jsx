import { Routes, Route } from "react-router-dom";
import RoleBasedRoute from "./RoleBasedRoute";

import Home from "../pages/Home";
import VisualSearch from "../pages/visual/VisualSearch";
import Result from "../pages/visual/Result";
import Contact from "../pages/constants/Contact";
import Introduce from "../pages/constants/Introduce";
import Faqs from "../pages/constants/Faqs";
import Login from "../pages/authen/Login";
import Register from "../pages/authen/Register";
import CosmeticList from "../pages/product/CosmeticList";
import ProductDetail from "../pages/product/ProductDetail";
import ProductSearch from "../pages/product/ProductSearch";
import Cart from "../pages/cart/Cart";
import Checkout from "../pages/cart/Checkout";
import Invoice from "../pages/cart/Invoice";
import Profile from "../pages/setting/Profile";
import OrderHistory from "../pages/setting/OrderHistory";
import OrderDetail from "../pages/setting/OrderDetail";

import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import StaffLayout from "../layouts/StaffLayout";

import AdminDashboard from "../pages/admin/Dashboard";
import AdminWarehouseList from "../pages/admin/warehouse/WarehouseList";
import AdminProductList from "../pages/admin/product/ProductList";
import AdminProductDetail from "../pages/admin/product/ProductDetail";
import AdminAccountList from "../pages/admin/account/AccountList";
import AdminBatchList from "../pages/admin/batch/batchList";
import AdminBatchCertificateList from "../pages/admin/batchCertificate/batchCertificateList";
import AdminBatchStockList from "../pages/admin/batchStock/batchStockList";

import StaffOrderList from "../pages/staff/order/OrderList";
import StaffOrderDetail from "../pages/staff/order/OrderDetail";
import StaffProductList from "../pages/staff/product/ProductList";
import StaffProductDetail from "../pages/staff/product/ProductDetail";

const MainRoutes = () => {
  return (
    <Routes>
      {/* Authentication */}
      <Route path="/sign-in" element={<Login />} />
      <Route path="/sign-up" element={<Register />} />

      {/* Public & User Routes */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/introduce" element={<Introduce />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/visual-search" element={<VisualSearch />} />
        <Route path="/visual-search-result" element={<Result />} />
        <Route path="/search" element={<ProductSearch />} />
        <Route path="/cosmetics" element={<CosmeticList />} />
        <Route path="/cosmetics/:id" element={<ProductDetail />} />
      </Route>

      {/* Protected USER routes */}
      <Route element={<RoleBasedRoute allowedRoles={["USER"]} />}>
        <Route element={<UserLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/order-history/:id" element={<OrderDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/invoice" element={<Invoice />} />
        </Route>
      </Route>

      {/* Protected ADMIN routes */}
      <Route element={<RoleBasedRoute allowedRoles={["ADMIN"]} />}>
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/account-list"
          element={
            <AdminLayout>
              <AdminAccountList />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/product-list"
          element={
            <AdminLayout>
              <AdminProductList />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/product-list/:id"
          element={
            <AdminLayout>
              <AdminProductDetail />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/warehouse-list"
          element={
            <AdminLayout>
              <AdminWarehouseList />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/batch-list"
          element={
            <AdminLayout>
              <AdminBatchList />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/batch-certificate-list"
          element={
            <AdminLayout>
              <AdminBatchCertificateList />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/batch-stock-list"
          element={
            <AdminLayout>
              <AdminBatchStockList />
            </AdminLayout>
          }
        />
      </Route>

      {/* Protected STAFF routes */}
      <Route element={<RoleBasedRoute allowedRoles={["STAFF"]} />}>
        <Route
          path="/staff/product-list"
          element={
            <StaffLayout>
              <StaffProductList />
            </StaffLayout>
          }
        />
        <Route
          path="/staff/product-list/:id"
          element={
            <StaffLayout>
              <StaffProductDetail />
            </StaffLayout>
          }
        />
        <Route
          path="/staff/order-list"
          element={
            <StaffLayout>
              <StaffOrderList />
            </StaffLayout>
          }
        />
        <Route
          path="/staff/order-list/:id"
          element={
            <StaffLayout>
              <StaffOrderDetail />
            </StaffLayout>
          }
        />
      </Route>
    </Routes>
  );
};

export default MainRoutes;
