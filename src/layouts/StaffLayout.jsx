import { useLocation } from "react-router-dom";
import { useState, cloneElement } from "react";
import StaffSidebar from "../components/Sidebar/StaffSidebar";
import './AdminLayout.css';
import logo from '../assets/logo.png';
import { Link } from "react-router-dom";

const StaffLayout = ({ children }) => {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchInput, setSearchInput] = useState("");

    const showSearchPaths = [
        "/staff/order-list",
        "/staff/product-list",
    ];

    const showSearch = showSearchPaths.includes(location.pathname);

    const placeholderMap = {
        "/staff/order-list": "Search by order id...",
        "/staff/product-list": "Search by name...",
    };

    const placeholder = placeholderMap[location.pathname] || "Search...";

    const isOrderPage = location.pathname === "/staff/order-list";
    const isProductPage = location.pathname === "/staff/product-list";

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            setSearchQuery(searchInput.trim());
        }
    };

    return (
        <div className="admin_layout">
            <StaffSidebar />
            <div className="admin_content_wrapper">
                <div className="admin_top_card">
                    <Link to="/staff/product-list">
                        <img src={logo} alt="Logo" className="admin_logo" />
                    </Link>
                    {showSearch && (
                        <div className="admin_search_section">
                            <div className="admin_search_bar_container">
                                <i className="fas fa-search admin_search_icon"></i>
                                <input
                                    type="text"
                                    className="admin_search_bar"
                                    placeholder={placeholder}
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="admin_content_card">
                    {(isOrderPage || isProductPage)
                        ? cloneElement(children, { searchQuery })
                        : children}
                </div>
            </div>
        </div>
    );
};

export default StaffLayout;
