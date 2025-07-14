import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import ProductList from '../../components/ProductCard/ProductCard';
import Question from '../../components/Question/Question';
import '../../styles/product/ProductSearch.css';
import Insta from '../../components/Insta/Instagram';

const ProductSearch = () => {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const searchQuery = location.state?.searchQuery || '';
    const resetKey = searchQuery + products.length;

    useEffect(() => {
        document.title = "Alurà - Search";
        if (location.state?.products) {
            setProducts(location.state.products);
        }
    }, [location.state]);

    const navItems = [
        { name: 'Home', link: '/' },
        { name: 'Search' }
    ];

    return (
        <div className="Search">
            <Breadcrumb items={navItems} />
            <br />

            <div className="search_counter">
                <div className="results_count">
                    <p>{`(${products.length} result${products.length !== 1 ? 's' : ''} for "${searchQuery}")`}</p>
                </div>
            </div>
            <br></br>

            <ProductList products={products} resetKey={resetKey} />

            <br></br><br></br><br></br>

            <Question />
            <Insta />
        </div>
    );
};

export default ProductSearch;
