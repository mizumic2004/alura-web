import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Image, Space } from 'antd';
import '../../../styles/staff/order/OrderDetail.css';
import {
    Select,
    MenuItem,
    Button,
    InputLabel,
    FormControl,
} from '@mui/material';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL;

function OrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const orderDetailContainerRef = useRef(null);

    const [orderDetails, setOrderDetails] = useState(null);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true);

    const statusTransitions = {
        Pending: ['Processing', 'Cancelled'],
        Processing: ['Shipped', 'Cancelled'],
        Shipped: ['Delivered'],
        Delivered: ['Success'],
    };

    useEffect(() => {
        document.title = 'Order Detail - Alurà System Management';
        fetchOrderDetail();
    }, [id]);

    const fetchOrderDetail = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch(`${API_URL}/order/by-order/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error(await res.text());

            const data = await res.json();
            setOrderDetails(data);
            setStatus(data.orderStatus);
            setLoading(false);
        } catch (err) {
            toast.error(`Failed to load order: ${err.message}`);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (orderDetailContainerRef.current) {
            window.scrollTo({
                top: orderDetailContainerRef.current.offsetTop,
                behavior: 'smooth',
            });
        }
    }, [orderDetails]);

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const handleStatusUpdate = async () => {
        if (!status || status === orderDetails.orderStatus) {
            toast.info('No changes to update.');
            return;
        }

        if (
            !statusTransitions[orderDetails.orderStatus]?.includes(status)
        ) {
            toast.error(
                `Invalid status transition from ${orderDetails.orderStatus} to ${status}`
            );
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch(`${API_URL}/order/update-cod/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ orderStatus: status }),
            });

            if (!res.ok) throw new Error(await res.text());

            toast.success('Order status updated successfully!');
            fetchOrderDetail();
        } catch (err) {
            toast.error(`Failed to update status: ${err.message}`);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!orderDetails) return <div>Error loading order details.</div>;

    const availableStatusOptions = [
        orderDetails.orderStatus,
        ...(statusTransitions[orderDetails.orderStatus] || []),
    ];

    return (
        <div className="staff_order_detail">
            <div
                className="staff_order_detail_container"
                ref={orderDetailContainerRef}
            >
                <div className="staff_order_detail_wrapper">
                    <div
                        className="staff_back"
                        onClick={() => navigate('/staff/order-list')}
                    >
                        &lt; Back
                    </div>

                    <div className="staff_order_detail_border">
                        <div className="staff_order_detail_header">
                            <h4 className="staff_order_detail_number">
                                #{orderDetails._id}
                            </h4>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                }}
                            >
                                <FormControl
                                    size="small"
                                    style={{ marginRight: '10px', width: '150px' }}
                                >
                                    <InputLabel id="orderFilterLabel">Status</InputLabel>
                                    <Select
                                        labelId="orderFilterLabel"
                                        id="orderFilter"
                                        value={status}
                                        label="Status"
                                        onChange={(e) => setStatus(e.target.value)}
                                        sx={{ height: '40px' }}
                                    >
                                        {[orderDetails.orderStatus, ...(statusTransitions[orderDetails.orderStatus] || [])].map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <button
                                    className="staff_update_btn"
                                    onClick={handleStatusUpdate}
                                    disabled={["Success", "Cancelled"].includes(orderDetails.orderStatus)}
                                >
                                    Update Status
                                </button>
                            </div>
                        </div>

                        <hr className="staff_order_detail_line1" />

                        {orderDetails.items.map((product, index) => (
                            <div
                                key={index}
                                className="staff_order_detail_product"
                            >
                                <Space size={12}>
                                    <Image
                                        width={150}
                                        height={130}
                                        style={{
                                            objectFit: 'cover',
                                            marginRight: '10px',
                                        }}
                                        src={product.productImgUrl}
                                        preview={false}
                                    />
                                </Space>
                                <div className="staff_order_detail_product_info">
                                    <div className="staff_order_detail_product_header">
                                        <h5 className="staff_order_detail_product_name">
                                            {product.productName}
                                        </h5>
                                    </div>
                                    <p className="staff_order_detail_product_size">
                                        Price: {product.unitPrice.toLocaleString()} VND
                                    </p>
                                    <p className="staff_order_detail_product_size">
                                        Quantity: {product.quantity}
                                    </p>
                                    <p className="staff_order_detail_product_price">
                                        Total:{' '}
                                        {(
                                            product.unitPrice * product.quantity
                                        ).toLocaleString()}{' '}
                                        VND
                                    </p>
                                </div>
                            </div>
                        ))}

                        <hr className="staff_order_detail_line2" />

                        <div className="order_detail_customer_info">
                            <div className="order_detail_customer_row">
                                <div className="order_detail_customer_item">
                                    <i className="fas fa-user"></i>
                                    <span>
                                        <strong>Customer Name: </strong>
                                        <span>{orderDetails.userId?.name}</span>
                                    </span>
                                </div>
                                <div className="order_detail_customer_item">
                                    <i className="fas fa-phone"></i>
                                    <span>
                                        <strong>Phone Number: </strong>
                                        <span>
                                            {orderDetails.userId?.phone || 'None'}
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <div className="order_detail_customer_row">
                                <div className="order_detail_customer_item">
                                    <i className="fas fa-credit-card"></i>
                                    <span>
                                        <strong>Payment Method: </strong>
                                        <span>{orderDetails.paymentMethod}</span>
                                    </span>
                                </div>
                                <div className="order_detail_customer_item">
                                    <i className="fas fa-shipping-fast"></i>
                                    <span>
                                        <strong>
                                            Shipping ({orderDetails?.shippingMethod}):{' '}
                                        </strong>
                                        {orderDetails?.shippingFee.toLocaleString()} VND
                                    </span>
                                </div>
                            </div>
                            <div className="order_detail_customer_row">
                                <div className="order_detail_customer_item">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <span>
                                        <strong>Address: </strong>
                                        <span>{orderDetails.shippingAddress}</span>
                                    </span>
                                </div>
                                <div className="order_detail_customer_item">
                                    <i className="fas fa-sticky-note"></i>
                                    <span>
                                        <strong>Note: </strong>
                                        <span>{orderDetails.note || 'None'}</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <hr className="staff_order_detail_line3" />

                        <div className="staff_order_detail_footer">
                            <p className="staff_order_detail_date">
                                Order date: {formatDate(orderDetails.orderDate)}
                            </p>
                            <p className="staff_order_detail_total_price">
                                Total price:{' '}
                                {orderDetails.totalAmount.toLocaleString()} VND
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetail;
