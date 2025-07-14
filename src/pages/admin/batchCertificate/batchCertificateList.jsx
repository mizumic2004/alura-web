import { useEffect, useState } from "react";
import Table from "../../../components/Table/Table";
import "../../../styles/admin/warehouse/WarehouseList.css";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

function BatchCertificateList() {
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [certificates, setCertificates] = useState([]);

    const [formData, setFormData] = useState({
        certificateCode: "",
        issueDate: "",
        issuedBy: "",
        fileUrl: "",
        note: ""
    });

    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        document.title = "Manage Batch Certificate - Alurà System Management";
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const res = await fetch(`${API_URL}/batch-certificate`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                setCertificates(data.data);
            } else {
                setCertificates([]);
            }
        } catch (error) {
            console.error("Failed to fetch batch certificates", error);
        }
    };


    const handleSaveCertificate = async () => {
        const { certificateCode, issueDate, issuedBy, fileUrl } = formData;
        if (!certificateCode || !issueDate || !issuedBy || !fileUrl) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const method = selectedCertificate ? "PUT" : "POST";
        const endpoint = selectedCertificate
            ? `${API_URL}/batch-certificate/${selectedCertificate._id}`
            : `${API_URL}/batch-certificate`;

        try {
            const res = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const updated = await res.json();
                toast.success(`Certificate ${selectedCertificate ? "updated" : "added"} successfully!`);
                setCertificates((prev) =>
                    selectedCertificate
                        ? prev.map((c) => (c._id === updated._id ? updated : c))
                        : [...prev, updated]
                );
                closeModal();
            } else {
                toast.error("Failed to save certificate.");
            }
        } catch (error) {
            toast.error("Error saving certificate.");
        }
    };

    const handleDeleteCertificate = async () => {
        if (!selectedCertificate) return;

        try {
            const res = await fetch(`${API_URL}/batch-certificate/${selectedCertificate._id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });

            if (res.ok) {
                setCertificates((prev) =>
                    prev.filter((c) => c._id !== selectedCertificate._id)
                );
                toast.success("Certificate deleted successfully!");
                setIsDeleteModalOpen(false);
                setSelectedCertificate(null);
            } else {
                toast.error("Failed to delete certificate.");
            }
        } catch (error) {
            toast.error("Error deleting certificate.");
        }
    };

    const openAddModal = () => {
        setSelectedCertificate(null);
        setFormData({
            certificateCode: "",
            issueDate: "",
            issuedBy: "",
            fileUrl: "",
            note: ""
        });
        setIsUpdateModalOpen(true);
    };

    const openEditModal = (certificate) => {
        setSelectedCertificate(certificate);
        setFormData({
            certificateCode: certificate.certificateCode,
            issueDate: certificate.issueDate?.split("T")[0] || "",
            issuedBy: certificate.issuedBy,
            fileUrl: certificate.fileUrl,
            note: certificate.note || ""
        });
        setIsUpdateModalOpen(true);
    };

    const closeModal = () => {
        setIsUpdateModalOpen(false);
        setSelectedCertificate(null);
        setFormData({
            certificateCode: "",
            issueDate: "",
            issuedBy: "",
            fileUrl: "",
            note: ""
        });
    };

    const columns = [
        "Certificate Code",
        "Issue Date",
        "Issued By",
        "File",
        "Note",
        "Action",
    ];

    const data = certificates.map((c) => ({
        certificate_code: c.certificateCode,
        issue_date: c.issueDate
            ? new Date(c.issueDate).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            })
            : "N/A",
        issued_by: c.issuedBy,
        file: (
            <a href={c.fileUrl} target="_blank" rel="noreferrer">
                View File
            </a>
        ),
        note: c.note,
        action: (
            <div className="action_icons" key={c._id}>
                <i className="fas fa-pen edit_icon" onClick={() => openEditModal(c)} />
                <i className="fas fa-trash delete_icon" onClick={() => {
                    setSelectedCertificate(c);
                    setIsDeleteModalOpen(true);
                }} />
            </div>
        )
    }));

    return (
        <div className="WarehouseList">
            <div className="warehouse_list_container">
                <div className="warehouse_list_header">
                    <h2 className="admin_main_title">Manage Batch Certificate</h2>
                    <button className="add_warehouse_btn" onClick={openAddModal}>
                        Add New Certificate
                    </button>
                </div>
                <Table columns={columns} data={data} />
            </div>

            {isUpdateModalOpen && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <button className="close_modal_btn" onClick={closeModal}>×</button>
                        <h5>{selectedCertificate ? "Update Certificate" : "Add New Certificate"}</h5>
                        <form
                            className="product_form"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSaveCertificate();
                            }}
                        >
                            <div className="form_group">
                                <label>Certificate Code</label>
                                <input
                                    type="text"
                                    value={formData.certificateCode}
                                    onChange={(e) => setFormData({ ...formData, certificateCode: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form_group">
                                <label>Issue Date</label>
                                <input
                                    type="date"
                                    value={formData.issueDate}
                                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form_group">
                                <label>Issued By</label>
                                <input
                                    type="text"
                                    value={formData.issuedBy}
                                    onChange={(e) => setFormData({ ...formData, issuedBy: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form_group">
                                <label>File URL</label>
                                <input
                                    type="text"
                                    value={formData.fileUrl}
                                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form_group">
                                <label>Note</label>
                                <input
                                    type="text"
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                />
                            </div>
                            <div className="form_group">
                                <button type="submit" className="add_account_btn">
                                    {selectedCertificate ? "Update" : "Create"} Certificate
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <button className="close_modal_btn" onClick={() => setIsDeleteModalOpen(false)}>×</button>
                        <h5>Are you sure you want to delete <b>{selectedCertificate?.certificateCode}</b>?</h5>
                        <div className="modal-buttons">
                            <button className="cancel_btn" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                            <button className="delete_btn" onClick={handleDeleteCertificate}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BatchCertificateList;
