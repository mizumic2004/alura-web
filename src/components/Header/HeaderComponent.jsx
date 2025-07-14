import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useCart } from "../../context/CartContext";
import { logout } from "../../store/authSlice";
// import { waitForRehydration } from "../../store/store";
import "../Header/Header.css";

const API_URL = import.meta.env.VITE_API_URL;

const HeaderComponent = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const { cartCount, setCartCount } = useCart();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        setIsLoggedIn(true);
        try {
          const decoded = jwtDecode(token);
          const now = Math.floor(Date.now() / 1000);
          if (decoded.exp && decoded.exp < now + 300) {
            console.log("Token will expire soon or has expired");
            dispatch(logout());
            setIsLoggedIn(false);
            navigate("/sign-in");
            return;
          }

          const userId = decoded.userId;
          const res = await fetch(`${API_URL}/profile/${userId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.status === 401) {
            console.log("401 Unauthorized - Token may be expired or invalid");
            dispatch(logout());
            setIsLoggedIn(false);
            navigate("/sign-in");
            return;
          }

          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }

          const data = await res.json();
          if (data?.success) {
            setUserInfo(data.user);
            await fetchCartCount(token);
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          dispatch(logout());
          setIsLoggedIn(false);
          navigate("/sign-in");
        }
      } else {
        setIsLoggedIn(false);
        setCartCount(0);
      }
    };

    checkAuth();
  }, [token, dispatch, navigate]);

  const fetchCartCount = async (token) => {
    try {
      const res = await fetch(`${API_URL}/cart`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status !== 200) return;

      const data = await res.json();
      setCartCount(data?.items?.length || 0);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsLoggedIn(false);
    setUserInfo(null);
    setCartCount(0);
    navigate("/sign-in");
  };

  const handleTypeNavigate = (type) => {
    window.scrollTo(0, 0);
    navigate("/cosmetics", { state: { type } });
  };

  return (
    <header className="header">
      <div className="top_announcement">
        Standard shipping nationwide in Vietnam for all orders. Order today for
        best service.
      </div>
      <div className="top_header container-fluid">
        <div
          className="row align-items-center"
          style={{ backgroundColor: "white" }}>
          <div className="col-md-5 col-lg-5 col-sm-12">
            <div className="contact_info">
              <Link to="tel:0795795959">
                <p className="contact_phone">
                  <i className="fas fa-phone-alt"></i>0795 795 959
                </p>
              </Link>
              <a
                href="https://www.google.com/maps/place/Tr%C6%B0%E1%BB%9Dng+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+FPT+TP.+HCM"
                target="_blank"
                rel="noopener noreferrer">
                <p className="contact_address">
                  <i className="fas fa-map-marker-alt"></i> D1 Street, Long
                  Thanh My, Thu Duc City, Ho Chi Minh City
                </p>
              </a>
            </div>
          </div>
          <div className="logo_container col-md-2 col-lg-2 col-sm-12 text-center">
            <Link to="/">
              <img className="logo" src={logo} alt="Logo" />
            </Link>
          </div>
          <div className="col-md-5 col-lg-5 col-sm-12 text-end">
            <div className="header_icons">
              <div className="col-sm-12 search_section">
                <div className="search_bar_container">
                  <i className="fas fa-search search_icon"></i>
                  <input
                    type="text"
                    className="search_bar"
                    placeholder="Search product by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter" && searchTerm.trim() !== "") {
                        try {
                          const response = await fetch(
                            `${API_URL}/products?searchByName=${encodeURIComponent(
                              searchTerm
                            )}&pageIndex=1&pageSize=100`
                          );
                          const data = await response.json();

                          if (data.success && data.products) {
                            navigate("/search", {
                              state: {
                                products: data.products,
                                searchQuery: searchTerm,
                              },
                            });
                            setSearchTerm("");
                          } else {
                            navigate("/search", {
                              state: {
                                products: [],
                                searchQuery: searchTerm,
                              },
                            });
                            setSearchTerm("");
                          }
                        } catch (error) {
                          console.error("Search error:", error);
                        }
                      }
                    }}
                  />
                </div>
              </div>
              <div
                className="cart_icon position-relative"
                onClick={() => {
                  navigate("/cart");
                }}
                style={{ cursor: "pointer" }}>
                <i className="icon_cart fas fa-shopping-bag"></i>
                {cartCount > 0 && (
                  <span className="cart_count_badge">{cartCount}</span>
                )}
              </div>

              <div className="account_dropdown_section">
                <div className="dropdown-toggle-icon" onClick={toggleDropdown}>
                  <i className="icon_account fas fa-user"></i>
                  <i
                    className={`fas fa-chevron-down arrow-icon ${
                      isDropdownOpen ? "rotate" : ""
                    }`}></i>
                </div>

                <div
                  className={`user-dropdown-menu ${
                    isDropdownOpen ? "open" : ""
                  }`}>
                  {isLoggedIn ? (
                    <div className="user-logged-in">
                      <div className="user-info">
                        <p className="username">
                          {userInfo?.name || "User"} (
                          {userInfo?.email || "Email"})
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        state={{
                          userId: jwtDecode(token).userId,
                        }}
                        className="user-dropdown-menu-link">
                        <i className="fas fa-user-circle dropdown-icon"></i>{" "}
                        Profile
                      </Link>
                      <Link
                        to="/order-history"
                        className="user-dropdown-menu-link">
                        <i className="fas fa-history dropdown-icon"></i> Order
                        history
                      </Link>
                      <div
                        onClick={handleLogout}
                        className="user-dropdown-menu-link handle-logout"
                        style={{ cursor: "pointer" }}>
                        <i className="fas fa-sign-in-alt dropdown-icon"></i>{" "}
                        Sign out
                      </div>
                    </div>
                  ) : (
                    <div className="user-not-logged-in">
                      <Link to="/sign-in" className="user-dropdown-menu-link">
                        <i className="fas fa-sign-in-alt dropdown-icon"></i>{" "}
                        Sign in
                      </Link>
                      <Link to="/sign-up" className="user-dropdown-menu-link">
                        <i className="fas fa-user-plus dropdown-icon"></i> Sign
                        up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-center"
            id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="home nav-link" to="/">
                  HOME
                </Link>
              </li>
              <li className="nav-item dropdown-cosmetics">
                <Link className="home nav-link cosmetics-link" to="/cosmetics">
                  COSMETICS
                  <i className="cosmetics-arrow-icon fas fa-chevron-down arrow-icon"></i>
                </Link>
                <div className="cosmetics-dropdown">
                  <div className="dropdown-column">
                    <h6>Facial</h6>
                    <p onClick={() => handleTypeNavigate("Cleanser")}>Cleanser</p>
                    <p onClick={() => handleTypeNavigate("Toner")}>Toner</p>
                    <p onClick={() => handleTypeNavigate("Serum")}>Serum</p>
                    <p onClick={() => handleTypeNavigate("Face Mask")}>Face Mask</p>
                    <p onClick={() => handleTypeNavigate("Cream")}>Cream</p>
                  </div>
                  <div className="dropdown-column">
                    <h6>Hair</h6>
                    <p onClick={() => handleTypeNavigate("Shampoo")}>Shampoo</p>
                    <p onClick={() => handleTypeNavigate("Conditioner")}>Conditioner</p>
                    <p onClick={() => handleTypeNavigate("Hair Serum")}>Hair Serum</p>
                    <p onClick={() => handleTypeNavigate("Hair Tonic")}>Hair Tonic</p>
                    <p onClick={() => handleTypeNavigate("Scalp Treatment")}>Scalp Treatment</p>
                  </div>
                  <div className="dropdown-column">
                    <h6>Body</h6>
                    <p onClick={() => handleTypeNavigate("Body Lotion")}>Body Lotion</p>
                    <p onClick={() => handleTypeNavigate("Body Wash")}>Body Wash</p>
                    <p onClick={() => handleTypeNavigate("Deodorant")}>Deodorant</p>
                    <p onClick={() => handleTypeNavigate("Sunscreen")}>Sunscreen</p>
                    <p onClick={() => handleTypeNavigate("Body Scrub")}>Body Scrub</p>
                  </div>
                  <div className="dropdown-column">
                    <h6>Lips & Nails</h6>
                    <p onClick={() => handleTypeNavigate("Lip Stick")}>Lip Stick</p>
                    <p onClick={() => handleTypeNavigate("Lip Scrub")}>Lip Scrub</p>
                    <p onClick={() => handleTypeNavigate("Nail Strengthener")}>Nail Strengthener</p>
                    <p onClick={() => handleTypeNavigate("Cuticle Oil")}>Cuticle Oil</p>
                    <p onClick={() => handleTypeNavigate("Nail Treatment")}>Nail Treatment</p>
                  </div>
                  <div className="dropdown-viewall">
                    <Link to="/cosmetics">View all →</Link>
                  </div>
                </div>
              </li>
              <li className="nav-item">
                <Link className="home nav-link" to="/visual-search">
                  VISUAL SEARCH
                </Link>
              </li>
              <li className="nav-item">
                <Link className="home nav-link" to="/faqs">
                  FAQS
                </Link>
              </li>
              <li className="nav-item">
                <Link className="home nav-link" to="/introduce">
                  INTRODUCE
                </Link>
              </li>
              <li className="nav-item">
                <Link className="home nav-link" to="/contact">
                  CONTACT US
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderComponent;
