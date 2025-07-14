import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import qr from "../../assets/qr.jpg";
import Insta from "../../components/Insta/Instagram";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
// import { useCart } from "../../services/CartService";
import "../../styles/cart/Invoice.css";
import { toast } from "sonner";

function Invoice() {
  const navItems = [
    { name: "Home", link: "/" },
    { name: "Cart", link: "/cart" },
    { name: "Checkout", link: "" },
    { name: "Invoice", link: "" },
  ];

  useEffect(() => {
    document.title = "Alurà - Invoice";
  }, []);

  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  // const { setCartItems: updateCartContext } = useCart();

  useEffect(() => {
    window.scrollTo(0, 160);
  }, []);

  // Handle vnpay success return
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("orderId");
    toast.success("Order placed successfully! ");
  }, [navigate]);

  // useEffect(() => {
  //     const fetchData = () => {
  //         const orderId = parseInt(localStorage.getItem("orderId"));
  //         const invoiceKey = `invoice${orderId}`;
  //         const storedInvoiceData = JSON.parse(localStorage.getItem(invoiceKey));

  //         if (storedInvoiceData) {
  //             setInvoiceData(storedInvoiceData);
  //             localStorage.removeItem(invoiceKey);
  //             localStorage.removeItem("orderId");
  //         }

  //         const customerId = localStorage.getItem("customerId");
  //         const cartKey = `cartItems${customerId}`;
  //         localStorage.removeItem(cartKey);
  //         updateCartContext([]);
  //         setLoading(false);
  //     };

  //     fetchData();
  // }, [updateCartContext]);

  useEffect(() => {
    // Mock invoice data for UI testing
    const mockInvoice = {
      orderId: 123456,
      orderDate: new Date(),
      orderTotalPrice: 150,
      orderDiscount: 0,
      paymentMethod: "Bank Transfer", // or "VNPAY" / "Cash"
      cartItems: [
        {
          name: "Elegant Perfume",
          price: 40.0,
          quantity: 2,
        },
        {
          name: "Vaseline",
          price: 55.0,
          quantity: 1,
        },
      ],
    };

    setInvoiceData(mockInvoice);
    setLoading(false);
  }, []);

  if (loading || !invoiceData) {
    return <div>Loading invoice data...</div>;
  }

  const {
    orderId,
    orderDate,
    orderTotalPrice,
    orderDiscount,
    paymentMethod,
    cartItems,
  } = invoiceData;

  const formattedDate = new Date(orderDate).toLocaleDateString("en-GB");

  const expandedCartItems = cartItems.flatMap((item) =>
    Array(item.quantity)
      .fill()
      .map(() => ({
        name: item.name + " x" + item.quantity,
        price: Math.floor(item.price),
      }))
  );

  return (
    <div className="Invoice">
      <Breadcrumb items={navItems} />

      <div className="invoice_container">
        <div className="invoice_order_summary">
          <h4 className="invoice_title">THANK YOU FOR YOUR ORDER</h4>
          <div className="invoice_content">
            <div className="invoice_left_section">
              <table>
                <thead>
                  <tr>
                    <th>Detail</th>
                    <th>Sub Total</th>
                  </tr>
                </thead>
                <tbody>
                  {expandedCartItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>${item.price}</td>
                    </tr>
                  ))}
                  <tr>
                    <td>Discount</td>
                    <td>${Math.floor(orderDiscount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="invoice_right_section">
              <div className="invoice_top_right_section">
                <h5>Your order has been received</h5>
                <ul>
                  <li>
                    <span>•</span> Order number: <strong>{orderId}</strong>
                  </li>
                  <li>
                    <span>•</span> Date order: <strong>{formattedDate}</strong>
                  </li>
                  <li>
                    <span>•</span> Total price:{" "}
                    <strong>${Math.floor(orderTotalPrice)}</strong>
                  </li>
                  <li>
                    <span>•</span> Payment method:{" "}
                    <strong>{paymentMethod}</strong>
                  </li>
                </ul>
              </div>
              <div className="invoice_bottom_right_section">
                {paymentMethod === "Bank Transfer" ? (
                  <ul>
                    <li>
                      Bank account: <strong>050124800983 Sacombank</strong>
                    </li>
                    <li>
                      Transfer content (important):{" "}
                      <strong>ALURA{orderId}</strong>
                    </li>
                    <li>
                      Order will be cancel after 2 days if do not transfer
                    </li>
                    <li>
                      Contact hotline{" "}
                      <a href="tel:0795795959">
                        <strong> 0795795959 </strong>
                      </a>{" "}
                      to transact directly at store
                    </li>
                    <img src={qr} className="qr" alt="QR Code" />
                  </ul>
                ) : paymentMethod === "Cash" ? (
                  <ul>
                    <li>Order will be prepare about four days</li>
                    <li>Keep track your order at order history section</li>
                    <li>
                      Contact hotline{" "}
                      <a href="tel:0795795959">
                        <strong> 0795795959 </strong>
                      </a>{" "}
                      to transact directly at store
                    </li>
                  </ul>
                ) : paymentMethod === "VNPAY" ? (
                  <ul>
                    <li>Order will be prepare about four days</li>
                    <li>Keep track your order at order history section</li>
                    <li>
                      Contact hotline{" "}
                      <a href="tel:0795795959">
                        <strong> 0795795959 </strong>
                      </a>{" "}
                      to pay directly at store
                    </li>
                  </ul>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <br />
      <br />
      <Insta />
    </div>
  );
}

export default Invoice;
