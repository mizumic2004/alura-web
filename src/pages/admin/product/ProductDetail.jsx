import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../styles/admin/product/ProductDetail.css";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [b, c, t] = await Promise.all([
          fetch(`${API_URL}/brands`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }),
          fetch(`${API_URL}/categories`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }),
          fetch(`${API_URL}/product-types`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }),
        ]);

        if (!b.ok || !c.ok || !t.ok) {
          throw new Error("Failed to fetch options");
        }

        const bd = await b.json();
        const cd = await c.json();
        const td = await t.json();

        setBrands(bd.data);
        setCategories(cd);
        setProductTypes(td);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load options");
      }
    };

    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/products/admin-and-staff/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setProduct(data.product);
          setExistingImages(data.product.imgUrls || []);
        } else {
          toast.error(data.message || "Failed to load product.");
        }
      } catch (e) {
        console.error("Fetch product failed:", e);
        toast.error("Error fetching product.");
      }
    };

    fetchOptions();
    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const total = existingImages.length + newImages.length + files.length;
    if (total > 5) {
      toast.error("Maximum 5 images allowed.");
      return;
    }
    setNewImages((prev) => [...prev, ...files]);
  };

  const removeExistingImage = (idx) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeNewImage = (idx) => {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const getIdValue = (field, value) => {
    if (value && typeof value === "object" && value._id) {
      return value._id;
    }

    if (typeof value === "string" && /^[0-9a-fA-F]{24}$/.test(value)) {
      return value;
    }

    if (typeof value === "string" && value.length > 0) {
      if (field === "brand") {
        const brand = brands.find(
          (b) => b.brandName === value || b._id === value || b.id === value
        );
        return brand?._id || brand?.id || "";
      }
      if (field === "categoryId") {
        const category = categories.find(
          (c) => c.name === value || c._id === value
        );
        return category?._id || "";
      }
      if (field === "productTypeId") {
        const productType = productTypes.find(
          (t) => t.name === value || t._id === value
        );
        return productType?._id || "";
      }
    }

    return "";
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      const fieldsToSend = {
        name: product.name || "",
        price: product.price || "",
        brand: getIdValue("brand", product.brand),
        sex: product.sex || "",
        skinType: product.skinType || "",
        skinColor: product.skinColor || "",
        volume: product.volume || "",
        instructions: product.instructions || "",
        preservation: product.preservation || "",
        keyIngredients: product.keyIngredients || "",
        detailInfredients: product.detailInfredients || "",
        purpose: product.purpose || "",
        categoryId: getIdValue("categoryId", product.categoryId),
        productTypeId: getIdValue("productTypeId", product.productTypeId),
        stock: product.stock || "",
      };

      const objectIdFields = ["brand", "categoryId", "productTypeId"];
      for (const field of objectIdFields) {
        const value = fieldsToSend[field];
        if (value && value !== "" && !/^[0-9a-fA-F]{24}$/.test(value)) {
          toast.error(
            `Invalid ${field} selected. Please select a valid option.`
          );
          return;
        }
      }

      Object.entries(fieldsToSend).forEach(([key, value]) => {
        formData.append(key, value || "");
      });

      if (existingImages.length > 0) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }

      for (const file of newImages) {
        if (file instanceof File) {
          const fileType = file.type;
          if (!["image/png", "image/jpg", "image/jpeg"].includes(fileType)) {
            toast.error("Images must be png, jpg or jpeg.");
            return;
          }
          formData.append("imgUrls", file);
        }
      }

      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Product updated successfully.");
        setProduct(data.product);
        setExistingImages(data.product.imgUrls || []);
        setNewImages([]);
        setIsEditing(false);
      } else {
        toast.error(data.error || data.message || "Update failed.");
      }
    } catch (e) {
      console.error("Update error:", e);
      toast.error("Error updating product.");
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        toast.success("Product deleted successfully.");
        navigate("/admin/product-list");
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to delete product.");
      }
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("An error occurred while deleting the product.");
    }
  };

  const getFieldValue = (field) => {
    if (field === "brand") {
      return typeof product.brand === "object" && product.brand?._id
        ? product.brand._id
        : typeof product.brand === "string"
          ? product.brand
          : "";
    }

    if (field === "categoryId") {
      return typeof product.categoryId === "object" && product.categoryId?._id
        ? product.categoryId._id
        : typeof product.categoryId === "string"
          ? product.categoryId
          : "";
    }

    if (field === "productTypeId") {
      return typeof product.productTypeId === "object" &&
        product.productTypeId?._id
        ? product.productTypeId._id
        : typeof product.productTypeId === "string"
          ? product.productTypeId
          : "";
    }

    return product[field] || "";
  };

  const getDisplayValue = (field) => {
    if (field === "brand") {
      return product.brand?.brandName || "";
    }
    if (field === "categoryId") {
      return product.categoryId?.name || "";
    }
    if (field === "productTypeId") {
      return product.productTypeId?.name || "";
    }
    return product[field] || "";
  };

  if (!product) return <p>Loading...</p>;

  const formFields = [
    { label: "Name", value: "name" },
    { label: "Price", value: "price" },
    {
      label: "Brand",
      value: "brand",
      isSelect: true,
      options: brands.map((b) => ({ key: b.id, label: b.brandName })),
    },
    {
      label: "Sex",
      value: "sex",
      isSelect: true,
      options: ["male", "female", "unisex"].map((v) => ({
        key: v,
        label: v.charAt(0).toUpperCase() + v.slice(1),
      })),
    },
    {
      label: "Skin Type",
      value: "skinType",
      isSelect: true,
      options: ["oily", "sensitive", "combination", "normal"].map((k) => ({
        key: k,
        label: k.charAt(0).toUpperCase() + k.slice(1),
      })),
    },
    {
      label: "Skin Color",
      value: "skinColor",
      isSelect: true,
      options: ["neutral", "cool"].map((k) => ({
        key: k,
        label: k.charAt(0).toUpperCase() + k.slice(1),
      })),
    },
    { label: "Stock", value: "stock" },
    { label: "Volume", value: "volume" },
    {
      label: "Category",
      value: "categoryId",
      isSelect: true,
      options: categories.map((c) => ({ key: c._id, label: c.name })),
    },
    {
      label: "Product Type",
      value: "productTypeId",
      isSelect: true,
      options: productTypes.map((t) => ({ key: t._id, label: t.name })),
    },
    { label: "Instructions", value: "instructions", isText: true },
    { label: "Preservation", value: "preservation", isText: true },
    { label: "Key Ingredients", value: "keyIngredients", isText: true },
    {
      label: "Detail Ingredients",
      value: "detailInfredients",
      isText: true,
    },
    { label: "Purpose", value: "purpose", isText: true },
  ];

  return (
    <div>
      <div className="product-detail-container-back">
        <div
          className="admin_back"
          onClick={() => navigate("/admin/product-list")}>
          &lt; Back
        </div>
      </div>

      <div className="product-detail-container">
        <div className="product-detail-header">
          <h2 className="admin_main_title">{product.name}</h2>
          <div className="product-detail-controls">
            <i
              className="fas fa-pen"
              title="Edit"
              onClick={() => setIsEditing(true)}></i>
            <i
              className="delete_icon fas fa-trash-alt"
              title="Delete"
              onClick={() => setShowDeleteModal(true)}></i>
          </div>
        </div>

        <div className="product-images-carousel">
          {existingImages.map((img, idx) => (
            <div className="image-wrapper" key={idx}>
              <img src={img} alt={`existing-${idx}`} />
              {isEditing && (
                <span
                  className="remove-btn"
                  onClick={() => removeExistingImage(idx)}>
                  ×
                </span>
              )}
            </div>
          ))}
          {newImages.map((file, idx) => (
            <div className="image-wrapper" key={`new-${idx}`}>
              <img src={URL.createObjectURL(file)} alt="new" />
              {isEditing && (
                <span
                  className="remove-btn"
                  onClick={() => removeNewImage(idx)}>
                  ×
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="product-detail-grid">
          {formFields.map(
            ({ label, value, isSelect, isText, options = [] }) => (
              <div className="product-detail-field" key={value}>
                <label>{label}</label>
                {isEditing ? (
                  isSelect ? (
                    <select
                      name={value}
                      value={getFieldValue(value)}
                      onChange={handleInputChange}>
                      <option value="">Select {label}</option>
                      {options.map(({ key, label }) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  ) : isText ? (
                    <textarea
                      name={value}
                      value={getFieldValue(value)}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <input
                      type="text"
                      name={value}
                      value={getFieldValue(value)}
                      onChange={handleInputChange}
                    />
                  )
                ) : (
                  <input type="text" readOnly value={getDisplayValue(value)} />
                )}
              </div>
            )
          )}
        </div>

        {isEditing && (
          <>
            <div className="form_group form_group_image">
              <label>Upload Images (max 5): </label>
              <input
                type="file"
                name="imgUrls"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
              />
            </div>
            <div className="product-detail-actions">
              <button onClick={() => setIsEditing(false)}>Cancel</button>
              <button onClick={handleUpdate}>Save</button>
            </div>
          </>
        )}

        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button
                className="close_modal_btn"
                onClick={() => setShowDeleteModal(false)}>
                ×
              </button>
              <h5>Are you sure you want to delete this product?</h5>
              <div className="modal-buttons">
                <button onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button onClick={handleDelete}>Confirm</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
