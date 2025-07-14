import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import "../../styles/setting/Profile.css";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";

const API_URL = import.meta.env.VITE_API_URL;

function Profile() {
    const navigate = useNavigate();
    const [isPasswordFormVisible, setPasswordFormVisible] = useState(false);

    const [tempFirstName, setTempFirstName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [isGoogleUser, setIsGoogleUser] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [userId, setUserId] = useState(null);

    const navItems = [
        { name: "Home", link: "/" },
        { name: "Profile", link: "" },
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

    useEffect(() => {
        document.title = "Alurà - Profile";
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const userIdDecoded = decoded.userId;
                setUserId(userIdDecoded);

                fetch(`${API_URL}/profile/${userIdDecoded}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then(res => {
                        if (!res.ok) throw new Error("Unauthorized or failed request");
                        return res.json();
                    })
                    .then(data => {
                        if (data?.success && data.user) {
                            const user = data.user;
                            setTempFirstName(user.name || "");
                            setEmail(user.email || "");
                            setPhoneNumber(user.phone || "");
                            setAddress(user.address || "");
                            setIsGoogleUser(user.isGoogle || false);
                        }
                    })
                    .catch(err => {
                        console.error("Failed to fetch profile:", err);
                        toast.error("Failed to load profile data.");
                    });
            } catch (err) {
                console.error("Token decode error:", err);
                toast.error("Invalid session. Please login again.");
            }
        }
    }, []);

    const togglePasswordForm = () => {
        setPasswordFormVisible(!isPasswordFormVisible);
    };

    const handleSaveProfileChanges = async () => {
        const token = localStorage.getItem("token");
        if (!token || !userId) {
            toast.error("You must be logged in to update your profile.");
            return;
        }

        const payload = {
            name: tempFirstName,
            email,
            phone,
            address,
        };

        try {
            const res = await fetch(`${API_URL}/profile/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (res.ok && data.success) {
                toast.success("Profile updated successfully!");
            } else {
                throw new Error(data.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("An error occurred while updating the profile.");
        }
    };

    const handleChangePassword = async () => {
        if (newPassword.length < 8) {
            toast.error("New password must have at least 8 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/auth/change-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            const contentType = res.headers.get("content-type");
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text);
            }

            if (contentType && contentType.includes("application/json")) {
                const data = await res.json();
                if (data.success) {
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setPasswordFormVisible(false);
                } else {
                    toast.success("Password changed successfully.");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                }
            } else {
                throw new Error("Unexpected response from server.");
            }
        } catch (error) {
            console.error("Password change error:", error);
            toast.error("Current password is wrong.");
        }
    };

    return (
        <div className="Profile">
            <Breadcrumb items={navItems} />
            <div className="edit_profile_container">
                <div className="setting_menu">
                    <div className="setting_menu_section" />
                    <div className="setting_menu_items">
                        {menuItems.map((item) => (
                            <div
                                key={item.path}
                                className={`setting_menu_item ${item.path === "/profile" ? "profile-item" : ""}`}
                                onClick={() => navigate(item.path)}
                            >
                                <i className={`${item.icon} setting_menu_icon ${item.iconClass}`}></i>
                                <span className="setting_menu_item_name">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="edit_profile_form">
                    <h2>Profile Setting</h2>
                    <form>
                        <div className="edit_form_group full_width">
                            <label>Name *</label>
                            <input
                                type="text"
                                value={tempFirstName}
                                onChange={(e) => setTempFirstName(e.target.value)}
                                disabled={isGoogleUser}
                                className={isGoogleUser ? "disabled_input" : ""}
                            />
                        </div>
                        <div className="edit_form_group">
                            <label>Email *</label>
                            <input className="edit_email" type="email" value={email} readOnly />
                        </div>
                        <div className="edit_form_group">
                            <label>Phone number</label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                        <div className="edit_form_group full_width">
                            <label>Address</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <button
                            type="button"
                            className="edit_form_save_button"
                            onClick={handleSaveProfileChanges}
                        >
                            Save change
                        </button>
                    </form>

                    {!isGoogleUser && (
                        <>
                            <hr className="edit_profile_line" />
                            <h2 onClick={togglePasswordForm} className="toggle_password_form">
                                Change Password
                                <i className={`fas ${isPasswordFormVisible ? "fa-chevron-up" : "fa-chevron-down"} toggle_icon`}></i>
                            </h2>
                            {isPasswordFormVisible && (
                                <form>
                                    <div className="edit_form_group full_width position-relative">
                                        <label>Current password</label>
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                        />
                                        <span className="edit_password_eye">
                                            <i
                                                className={`far ${showCurrentPassword ? "fa-eye-slash" : "fa-eye"}`}
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                style={{ cursor: "pointer" }}
                                            ></i>
                                        </span>
                                    </div>
                                    <div className="edit_form_group full_width position-relative">
                                        <label>New password</label>
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <span className="edit_password_eye">
                                            <i
                                                className={`far ${showNewPassword ? "fa-eye-slash" : "fa-eye"}`}
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                style={{ cursor: "pointer" }}
                                            ></i>
                                        </span>
                                    </div>
                                    <div className="edit_form_group full_width position-relative">
                                        <label>Confirm new password</label>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <span className="edit_password_eye">
                                            <i
                                                className={`far ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                style={{ cursor: "pointer" }}
                                            ></i>
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        className="edit_form_save_button"
                                        onClick={handleChangePassword}
                                        disabled={!currentPassword || !newPassword || !confirmPassword}
                                    >
                                        Save new password
                                    </button>
                                </form>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;
