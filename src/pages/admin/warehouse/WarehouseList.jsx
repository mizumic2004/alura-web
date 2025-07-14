import { useEffect, useState } from "react";
import Table from "../../../components/Table/Table";
import "../../../styles/admin/warehouse/WarehouseList.css";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL;

function WarehouseList() {
    const [isWarehouseUpdateModalOpen, setIsWarehouseUpdateModalOpen] = useState(false);
    const [isWarehouseDeleteModalOpen, setIsWarehouseDeleteModalOpen] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [warehouses, setWarehouses] = useState([]);

    const [isDistributorUpdateModalOpen, setIsDistributorUpdateModalOpen] = useState(false);
    const [isDistributorDeleteModalOpen, setIsDistributorDeleteModalOpen] = useState(false);
    const [selectedDistributor, setSelectedDistributor] = useState(null);
    const [distributors, setDistributors] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
    });

    const getToken = () => localStorage.getItem("token");

    const getAdminId = () => {
        try {
            const token = getToken();
            if (!token) return "";
            const decoded = jwtDecode(token);
            return decoded?.userId || "";
        } catch (error) {
            console.error("Failed to decode token", error);
            return "";
        }
    };

    const [warehouseForm, setWarehouseForm] = useState({
        name: "",
        adminId: getAdminId(),
    });

    useEffect(() => {
        document.title = "Distributor & Warehouse - Alurà System Management";
        fetchWarehouses();
        fetchDistributors();
    }, []);

    const fetchWarehouses = async () => {
        try {
            const res = await fetch(`${API_URL}/warehouse`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            const data = await res.json();

            if (Array.isArray(data.data)) {
                setWarehouses(data.data);
            } else {
                setWarehouses([]);
            }
        } catch (error) {
            console.error("Failed to fetch warehouses", error);
        }
    };


    const fetchDistributors = async () => {
        try {
            const res = await fetch(`${API_URL}/distributor`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setDistributors(data);
            }
        } catch (error) {
            console.error("Failed to fetch distributors", error);
        }
    };

    const fetchDistributorById = async (id) => {
        try {
            const res = await fetch(`${API_URL}/distributor/${id}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) {
                const data = await res.json();
                return data;
            } else {
                console.error("Failed to fetch distributor by id");
            }
        } catch (error) {
            console.error("Error fetching distributor by id", error);
        }
    };

    const handleSaveDistributor = async () => {
        if (!formData.name || !formData.phone || !formData.email || !formData.address) {
            alert("Please fill in all fields.");
            return;
        }

        const method = selectedDistributor ? "PUT" : "POST";
        const url = selectedDistributor
            ? `${API_URL}/distributor/${selectedDistributor._id}`
            : `${API_URL}/distributor`;

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const result = await res.json();
                if (selectedDistributor) {
                    setDistributors((prev) =>
                        prev.map((d) => (d._id === result._id ? result : d))
                    );
                    toast.success("Distributor updated successfully!");
                } else {
                    setDistributors((prev) => [...prev, result]);
                    toast.success("Distributor added successfully!");
                }
                closeDistributorModal();
            } else {
                toast.error("Failed to save distributor.");
            }
        } catch (error) {
            toast.error("Failed to save distributor.");
        }
    };

    const handleDeleteDistributor = async () => {
        if (!selectedDistributor) return;

        try {
            const res = await fetch(`${API_URL}/distributor/${selectedDistributor._id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` },
            });

            if (res.ok) {
                setDistributors((prev) =>
                    prev.filter((d) => d._id !== selectedDistributor._id)
                );
                toast.success("Distributor deleted successfully!");
                setIsDistributorDeleteModalOpen(false);
                setSelectedDistributor(null);
            } else {
                toast.error("Failed to delete distributor.");
            }
        } catch (error) {
            toast.error("Error deleting distributor.");
        }
    };

    const openAddDistributorModal = () => {
        setSelectedDistributor(null);
        setFormData({ name: "", phone: "", email: "", address: "" });
        setIsDistributorUpdateModalOpen(true);
    };

    const openEditDistributorModal = async (distributor) => {
        const freshData = await fetchDistributorById(distributor._id);
        if (freshData) {
            setSelectedDistributor(freshData);
            setFormData({
                name: freshData.name,
                phone: freshData.phone,
                email: freshData.email,
                address: freshData.address,
            });
            setIsDistributorUpdateModalOpen(true);
        }
    };

    const closeDistributorModal = () => {
        setIsDistributorUpdateModalOpen(false);
        setSelectedDistributor(null);
        setFormData({ name: "", phone: "", email: "", address: "" });
    };

    const handleSaveWarehouse = async () => {
        if (!warehouseForm.name) {
            toast.error("Please enter warehouse name.");
            return;
        }

        const isDuplicate = warehouses.some(
            (w) =>
                w.name.trim().toLowerCase() === warehouseForm.name.trim().toLowerCase() &&
                (!selectedWarehouse || w._id !== selectedWarehouse._id)
        );

        if (isDuplicate) {
            toast.error("Warehouse name already exists.");
            return;
        }

        const method = selectedWarehouse ? "PUT" : "POST";
        const endpoint = selectedWarehouse
            ? `${API_URL}/warehouse/${selectedWarehouse._id}`
            : `${API_URL}/warehouse`;

        try {
            const res = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(warehouseForm),
            });

            if (res.ok) {
                toast.success(
                    selectedWarehouse ? "Warehouse updated successfully!" : "Warehouse added successfully!"
                );
                fetchWarehouses();
                setIsWarehouseUpdateModalOpen(false);
                setSelectedWarehouse(null);
                setWarehouseForm({ name: "", adminId: getAdminId() });
            } else {
                toast.error("Failed to save warehouse.");
            }
        } catch (error) {
            toast.error("Error saving warehouse.");
        }
    };

    const handleDeleteWarehouse = async () => {
        if (!selectedWarehouse) return;

        try {
            const res = await fetch(`${API_URL}/warehouse/${selectedWarehouse._id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` },
            });

            if (res.ok) {
                toast.success("Warehouse deleted successfully!");
                fetchWarehouses();
                setIsWarehouseDeleteModalOpen(false);
                setSelectedWarehouse(null);
            } else {
                toast.error("Failed to delete warehouse.");
            }
        } catch (error) {
            toast.error("Error deleting warehouse.");
        }
    };

    const distributorColumns = ["Name", "Email", "Phone Number", "Address", "Action"];
    const distributorData = distributors.map((distributor) => ({
        name: distributor.name,
        phone_number: distributor.phone,
        email: distributor.email,
        address: distributor.address,
        action: (
            <div className="action_icons">
                <i
                    className="fas fa-pen edit_icon"
                    title="Edit Distributor"
                    onClick={() => openEditDistributorModal(distributor)}
                />
                <i
                    className="fas fa-trash delete_icon"
                    title="Delete Distributor"
                    onClick={() => {
                        setSelectedDistributor(distributor);
                        setIsDistributorDeleteModalOpen(true);
                    }}
                />
            </div>
        ),
    }));

    const warehouseColumns = ["Name", "Action"];
    const warehouseData = warehouses.map((warehouse) => ({
        name: warehouse.name,
        action: (
            <div className="action_icons">
                <i
                    className="fas fa-pen edit_icon"
                    title="Edit Warehouse"
                    onClick={() => {
                        setSelectedWarehouse(warehouse);
                        setWarehouseForm({
                            name: warehouse.name,
                            adminId: getAdminId(),
                        });
                        setIsWarehouseUpdateModalOpen(true);
                    }}
                />
                <i
                    className="fas fa-trash delete_icon"
                    title="Delete Warehouse"
                    onClick={() => {
                        setSelectedWarehouse(warehouse);
                        setIsWarehouseDeleteModalOpen(true);
                    }}
                />
            </div>
        ),
    }));

    return (
        <div className="WarehouseList">
            <div className="warehouse_list_container">
                <div className="warehouse_list_header">
                    <h2 className="admin_main_title">Manage Distributor</h2>
                    <button className="add_warehouse_btn" onClick={openAddDistributorModal}>
                        Add New Distributor
                    </button>
                </div>
                <Table columns={distributorColumns} data={distributorData} />

                <div className="warehouse_list_header" style={{ marginTop: "40px" }}>
                    <h2 className="admin_main_title">Manage Warehouse</h2>
                    <button
                        className="add_warehouse_btn"
                        onClick={() => {
                            setSelectedWarehouse(null);
                            setWarehouseForm({ name: "", adminId: getAdminId() });
                            setIsWarehouseUpdateModalOpen(true);
                        }}
                    >
                        Add New Warehouse
                    </button>

                </div>
                <Table columns={warehouseColumns} data={warehouseData} />
            </div>

            {isDistributorUpdateModalOpen && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <button className="close_modal_btn" onClick={closeDistributorModal}>×</button>
                        <h5>{selectedDistributor ? "Update Distributor" : "Add New Distributor"}</h5>
                        <form
                            className="product_form"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (!formData.name || !formData.phone || !formData.email || !formData.address) {
                                    alert("Please fill in all fields.");
                                    return;
                                }
                                handleSaveDistributor();
                            }}
                        >
                            <div className="form_group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form_group">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form_group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form_group">
                                <label>Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form_group">
                                <button type="submit" className="add_account_btn">
                                    {selectedDistributor ? "Update" : "Create"} Distributor
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDistributorDeleteModalOpen && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <button className="close_modal_btn" onClick={() => setIsDistributorDeleteModalOpen(false)}>×</button>
                        <h5>Are you sure you want to delete <b>{selectedDistributor?.name}</b>?</h5>
                        <div className="modal-buttons">
                            <button className="cancel_btn" onClick={() => setIsDistributorDeleteModalOpen(false)}>Cancel</button>
                            <button className="delete_btn" onClick={handleDeleteDistributor}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}

            {isWarehouseUpdateModalOpen && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <button className="close_modal_btn" onClick={() => setIsWarehouseUpdateModalOpen(false)}>
                            ×
                        </button>
                        <h5>{selectedWarehouse ? "Update Warehouse" : "Add New Warehouse"}</h5>
                        <form
                            className="product_form"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSaveWarehouse();
                            }}
                        >
                            <div className="form_group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={warehouseForm.name}
                                    onChange={(e) =>
                                        setWarehouseForm((prev) => ({ ...prev, name: e.target.value }))
                                    }
                                    required
                                />
                            </div>
                            <div className="form_group">
                                <label>Admin ID (Auto fill)</label>
                                <input
                                    type="text"
                                    name="adminId"
                                    value={warehouseForm.adminId}
                                    disabled
                                />
                            </div>
                            <div className="form_group">
                                <button type="submit" className="add_account_btn">
                                    {selectedWarehouse ? "Update" : "Create"} Warehouse
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isWarehouseDeleteModalOpen && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <button className="close_modal_btn" onClick={() => setIsWarehouseDeleteModalOpen(false)}>
                            ×
                        </button>
                        <h5>Are you sure you want to delete <b>{selectedWarehouse?.name}</b>?</h5>
                        <div className="modal-buttons">
                            <button className="cancel_btn" onClick={() => setIsWarehouseDeleteModalOpen(false)}>Cancel</button>
                            <button className="delete_btn" onClick={handleDeleteWarehouse}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WarehouseList;
