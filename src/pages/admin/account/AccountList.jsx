import { useEffect, useState } from "react";
import Table from "../../../components/Table/Table";
import "../../../styles/admin/account/AccountList.css";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

function AccountList({ searchQuery }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        document.title = "Manage Account - Alurà System Management";
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const url = searchQuery
                ? `${API_URL}/profile?searchByEmail=${encodeURIComponent(searchQuery)}`
                : `${API_URL}/profile`;

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.success && data.users) {
                setUsers(data.users);
            } else {
                console.error("Failed to fetch users");
                toast.error("Failed to load user accounts");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Error loading accounts.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [searchQuery]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`${API_URL}/auth/register-staff`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success("Staff account created successfully.");
                setIsModalOpen(false);
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    phone: "",
                    address: "",
                });
                fetchUsers();
            } else {
                toast.error(data.message || "Failed to create staff account.");
            }
        } catch (err) {
            console.error("Error creating account:", err);
            toast.error("An error occurred while creating the account.");
        }
    };

    const columns = ["Role", "Email", "Name", "Phone Number", "Address"];
    const adminData = users.filter(
        (user) => user.role === "ADMIN" || user.role === "STAFF"
    );
    const userData = users.filter((user) => user.role === "USER");

    const transformData = (data) =>
        data.map((user) => ({
            role: user.role,
            email: user.email,
            name: user.name,
            phone_number: user.phone || "None",
            address: user.address || "None",
        }));

    return (
        <div className="AccountList">
            <div className="account_list_container">
                <div className="account_list_header">
                    <h2 className="admin_main_title">Admin & Staff Accounts</h2>
                    <button
                        className="add_account_btn"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add New Staff Account
                    </button>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <Table columns={columns} data={transformData(adminData)} />
                        <div className="account_list_header">
                            <h2 className="admin_main_title" style={{ marginTop: "10px" }}>
                                User Accounts
                            </h2>
                        </div>
                        <Table columns={columns} data={transformData(userData)} />
                    </>
                )}
            </div>

            {isModalOpen && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <button
                            className="close_modal_btn"
                            onClick={() => setIsModalOpen(false)}
                        >
                            ×
                        </button>
                        <h5>Add New Staff Account</h5>
                        <form
                            className="product_form"
                            onSubmit={(e) => {
                                e.preventDefault();

                                if (formData.password.length < 8) {
                                    toast.error("Password must have at least 8 characters.");
                                    return;
                                }

                                if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
                                    toast.error("Phone number must be 10 digits.");
                                    return;
                                }

                                handleSubmit(e);
                            }}
                        >
                            <div className="form_group">
                                <label>Name</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form_group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form_group position-relative">
                                <label>Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                                <span className="admin_password_eye">
                                    <i
                                        className={`far ${showPassword ? "fa-eye-slash" : "fa-eye"
                                            }`}
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        style={{
                                            position: "absolute",
                                            right: "10px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            cursor: "pointer",
                                            color: "#999",
                                        }}
                                    ></i>
                                </span>
                            </div>

                            <div className="form_group">
                                <label>Phone (optional)</label>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form_group">
                                <label>Address (optional)</label>
                                <input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form_group">
                                <button type="submit" className="add_account_btn">
                                    Create Account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AccountList;
