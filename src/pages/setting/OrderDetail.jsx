import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Image, Space } from "antd";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import "../../styles/setting/OrderDetail.css";
import { CircularProgress } from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

function OrderDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderDetailContainerRef = useRef(null);
  const { orderNumber } = location.state || { orderNumber: "" };

  const [orderDetails, setOrderDetails] = useState(null);
  const [orderProducts, setOrderProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetail = async (id) => {
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch product ${id}`);
        const data = await res.json();
        return {
          type: data.productTypeId?.name || "None",
          skinType: data.skinType || "None",
          volume: data.volume || "None",
        };
      } catch (error) {
        console.error(error.message);
        return {
          type: "None",
          skinType: "None",
          volume: "None",
        };
      }
    };

    const fetchOrderDetail = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, redirecting...");
        navigate("/sign-in");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/order/by-order/${orderNumber}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const contentType = res.headers.get("content-type");
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }

        if (!contentType || !contentType.includes("application/json")) {
          const raw = await res.text();
          throw new Error(`Expected JSON but received: ${raw}`);
        }

        const data = await res.json();

        setOrderDetails({
          orderId: data._id,
          date: data.orderDate,
          name: data.userId?.name || "Unknown",
          phoneNumber: data.phoneNumber || "None",
          shippingAddress: data.shippingAddress,
          paymentMethod: data.paymentMethod,
          note: data.note || "No additional notes",
          totalPrice: data.totalAmount,
          shippingFee: data.shippingFee || 0,
          shippingMethod: data.shippingMethod || "STANDARD",
          orderStatus: data.orderStatus || "Pending",
        });

        const productPromises = data.items.map(async (item) => {
          const productInfo = await fetchProductDetail(item.productId);
          return {
            productId: item.productId,
            name: item.productName,
            imageLinkList: item.productImgUrl,
            quantity: item.quantity,
            lineTotal: item.unitPrice * item.quantity,
            ...productInfo,
          };
        });

        const productsWithDetails = await Promise.all(productPromises);
        setOrderProducts(productsWithDetails);
      } catch (err) {
        console.error("Failed to fetch order:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderNumber]);

  useEffect(() => {
    if (orderDetailContainerRef.current) {
      window.scrollTo({
        top: orderDetailContainerRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  }, [orderDetails]);

  useEffect(() => {
    document.title = "Alurà - Order Detail";
  }, []);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Order History", link: "/order-history" },
    { name: `#${orderNumber}`, link: "" },
  ];

  const menuItems = [
    {
      name: "Profile",
      path: "/profile",
      icon: "fas fa-user-edit",
      iconClass: "icon-edit-profile",
    },
    {
      name: "Order History",
      path: "/order-history",
      icon: "fas fa-history",
      iconClass: "icon-order-history",
    },
  ];

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const handleProductView = (product) => {
    navigate(`/cosmetics/${product.productId}`, {
      state: { id: product.productId },
    });
  };

  return (
    <div className="OrderDetail">
      <Breadcrumb items={navItems} />

      <div className="order_detail_container" ref={orderDetailContainerRef}>
        <div className="order_history_setting_menu">
          <div className="order_history_setting_menu_items">
            {menuItems.map((item) => (
              <div
                key={item.path}
                className={`order_history_setting_menu_item ${item.path === "/order-history" ? "order-history-item" : ""
                  }`}
                onClick={() => navigate(item.path)}>
                <i
                  className={`${item.icon} order_history_setting_menu_icon ${item.iconClass}`}></i>
                <span className="order_history_setting_menu_item_name">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="order_detail_wrapper">
          <div
            className="user_back_order_list"
            onClick={() => navigate("/order-history")}>
            &lt; Back
          </div>
          <div className="order_detail_border">
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "40px 0",
                }}>
                <CircularProgress style={{ color: "#1c1c1c" }} />
              </div>
            ) : (
              <>
                <div className="order_detail_header">
                  <h4 className="order_detail_number">#{orderNumber}</h4>
                  <span className="order_detail_status">
                    {orderDetails?.orderStatus}
                  </span>
                </div>
                <hr className="order_detail_line1" />
                {orderProducts.map((product, index) => (
                  <div key={index} className="order_detail_product">
                    <Space size={12}>
                      <Image
                        width={150}
                        height={130}
                        style={{ objectFit: "cover", marginRight: "10px" }}
                        src={product.imageLinkList}
                      />
                    </Space>
                    <div className="order_detail_product_info">
                      <div className="order_detail_product_header">
                        <h5 className="order_detail_product_name">
                          {product.name} x {product.quantity}
                        </h5>
                        <div className="order_detail_product_links">
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleProductView(product);
                            }}>
                            VIEW
                          </a>
                        </div>
                      </div>
                      <p className="order_detail_product_size">
                        Type: {product.type}
                      </p>
                      <p className="order_detail_product_size">
                        Skin Type: {product.skinType}
                      </p>
                      <p className="order_detail_product_size">
                        Volume: {product.volume}
                      </p>
                      <p className="order_detail_product_price">
                        {product.lineTotal.toLocaleString()} VND
                      </p>
                    </div>
                  </div>
                ))}
                <hr className="order_detail_line2" />
                <div className="order_detail_customer_info">
                  <div className="order_detail_customer_row">
                    <div className="order_detail_customer_item">
                      <i className="fas fa-user"></i>
                      <span>
                        <strong>Customer Name: </strong>
                        {orderDetails?.name}
                      </span>
                    </div>
                    <div className="order_detail_customer_item">
                      <i className="fas fa-phone"></i>
                      <span>
                        <strong>Phone Number: </strong>
                        {orderDetails?.phoneNumber}
                      </span>
                    </div>
                  </div>
                  <div className="order_detail_customer_row">
                    <div className="order_detail_customer_item">
                      <i className="fas fa-credit-card"></i>
                      <span>
                        <strong>Payment Method: </strong>
                        {orderDetails?.paymentMethod}
                      </span>
                    </div>
                    <div className="order_detail_customer_item">
                      <i className="fas fa-shipping-fast"></i>
                      <span>
                        <strong>
                          Shipping ({orderDetails?.shippingMethod}):{" "}
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
                        {orderDetails?.shippingAddress}
                      </span>
                    </div>
                    <div className="order_detail_customer_item">
                      <i className="fas fa-sticky-note"></i>
                      <span>
                        <strong>Note: </strong>
                        {orderDetails?.note}
                      </span>
                    </div>
                  </div>
                </div>
                <hr className="order_detail_line3" />
                <div className="order_detail_footer">
                  <p className="order_detail_date">
                    Order date: {formatDate(orderDetails?.date)}
                  </p>
                  <p className="order_detail_total_price">
                    Total price: {orderDetails?.totalPrice.toLocaleString()} VND
                  </p>
                </div>
                <div className="order_detail_actions">
                  <button
                    className="order_detail_continue_shopping"
                    onClick={() => navigate("/cosmetics")}>
                    <i className="fas fa-shopping-cart"></i> Continue shopping
                  </button>
                  <button
                    className="order_detail_contact_us"
                    onClick={() => navigate("/contact")}>
                    <i className="fas fa-phone"></i> Contact us
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
