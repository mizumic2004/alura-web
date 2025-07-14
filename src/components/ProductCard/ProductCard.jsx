import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({
  id,
  image,
  name,
  price,
  type,
  shade,
  volume,
  sex,
  stock,
}) => {
  const navigate = useNavigate();

  const handleViewClick = (e) => {
    e.stopPropagation();
    navigate(`/cosmetics/${id}`, { state: { id } });
  };

  let stockLabel = "";
  if (stock === 0) {
    stockLabel = "Sold Out";
  } else if (stock > 0 && stock < 10) {
    stockLabel = `Only ${stock} left`;
  }

  return (
    <div className="product_card" onClick={handleViewClick}>
      <div className="image_wrapper">
        <img src={image} alt={name} />
        {stockLabel && (
          <span
            className={`stock_status ${stock === 0 ? "sold_out" : "low_stock"
              }`}>
            {stockLabel}
          </span>
        )}
      </div>

      <div className="product_view_icon_wrapper" data-tooltip="View detail">
        <i className="far fa-eye product_view_icon"></i>
      </div>
      <p className="product_card_detail">
        {type} | {shade} | {volume} | {sex}
      </p>
      <h6 className="product_card_name">{name}</h6>
      <p className="product_card_price">{price.toLocaleString()} VND</p>
    </div>
  );
};

const SpecialCard = () => {
  const navigate = useNavigate();

  const handleShopNowClick = () => {
    navigate("/cosmetics", { state: { category: "all" } });
  };

  return (
    <div className="special_card">
      <h5>Don't see what you are looking for?</h5>
      <hr className="special_line" />
      <p>Browse our full catalog for more cosmetics, medicals and treatments</p>
      <button className="all_shop_now_btn" onClick={handleShopNowClick}>
        Shop now
      </button>
    </div>
  );
};

const ProductList = ({ products, resetKey }) => {
  const [visibleProducts, setVisibleProducts] = useState(12);
  const location = useLocation();
  const isCosmeticsPage = location.pathname === "/cosmetics";

  useEffect(() => {
    setVisibleProducts(12);
  }, [resetKey]);

  const handleSeeMore = () => {
    setVisibleProducts(visibleProducts + 12);
  };

  const displayedProducts = products.slice(0, visibleProducts);

  return (
    <div className="product_list col-lg-12">
      {displayedProducts.map((product) => (
        <ProductCard
          key={product._id}
          id={product._id}
          image={product.imgUrls?.[0] || ""}
          name={product.name}
          price={product.price}
          type={product.tags?.[0] || ""}
          shade=""
          volume={product.volume}
          sex={product.sex}
          // stock={5}
          stock={product.stock || 0}
        />
      ))}
      {visibleProducts < products.length ? (
        <div className="product_see_more_container">
          <button className="product_see_more_button" onClick={handleSeeMore}>
            View More
          </button>
        </div>
      ) : (
        !isCosmeticsPage && <SpecialCard />
      )}
    </div>
  );
};

export default ProductList;
