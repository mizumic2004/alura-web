import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./../../styles/visual/VisualSearch.css";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";

const VisualSearch = () => {
  const breadcrumbItems = [
    { name: "Home", link: "/" },
    { name: "Visual Search", link: "/visual_search" },
  ];

  useEffect(() => {
    document.title = "Alurà - Visual Search";
  }, []);

  const [imagePreview, setImagePreview] = useState(null);
  // const [imageLink, setImageLink] = useState("");
  // const [showImageButton, setShowImageButton] = useState(false);
  const navigate = useNavigate();

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        alert("Only PNG, JPG, and JPEG files are allowed.");
        return;
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        alert("Only PNG, JPG, and JPEG files are allowed.");
        return;
      }
      setImagePreview(URL.createObjectURL(file));
      // setImageLink("");
      // setShowImageButton(false);
    }
  };

  // const handleLinkInputChange = (e) => {
  //   setImageLink(e.target.value);
  //   setShowImageButton(true);
  // };

  // const handleShowImage = () => {
  //   setImagePreview(imageLink);
  //   setShowImageButton(false);
  // };

  const handleSearch = async () => {
    if (!imagePreview) {
      alert("Please upload an image or paste a link.");
      return;
    }

    const formData = new FormData();
    let imgToSearch = null;

    // Lấy phần tử input file, luôn tồn tại trong DOM
    const fileInput = document.getElementById("imageUpload");
    if (!fileInput) {
      console.error("File input element not found!");
      alert("An error occurred. Please reload the page.");
      return;
    }

    if (imagePreview.startsWith("blob:")) {
      // Trường hợp upload file
      imgToSearch = fileInput.files[0];
      if (!imgToSearch) {
        alert("No file selected. Please upload an image.");
        return;
      }
    } else {
      // Trường hợp từ link
      try {
        const response = await fetch(imagePreview);
        if (!response.ok) throw new Error("Failed to fetch image");
        const blob = await response.blob();
        imgToSearch = new File([blob], "image.jpg, image.png, image.jpeg", {
          type: blob.type,
        });
      } catch (error) {
        console.error("Error fetching image from link:", error);
        alert(
          "Invalid image link. We only accept png, jpg and jpeg, please try another image."
        );
        return;
      }
    }

    formData.append("imgUrls", imgToSearch);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products/find-by-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      console.log("Response status:", response.status);
      if (response.ok) {
        const data = await response.json();
        navigate("/visual-search-result", {
          state: {
            products: data.products || [],
            image: imagePreview,
          },
        });
        console.log("Search results:", data.products);
      } else {
        const errorData = await response.json();
        alert(
          `Error searching for products: ${
            errorData.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error during search:", error);
      alert("An error occurred while searching. Please try again.");
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    // setImageLink("");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="visual_search">
      <Breadcrumb items={breadcrumbItems} />

      <h2 className="visual_title">Visual Search</h2>
      <p className="visual_desc">
        Not sure how to describe in words? Use a photo to find information.
      </p>

      <div className="visual_search_container">
        <h2>Search for any products with image</h2>

        <div
          className="visual_drop_area"
          onDrop={handleDrop}
          onDragOver={handleDragOver}>
          {imagePreview ? (
            <div className="image_preview_container">
              <button
                className="remove_image_button"
                onClick={handleRemoveImage}>
                ×
              </button>
              <img src={imagePreview} alt="Preview" className="image_preview" />
            </div>
          ) : (
            <div className="upload_placeholder">
              <i className="fas fa-image upload_icon"></i>
              <p>
                Drag an image here or{" "}
                <label htmlFor="imageUpload">upload a file</label>
              </p>
            </div>
          )}
          {/* Di chuyển input ra ngoài điều kiện để luôn tồn tại trong DOM */}
          <input
            type="file"
            id="imageUpload"
            accept=".png,.jpg,.jpeg,image/png,image/jpeg,image/jpg"
            onChange={handleImageChange}
            hidden
          />
        </div>

        {/* <div className="divider">
          <span className="line"></span>
          <span className="or-text">OR</span>
          <span className="line"></span>
        </div>

        <div className="link_input_area">
          <input
            type="text"
            placeholder="Paste image link"
            value={imageLink}
            onChange={handleLinkInputChange}
          />
          <button onClick={handleShowImage} disabled={!showImageButton}>
            Preview
          </button>
        </div> */}

        {imagePreview && (
          <button className="search_button" onClick={handleSearch}>
            Search for matching products
          </button>
        )}
      </div>
      <br />
      <br />
      <br />
    </div>
  );
};

export default VisualSearch;
