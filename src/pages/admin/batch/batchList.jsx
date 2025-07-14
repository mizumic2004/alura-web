import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import Table from "../../../components/Table/Table";
import "../../../styles/admin/batch/BatchList.css";

const API_URL = import.meta.env.VITE_API_URL;

function BatchList() {
  const { token } = useSelector((state) => state.auth);
  const [batches, setBatches] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const [formData, setFormData] = useState({
    batchCode: "",
    productId: "",
    distributorId: "",
    warehouseId: "",
    certificateId: "",
    brandId: "",
    imageUrl: "",
    quantity: "",
    amount: "",
    expiryDate: "",
    importDate: "",
    notes: "",
  });

  useEffect(() => {
    document.title = "Manage Batch - Alurà System Management";
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const res = await fetch(API_URL + "/batch", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setBatches(json.data);
      } else {
        setBatches([]);
      }
    } catch (error) {
      console.error("Failed to fetch batches:", error);
    }
  };

  const openAddModal = () => {
    setSelectedBatch(null);
    setFormData({
      batchCode: "",
      productId: "",
      distributorId: "",
      warehouseId: "",
      certificateId: "",
      brandId: "",
      imageUrl: "",
      quantity: "",
      amount: "",
      expiryDate: "",
      importDate: "",
      notes: "",
    });
    setIsUpdateModalOpen(true);
  };

  const openEditModal = (batch) => {
    setSelectedBatch(batch);
    setFormData({
      batchCode: batch.batchCode,
      productId: batch.productId?._id || "",
      distributorId: batch.distributorId?._id || "",
      warehouseId: batch.warehouseId?._id || "",
      certificateId: batch.certificateId || "",
      brandId: batch.brandId || "",
      imageUrl: batch.imageUrl || "",
      quantity: batch.quantity,
      amount: batch.amount,
      expiryDate: batch.expiryDate?.slice(0, 10) || "",
      importDate: batch.importDate?.slice(0, 10) || "",
      notes: batch.notes || "",
    });
    setIsUpdateModalOpen(true);
  };

  const handleSaveBatch = async () => {
    const method = selectedBatch ? "PUT" : "POST";
    const endpoint = selectedBatch
      ? `${API_URL}/batch/${selectedBatch._id}`
      : `${API_URL}/batch`;

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(`Batch ${selectedBatch ? "updated" : "added"} successfully!`);
        fetchBatches();
        closeModal();
      } else {
        toast.error("Failed to save batch.");
      }
    } catch (error) {
      toast.error("Error saving batch.");
    }
  };

  const handleDeleteBatch = async () => {
    if (!selectedBatch) return;
    try {
      const res = await fetch(`${API_URL}/batch/${selectedBatch._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        toast.success("Batch deleted successfully!");
        setBatches(batches.filter((b) => b._id !== selectedBatch._id));
        closeModal();
      } else {
        toast.error("Batch already deleted.");
      }
    } catch (error) {
      toast.error("Error deleting batch.");
    }
  };

  const closeModal = () => {
    setIsUpdateModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedBatch(null);
  };

  const columns = [
    "Batch Code",
    "Warehouse",
    "Distributor",
    "Amount",
    "Expiry Date",
    "Import Date",
    "Note",
    "Status",
    "Action",
  ];

  const filteredData = batches
    .filter((b) =>
      b.batchCode.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((b) => ({
      batch_code: b.batchCode,
      warehouse: b.warehouseId?.name || "-",
      distributor: b.distributorId?.name || "-",
      amount: b.amount?.toLocaleString() || "",
      expiry_date: b.expiryDate
        ? new Date(b.expiryDate).toLocaleDateString("vi-VN")
        : "",
      import_date: b.importDate
        ? new Date(b.importDate).toLocaleDateString("vi-VN")
        : "",
      note: b.notes || "",
      status: (
        <span
          className={`status_tag ${b.lockedReason ? "status_cancelled" : "status_active"
            }`}
        >
          {b.lockedReason ? "Cancelled" : "Active"}
        </span>
      ),
      action: (
        <div className="action_icons" key={b._id}>
          <i className="fas fa-pen edit_icon" onClick={() => openEditModal(b)} />
          <i
            className="fas fa-trash delete_icon"
            onClick={() => {
              setSelectedBatch(b);
              setIsDeleteModalOpen(true);
            }}
          />
        </div>
      ),
    }));

  return (
    <div className="WarehouseList">
      <div className="warehouse_list_container">
        <div className="warehouse_list_header">
          <h2 className="admin_main_title">Manage Batch</h2>
          <div className="right_controls">
            <button className="add_warehouse_btn" onClick={openAddModal}>
              Add New Batch
            </button>
          </div>
        </div>
        <Table columns={columns} data={filteredData} />
      </div>

      {isUpdateModalOpen && (
        <div className="modal_overlay">
          <div className="modal_content">
            <button className="close_modal_btn" onClick={closeModal}>×</button>
            <h5>{selectedBatch ? "Update Batch" : "Add New Batch"}</h5>
            <form
              className="product_form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveBatch();
              }}
            >
              {!selectedBatch && (
                <div className="form_group">
                  <label>Batch Code</label>
                  <input
                    type="text"
                    value={formData.batchCode}
                    onChange={(e) =>
                      setFormData({ ...formData, batchCode: e.target.value })
                    }
                    required
                  />
                </div>
              )}
              {["quantity", "amount", "importDate", "expiryDate"].map((field) => (
                <div className="form_group" key={field}>
                  <label>
                    {field === "amount"
                      ? "Amount (VND)"
                      : field === "importDate"
                        ? "Import Date"
                        : field === "expiryDate"
                          ? "Expiry Date"
                          : "Quantity"}
                  </label>
                  <input
                    type={field.includes("Date") ? "date" : "number"}
                    value={formData[field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    required={field !== "quantity"}
                  />
                </div>
              ))}
              <div className="form_group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>
              <button type="submit" className="add_account_btn">
                {selectedBatch ? "Update" : "Create"} Batch
              </button>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="modal_overlay">
          <div className="modal_content">
            <button className="close_modal_btn" onClick={closeModal}>×</button>
            <h5>
              Are you sure you want to delete <b>{selectedBatch?.batchCode}</b>?
            </h5>
            <div className="modal-buttons">
              <button className="cancel_btn" onClick={closeModal}>Cancel</button>
              <button className="delete_btn" onClick={handleDeleteBatch}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BatchList;
