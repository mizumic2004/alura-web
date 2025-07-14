import { Image, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Insta from "../../components/Insta/Instagram";
import { useCart } from "../../context/CartContext";
import "../../styles/cart/Cart.css";
import { useSelector } from "react-redux";

function Cart() {
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Cart", link: "" },
  ];

  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { setCartCount } = useCart();
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);

  console.log("=== CART COMPONENT RENDER ===");
  console.log("Token:", !!token);
  console.log("API_URL:", API_URL);
  console.log("Loading:", loading);
  console.log("CartItems length:", cartItems.length);

  // Authentication and initial data fetch
  useEffect(() => {
    console.log("=== DEBUG CART ===");
    console.log("Token:", token);
    console.log("API_URL:", API_URL);
    document.title = "Alurà - Cart";
    fetchCartItems();
  }, []);

  // Handle vnpay fail return
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const responseCode = urlParams.get("responseCode");
    if (!responseCode) return;
    switch (responseCode) {
      case "24":
        toast.error("Payment cancelled by user.");
        break;
      case "97":
        toast.error("Invalid signature.");
        break;
      case "500":
        toast.error("Internal server error. Please try again later.");
        break;
      default:
        toast.error("Payment failed. Please try again.");
    }
  }, []);

  // Fetch cart items from API
  const fetchCartItems = async () => {
    console.log("=== DEBUG CART ===");
    console.log("Token:", token);
    console.log("API_URL:", API_URL);
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/cart`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || "Failed to load cart.");
      }

      const data = await response.json();
      setCartItems(data.items || []);
      setTotalAmount(data.totalAmount || 0);
      setCartCount(data.items?.length || 0);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast.error("An error occurred while loading the cart.");
      setCartItems([]);
      setTotalAmount(0);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle quantity change
  const handleQuantityChange = async (cartItemId, newQuantity) => {
    if (!token) {
      toast.error("You must be logged in to change quantity.");
      return;
    }

    if (newQuantity < 1) return;

    try {
      setUpdating(true);
      const response = await fetch(`${API_URL}/cart/item/${cartItemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || "Failed to update quantity.");
      }

      // Refresh cart data
      await fetchCartItems();
      toast.success("Quantity updated successfully.");
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Quantity is not enough.");
    } finally {
      setUpdating(false);
    }
  };

  // Navigate to product detail page
  const handleViewProduct = (item) => {
    navigate(`/cosmetics/${item}`, {
      state: { id: item },
    });
  };

  // Navigate to checkout page
  const handleCheckoutPage = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items before checking out.");
      return;
    }

    try {
      // Call preview API before checkout
      const selectedCartItemIds = cartItems.map((item) => item._id);

      const response = await fetch(`${API_URL}/cart/preview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          selectedCartItemIds,
          promotionId: null,
          shippingMethod: "STANDARD",
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        toast.error(errData?.message || "Failed to prepare checkout.");
        return;
      }

      const previewData = await response.json();

      // Navigate to checkout with preview data
      navigate("/checkout", {
        state: {
          cartItems,
          totalAmount,
          previewData,
        },
      });
    } catch (error) {
      console.error("Error preparing checkout:", error);
      toast.error("An error occurred while preparing checkout.");
    }
  };

  // Remove item from cart
  const handleRemoveFromCart = async (itemId) => {
    if (!token) {
      toast.error("You must be logged in.");
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch(`${API_URL}/cart/item/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || "Failed to remove item.");
      }

      toast.success("Item removed from cart.");

      // Refresh cart data
      await fetchCartItems();
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("An error occurred while removing the item.");
    } finally {
      setUpdating(false);
    }
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="cart_loading">
      <Spin />
    </div>
  );

  // Empty cart component
  const EmptyCart = () => (
    <div className="cart_empty_message">
      <h5>Your cart is empty</h5>
      <p> Let's add something to the cart!</p>

    </div>
  );

  // Cart item component
  const CartItem = ({ item }) => {
    const product = item.productId;
    const quantity = item.quantity;
    const productType = item.productType;
    const price = item.unitPrice;

    return (
      <div className="cart_item" key={item._id}>
        <Image
          src={item.imgUrls?.[0] || product?.imgUrls?.[0]}
          className="cart_item_image"
          alt={item.productName || product?.name}
          width={200}
          height={200}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1xkE8A8b6/tS9hM4vQGIeCDCK7hOAV1Q5Q1cUnMJ3CW4K6j0BzBAAeFsGQY2jm1wT9Dy1d9kPSb6s6FP9/T/eW5/yj4="
        />
        <div className="cart_item_details">
          <div className="cart_item_header">
            <h5 className="cart_item_name">
              {item.productName || product?.name}
            </h5>
            <div className="cart_item_links">
              <span
                onClick={() => handleViewProduct(product)}
                className="cart_item_view">
                VIEW
              </span>
              <span> | </span>
              <span
                className="cart_item_remove"
                onClick={() => handleRemoveFromCart(item._id)}>
                REMOVE
              </span>
            </div>
          </div>
          <p className="cart_item_description">
            Type: {productType}
          </p>

          <p className="cart_item_description">
            Price: {price?.toLocaleString() || 0} VND
          </p>

          <div className="cart_item_footer">
            <div className="quantity_selector_container">
              <label className="quantity_label">Quantity:</label>
              <div className="quantity_controls">
                <button
                  className="quantity_btn"
                  onClick={() =>
                    handleQuantityChange(item._id, Math.max(quantity - 1, 1))
                  }
                  disabled={quantity <= 1 || updating}>
                  -
                </button>
                <input
                  type="number"
                  className="quantity_input"
                  value={quantity}
                  readOnly
                />
                <button
                  className="quantity_btn"
                  onClick={() => handleQuantityChange(item._id, quantity + 1)}
                  disabled={quantity >= (product?.stock || 99) || updating}>
                  +
                </button>
              </div>
            </div>

            <div className="cart_item_price">
              {((price || 0) * quantity).toLocaleString()} VND
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="cart">
      <Breadcrumb items={navItems} />

      <div className="cart_main_container">
        <div className="cart_header">
          <div className="cart_title">
            <i className="fas fa-shopping-cart"></i> Cart ({cartItems.length})
          </div>
          <div
            className="continue_shopping"
            onClick={() => navigate("/cosmetics")}>
            &lt; Continue Shopping
          </div>
        </div>

        <div className="cart_container">
          {loading ? (
            <LoadingSpinner />
          ) : cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="cart_items">
              <Image.PreviewGroup>
                {cartItems.map((item) => (
                  <CartItem key={item._id} item={item} />
                ))}
              </Image.PreviewGroup>
            </div>
          )}

          <div className="cart_summary">
            <h5 className="cart_summary_title">
              <i className="fas fa-receipt"></i> Summary
            </h5>
            <div className="cart_summary_details">
              <p className="cart_summary_subtotal">
                <span>Subtotal:</span>
                <span>
                  <strong>{totalAmount.toLocaleString()} VND</strong>
                </span>
              </p>
              <p className="cart_summary_total">
                <span>Total:</span>
                <span>
                  <strong>{totalAmount.toLocaleString()} VND</strong>
                </span>
              </p>
            </div>
            <hr />
            <button
              onClick={handleCheckoutPage}
              className="cart_summary_checkout"
              disabled={cartItems.length === 0 || loading || updating}>
              {updating ? (
                <>
                  <i
                    className="fas fa-spinner fa-spin"
                    style={{ marginRight: "5px" }}></i>
                  Updating...
                </>
              ) : (
                "Proceed to checkout"
              )}
            </button>
            <div className="cart_summary_service">
              <p className="24/7_service">
                <strong>24/7 Customer Service</strong>
              </p>
              <a href="tel:0795795959">
                <p className="phone_service">
                  <i className="fas fa-phone"></i> 0795 795 959
                </p>
              </a>
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

export default Cart;
