import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from '../../../components/Table/Table';
import { Chip, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL;

function OrderList({ searchQuery = "" }) {
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState("All");
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        document.title = "Manage Order - Alurà System Management";
        fetchOrders();
    }, [searchQuery]);

    const fetchOrders = async () => {
        const token = localStorage.getItem("token");
        if (!token) return console.error("No token found.");

        try {
            const url = searchQuery
                ? `${API_URL}/order/all?searchById=${encodeURIComponent(
                    searchQuery
                )}`
                : `${API_URL}/order/all`;

            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`HTTP ${res.status}: ${errorText}`);
            }

            const data = await res.json();
            setOrders(Array.isArray(data) ? data : [data]);
        } catch (error) {
            console.error("Failed to fetch orders:", error.message);
        }
    };

    const columns = ["Order ID", "User", "Order Date", "Total (VND)", "Status", "Detail"];

    const getStatusChip = (status) => {
        const statusMap = {
            Pending: { label: "Pending", color: "warning" },
            // Processing: { label: "Processing", color: "error" },
            Paid: { label: "Paid", color: "info" },
            Delivered: { label: "Delivered", color: "primary" },
            Shipped: { label: "Shipped", color: "info" },
            Success: { label: "Success", color: "success" },
            Cancelled: { label: "Cancelled", color: "error" },
        };
        const { label, color } = statusMap[status] || { label: status, color: "default" };
        return <Chip label={label} color={color} size="small" sx={{ fontSize: "11px", height: 18 }} />;
    };

    const filteredOrders = statusFilter === "All"
        ? orders
        : orders.filter(order => order.orderStatus === statusFilter || order.paymentStatus === statusFilter);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB");
    };

    const tableData = filteredOrders.map(order => ({
        order_id: order._id,
        order_date: formatDate(order.orderDate),
        "total_(vnd)": order.totalAmount.toLocaleString(),
        status: getStatusChip(order.orderStatus || order.paymentStatus),
        detail: (
            <i
                className="fas fa-info-circle detail_icon"
                title="View Details"
                onClick={() => navigate(`/staff/order-list/${order._id}`)}
            />
        ),
        user: order.userId?.name || "Unknown"
    }));

    return (
        <div className="ProductList">
            <div className="product_list_container">
                <div className="product_list_header">
                    <h2 className="admin_main_title">Manage Order</h2>

                    <FormControl size="small" sx={{ minWidth: 130, height: 35 }}>
                        <InputLabel id="status-select-label">Status</InputLabel>
                        <Select
                            labelId="status-select-label"
                            id="status-select"
                            value={statusFilter}
                            label="Status"
                            onChange={(e) => setStatusFilter(e.target.value)}
                            sx={{ height: 35, fontSize: 14, padding: '0 8px' }}
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

                <Table columns={columns} data={tableData} />
            </div>
        </div>
    );
}

export default OrderList;
