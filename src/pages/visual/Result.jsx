import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/visual/Result.css";
import ProductList from "../../components/ProductCard/ProductCard";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Insta from "../../components/Insta/Instagram";
import Question from "../../components/Question/Question";

function Result() {
  const { state } = useLocation();
  const image = state?.image;
  const navigate = useNavigate();
  const productsFromState = state?.products || [];
  const [products, setProducts] = useState(productsFromState || []);

  const breadcrumbItems = [
    { name: "Home", link: "/" },
    { name: "Visual Search", link: "/visual-search" },
    { name: "Visual Search Result", link: "" },
  ];

  useEffect(() => {
    console.log("Products from state:", productsFromState);

    document.title = "Alurà - Visual Search Result";
    setProducts(productsFromState);
  }, []);

  return (
    <div className="Result">
      <Breadcrumb items={breadcrumbItems} />
      <br />

      {image && (
        <div className="search-again-container">
          <button
            className="search-again-button"
            onClick={() => navigate("/visual-search")}>
            &lt; Search Another Image
          </button>

          <div className="result-image-preview">
            <img src={image} alt="Searched" className="result-image" />
          </div>
        </div>
      )}

      <div className="search_counter">
        <div className="results_count">
          <p>{`(${products.length} Results Matched The Image)`}</p>
        </div>
      </div>

      <br />
      <br />
      <br />

      <ProductList products={products} />

      <br />
      <br />
      <br />
      <Question />
      <Insta />
    </div>
  );
}

export default Result;
