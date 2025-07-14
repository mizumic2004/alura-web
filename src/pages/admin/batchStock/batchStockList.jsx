import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Table from '../../../components/Table/table/Table';
import '../../../styles/admin/batchStock/BatchStockList.css';
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

function BatchStockList({ searchQuery = "" }) {
  const { token } = useSelector((state) => state.auth);
  const decoded = token ? jwtDecode(token) : {};

  const userId = decoded?.UserId || decoded?.userId || decoded?.id || '';

  const [isLoading, setIsLoading] = useState(false);
  const [batchStocks, setBatchStocks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  const [batches, setBatches] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [formData, setFormData] = useState({
    batchId: '',
    productId: '',
    warehouseId: '',
    quantity: '',
    remaining: '',
    note: '',
    handledBy: userId || ''
  });


  useEffect(() => {
    if (userId) {
      setFormData(prev => ({ ...prev, handledBy: userId }));
    }
  }, [userId]);

  useEffect(() => {
    document.title = "Manage Batch Stock - Alurà System Management";
    fetchBatchStocks();
    fetchDropdownData();
  }, []);

  const fetchBatchStocks = async () => {
    setIsLoading(true);
    try {
      const url = searchQuery
        ? `${API_URL}/batch-stock?batchId=${encodeURIComponent(searchQuery)}`
        : `${API_URL}/batch-stock`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setBatchStocks(json.data);
      } else {
        setBatchStocks([]);
      }
    } catch (error) {
      console.error("Failed to fetch batch stocks", error);
      toast.error("Failed to load batch stock data.");
    }
    setIsLoading(false);
  };

  const fetchDropdownData = async () => {
    try {
      const [batchRes, productRes, warehouseRes] = await Promise.all([
        fetch(`${API_URL}/batch`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/products`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/warehouse`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const batchJson = await batchRes.json();
      if (batchJson.success && Array.isArray(batchJson.data)) {
        setBatches(batchJson.data);
      }

      const productJson = await productRes.json();
      if (productJson.success && Array.isArray(productJson.products)) {
        setProducts(productJson.products);
      }

      const warehouseJson = await warehouseRes.json();
      if (warehouseJson.data && Array.isArray(warehouseJson.data)) {
        setWarehouses(warehouseJson.data);
      }
    } catch (error) {
      console.error("Failed to fetch dropdown data", error);
      toast.error("Failed to load dropdown data.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateBatchStock = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      let payload;

      if (selectedStock) {
        payload = {
          quantity: parseInt(formData.quantity),
          remaining: parseInt(formData.remaining || 0)
        };
      } else {
        payload = {
          ...formData,
          quantity: parseInt(formData.quantity),
          handledBy: userId
        };
      }


      const url = selectedStock
        ? `${API_URL}/batch-stock/${selectedStock._id}`
        : `${API_URL}/batch-stock`;

      const method = selectedStock ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(`${selectedStock ? 'Update' : 'Add'} batch stock successfully!`);
        fetchBatchStocks();
        setShowCreateModal(false);
        resetForm();
      } else {
        const errorData = await res.json();
        toast.error(`Lỗi: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Failed to create/update batch stock", error);
      toast.error("Failed to create/update batch stock!");
    }
    setIsCreating(false);
  };

  const handleEdit = (stock) => {
    setSelectedStock(stock);
    setFormData({
      batchId: stock.batchId?._id || "",
      productId: stock.productId?._id || "",
      warehouseId: stock.warehouseId?._id || "",
      quantity: stock.quantity || "",
      note: stock.note || "",
      handledBy: userId
    });
    setShowCreateModal(true);
  };

  const handleDelete = async () => {
    if (!selectedStock) return;

    try {
      const res = await fetch(`${API_URL}/batch-stock/${selectedStock._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success("Delete batch stock successfully!");
        fetchBatchStocks();
        setIsDeleteModalOpen(false);
        setSelectedStock(null);
      } else {
        toast.error("Can not delete batch stock!");
      }
    } catch (error) {
      console.error("Error deleting batch stock:", error);
      toast.error("Error deleting batch stock!");
    }
  };

  const resetForm = () => {
    setFormData({
      batchId: '',
      productId: '',
      warehouseId: '',
      quantity: '',
      note: '',
      handledBy: userId
    });
    setSelectedStock(null);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    resetForm();
  };

  const columns = [
    { header: "Batch Code", accessor: "batchCode" },
    { header: "Product Name", accessor: "productName" },
    { header: "Warehouse", accessor: "warehouse" },
    { header: "Quantity", accessor: "quantity" },
    { header: "Remaining In Store", accessor: "remaining" },
    { header: "Expiry Date", accessor: "expiryDate" },
    { header: "Exported At", accessor: "exportedAt" },
    { header: "Note", accessor: "note" },
    // { header: "Status", accessor: "status" },
    { header: "Action", accessor: "action" }
  ];

  const tableData = batchStocks.map(stock => ({
    batchCode: stock.batchId?.batchCode || "-",
    productName: stock.productId?.name || "-",
    warehouse: stock.warehouseId?.name || "-",
    quantity: stock.quantity ?? "-",
    remaining: stock.remaining ?? "-",
    expiryDate: stock.batchId?.expiryDate
      ? new Date(stock.batchId.expiryDate).toLocaleDateString('vi-VN')
      : "-",
    exportedAt: stock.exportedAt
      ? new Date(stock.exportedAt).toLocaleDateString('vi-VN')
      : "-",

    note: stock.note || "-",
    status: (
      <span
        className={`status_tag ${stock.lockedReason ? 'status_cancelled' : 'status_active'}`}
      >
        {stock.lockedReason ? "Cancelled" : "Active"}
      </span>
    ),
    action: (
      <div className="action_icons">
        <i className="fas fa-pen edit_icon" onClick={() => handleEdit(stock)} />
        <i className="fas fa-trash delete_icon" onClick={() => {
          setSelectedStock(stock);
          setIsDeleteModalOpen(true);
        }} />
      </div>
    )
  }));

  return (
    <div className="BatchStockList">
      <div className="batch_stock_list_container">
        <div className="batch_stock_list_header">
          <h2 className="admin_main_title">Manage Batch Stock</h2>
          <button
            className="add_warehouse_btn"
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
          >
            Add New Batch Stock
          </button>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table columns={columns} data={tableData} />
        )}

        {showCreateModal && !selectedStock && (
          <div className="modal_overlay">
            <div className="modal_content">
              <button className="close_modal_btn" onClick={handleCloseModal}>×</button>
              <h5>Add New Batch Stock</h5>
              <form className="product_form" onSubmit={handleCreateBatchStock}>
                <div className="form_group">
                  <label htmlFor="batchId">Batch *</label>
                  <select
                    id="batchId"
                    name="batchId"
                    value={formData.batchId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Choose batch</option>
                    {batches.map(batch => (
                      <option key={batch._id} value={batch._id}>
                        {batch.batchCode} - {batch.productId?.name || "N/A"} (Còn: {batch.quantity})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form_group">
                  <label htmlFor="productId">Product *</label>
                  <select
                    id="productId"
                    name="productId"
                    value={formData.productId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Choose product</option>
                    {products.map(product => (
                      <option key={product._id} value={product._id}>
                        {product.name} - {product.price?.toLocaleString()} VND
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form_group">
                  <label htmlFor="warehouseId">Warehouse *</label>
                  <select
                    id="warehouseId"
                    name="warehouseId"
                    value={formData.warehouseId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Choose warehouse</option>
                    {warehouses.map(warehouse => (
                      <option key={warehouse._id} value={warehouse._id}>
                        {warehouse.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form_group">
                  <label htmlFor="quantity">Quantity *</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>

                <div className="form_group">
                  <label htmlFor="note">Note</label>
                  <textarea
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>

                <div className="form_group">
                  <label htmlFor="handledBy">Admin ID (Auto fill)</label>
                  <input
                    type="text"
                    id="handledBy"
                    name="handledBy"
                    value={formData.handledBy}
                    disabled
                  />
                </div>

                <div className="form_group">
                  <button type="submit" className="add_account_btn" disabled={isCreating}>
                    {isCreating ? 'Đang lưu...' : 'Add Batch Stock'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showCreateModal && selectedStock && (
          <div className="modal_overlay">
            <div className="modal_content">
              <button className="close_modal_btn" onClick={handleCloseModal}>×</button>
              <h5>Update Batch Stock</h5>
              <form className="product_form" onSubmit={handleCreateBatchStock}>

                <div className="form_group">
                  <label htmlFor="quantity">Quantity *</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>

                <div className="form_group">
                  <label htmlFor="remaining">Remaining *</label>
                  <input
                    type="number"
                    id="remaining"
                    name="remaining"
                    value={formData.remaining}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>

                <div className="form_group">
                  <label htmlFor="handledBy">Admin ID (Auto fill)</label>
                  <input
                    type="text"
                    id="handledBy"
                    name="handledBy"
                    value={formData.handledBy}
                    disabled
                  />
                </div>

                <div className="form_group">
                  <button type="submit" className="add_account_btn" disabled={isCreating}>
                    {isCreating ? 'Đang lưu...' : 'Update Batch Stock'}
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
              <h5>
                Are you sure you want to delete {" "}
                <strong>{selectedStock?.batchId?.batchCode}</strong>?
              </h5>
              <div className="modal-buttons">
                <button className="cancel_btn" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                <button className="delete_btn" onClick={handleDelete}>Confirm</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BatchStockList;
