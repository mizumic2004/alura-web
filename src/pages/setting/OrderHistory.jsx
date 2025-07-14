import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/setting/OrderHistory.css";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { Select, MenuItem, FormControl, InputLabel, CircularProgress, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [loading, setLoading] = useState(true);
  const [confirmCancelOrderId, setConfirmCancelOrderId] = useState(null);
  const ordersPerPage = 6;
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user || !token) return;

        const res = await fetch(`${API_URL}/order/by-user/${user}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const contentType = res.headers.get("content-type");
        if (!res.ok) throw new Error(await res.text());
        if (!contentType.includes("application/json")) throw new Error("Expected JSON response");

        const data = await res.json();

        const formattedOrders = data.map((order) => ({
          orderId: order._id,
          date: order.orderDate,
          totalPrice: order.totalAmount,
          orderStatus: order.paymentStatus || order.orderStatus || "Unknown",
        }));

        setOrders(formattedOrders);
        setFilteredOrders(formattedOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, user]);

  useEffect(() => {
    let filtered = [...orders];
    if (filterStatus !== "All") {
      filtered = filtered.filter((order) => order.orderStatus === filterStatus);
    }
    if (sortOrder === "Newest") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [filterStatus, sortOrder, orders]);

  useEffect(() => {
    document.title = "Alurà - Order History";
  }, []);

  useEffect(() => {
    if (confirmCancelOrderId) {
      const timer = setTimeout(() => {
        setConfirmCancelOrderId(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [confirmCancelOrderId]);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Order History", link: "" },
  ];

  const menuItems = [
    { name: "Profile", path: "/profile", icon: "fas fa-user-edit", iconClass: "icon-edit-profile" },
    { name: "Order History", path: "/order-history", icon: "fas fa-history", iconClass: "icon-order-history" },
  ];

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const handleDetailClick = (orderNumber) => {
    navigate(`/order-history/${orderNumber}`, { state: { orderNumber } });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleCancelOrder = async (orderId) => {
    if (confirmCancelOrderId !== orderId) {
      setConfirmCancelOrderId(orderId);
      toast.warning("Press 'CANCEL ORDER' one more time to confirm cancellation.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/order/cancel/${orderId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(await res.text());

      toast.success("Order cancelled successfully.");
      setOrders((prev) =>
        prev.map((order) =>
          order.orderId === orderId ? { ...order, orderStatus: "Cancelled" } : order
        )
      );
    } catch (error) {
      toast.error(`Can only cancel order is pending or processing.`);
    } finally {
      setConfirmCancelOrderId(null);
    }
  };

  return (
    <div className="OrderHistory">
      <Breadcrumb items={navItems} />
      <div className="order_history_container">
        <div className="order_history_setting_menu">
          <div className="order_history_setting_menu_section" />
          <div className="order_history_setting_menu_items">
            {menuItems.map((item) => (
              <div
                key={item.path}
                className={`order_history_setting_menu_item ${item.path === "/order-history" ? "order-history-item" : ""}`}
                onClick={() => navigate(item.path)}
              >
                <i className={`${item.icon} order_history_setting_menu_icon ${item.iconClass}`} />
                <span className="order_history_setting_menu_item_name">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="order_history_table_wrapper">
          <div className="order_filters">
            <h2 className="order_history_title">Order History</h2>
            <div className="order_filter_controls">
              <FormControl fullWidth size="small">
                <InputLabel id="sortOrderLabel">Sort</InputLabel>
                <Select
                  labelId="sortOrderLabel"
                  id="sortOrder"
                  value={sortOrder}
                  label="Sort By"
                  onChange={handleSortChange}
                >
                  <MenuItem value="Newest">Newest</MenuItem>
                  <MenuItem value="Oldest">Oldest</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel id="orderFilterLabel">Status</InputLabel>
                <Select
                  labelId="orderFilterLabel"
                  id="orderFilter"
                  value={filterStatus}
                  label="Filter"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Processing">Processing</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                  <MenuItem value="Shipped">Shipped</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                  <MenuItem value="Success">Success</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          {loading ? (
            <div className="loading_wrapper">
              <CircularProgress style={{ color: "#1c1c1c" }} />
            </div>
          ) : (
            <>
              <table className="order_history_table table">
                <thead>
                  <tr>
                    <th>Order Date</th>
                    <th>Order ID</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Action</th>
                    <th>Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((order) => (
                    <tr key={order.orderId}>
                      <td>{formatDate(order.date)}</td>
                      <td>{order.orderId}</td>
                      <td>{order.totalPrice.toLocaleString()} VND</td>
                      <td>{order.orderStatus}</td>
                      <td>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          disabled={!["Pending", "Processing"].includes(order.orderStatus)}
                          onClick={() => handleCancelOrder(order.orderId)}
                        >
                          Cancel Order
                        </Button>
                      </td>
                      <td>
                        <i
                          className="order_history_detail_icon fas fa-external-link-alt"
                          onClick={() => handleDetailClick(order.orderId)}
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="order_history_pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={index + 1 === currentPage ? "order_active" : ""}
                  >
                    {index + 1}
                  </button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                  &gt;
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderHistory;
