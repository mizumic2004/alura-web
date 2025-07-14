import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './AdminSidebar.css';

const AdminSidebar = () => {
    const [expanded, setExpanded] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const currentPath = location.pathname;

    const token = localStorage.getItem('token');
    let email = '';
    if (token) {
        try {
            const decoded = jwtDecode(token);
            email = decoded.email;
        } catch (err) {
            console.error('Failed to decode token:', err);
        }
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1200) {
                setExpanded(false);
            } else {
                setExpanded(true);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setExpanded((prev) => !prev);
    };


    const menuItems = [
        { label: 'Dashboard', icon: 'fa-bar-chart', path: '/admin/dashboard' },
        { label: 'Manage Account', icon: 'fa-users', path: '/admin/account-list' },
        { label: 'Manage Product', icon: 'fa-paint-brush', path: '/admin/product-list' },
        { label: 'Manage Batch', icon: 'fa-cube', path: '/admin/batch-list' },
        { label: 'Manage Batch Stock', icon: 'fa-cubes', path: '/admin/batch-stock-list' },
        { label: 'Manage Batch Certificate', icon: 'fa-file-text', path: '/admin/batch-certificate-list' },
        { label: 'Distributor & Warehouse', icon: 'fa-database', path: '/admin/warehouse-list' },
    ];

    return (
        <div className={`admin_sidebar ${expanded ? 'expanded' : 'collapsed'}`}>
            <div className="admin_sidebar_header">
                <div className={`admin_sidebar_profile ${expanded ? '' : 'hidden'}`}>
                    <div className="admin_sidebar_full_name">Admin</div>
                    <div className="admin_sidebar_under_name">
                        {email ? ` (${email})` : ''}
                    </div>
                </div>

                <div className="admin_sidebar_toggle_button toggle-button" onClick={toggleSidebar}>
                    {expanded ? <i className="fas fa-angle-left"></i> : <i className="fas fa-angle-right"></i>}
                </div>
            </div>

            <hr className="admin_side_bar_line1" />

            {expanded ? (
                <div className="admin_sidebar_content">
                    <ul className="admin_sidebar_menu">
                        {menuItems.map((item) => (
                            <li
                                key={item.path}
                                className={`admin_sidebar_menu_item ${currentPath.startsWith(item.path) ? 'selected' : ''}`}
                                onClick={() => navigate(item.path)}
                            >
                                <i className={`fas ${item.icon}`}></i>
                                <span>{item.label}</span>
                            </li>
                        ))}
                        <div className="admin_sidebar_sign_out" onClick={() => navigate("/sign-in")}>
                            <i className="fas fa-sign-out-alt"></i>
                            <span>Sign Out</span>
                        </div>
                    </ul>
                </div>
            ) : (
                <div className="admin_sidebar_icons">
                    <ul className="admin_sidebar_menu_icons">
                        {menuItems.map((item) => (
                            <li
                                key={item.path}
                                className={`admin_sidebar_menu_item ${currentPath.startsWith(item.path) ? 'selected' : ''}`}
                                data-tooltip={item.label}
                                onClick={() => navigate(item.path)}
                            >
                                <i className={`fas ${item.icon}`}></i>
                            </li>
                        ))}
                        <div
                            className="admin_sidebar_sign_out_icon"
                            data-tooltip="Sign Out"
                            onClick={() => navigate("/sign-in")}
                        >
                            <i className="fas fa-sign-out-alt"></i>
                        </div>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AdminSidebar;
