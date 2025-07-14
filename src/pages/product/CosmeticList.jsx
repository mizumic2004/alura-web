import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    OutlinedInput,
    Checkbox,
    ListItemText,
    Button
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import '../../styles/product/ProductList.css';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Question from '../../components/Question/Question';
import ProductList from '../../components/ProductCard/ProductCard';
import Insta from '../../components/Insta/Instagram';
import banner from '../../assets/banner.png';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const CATEGORY_TYPE_MAP = {
    Face: ["Cleanser", "Toner", "Serum", "Face Mask", "Cream"],
    Hair: ["Shampoo", "Conditioner", "Hair Serum", "Hair Tonic", "Scalp Treatment"],
    Body: ["Body Lotion", "Body Wash", "Deodorant", "Sunscreen", "Body Scrub"],
    Makeup: ["Cleanser", "Toner", "Serum", "Face Mask", "Cream", "Fragrance", "Lip Balm", "Lip Stick", "Lip Scrub", "Nail Strengthener", "Cuticle Oil", "Nail Treatment"],
    Lip: ["Lip Balm", "Lip Stick", "Lip Scrub", "Nail Strengthener", "Cuticle Oil", "Nail Treatment"],
    Treatment: ["Serum", "Face Mask", "Cream", "Hair Serum", "Hair Tonic", "Scalp Treatment", "Nail Strengthener", "Cuticle Oil", "Nail Treatment"]
};

function CosmeticListPage() {
    const location = useLocation();

    const [sort, setSort] = useState('');
    const [sex, setSex] = useState([]);
    const [type, setType] = useState([]);
    const [brand, setBrand] = useState([]);
    const [brandOptions, setBrandOptions] = useState([]);
    const [skinType, setSkinType] = useState([]);
    const [skinColor, setSkinColor] = useState([]);
    const [volume, setVolume] = useState([]);
    const [stock, setStock] = useState([]);

    const [products, setProducts] = useState([]);
    const [resetKey, setResetKey] = useState(Date.now());
    const [transitionKey, setTransitionKey] = useState(Date.now());
    const [expandedPanel, setExpandedPanel] = useState(null);

    useEffect(() => {
        document.title = 'Alurà - Cosmetics';
    }, []);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/brands`);
                const json = await res.json();
                if (json.success && Array.isArray(json.data)) {
                    setBrandOptions(json.data);
                }
            } catch (error) {
                console.error("Failed to fetch brands:", error);
            }
        };

        fetchBrands();
    }, []);

    useEffect(() => {
        if (location.state) {
            if (location.state.sort) setSort(location.state.sort);
            if (location.state.sex) setSex(Array.isArray(location.state.sex) ? location.state.sex : [location.state.sex]);
            if (location.state.type) {
                const shortcutType = location.state.type;
                const mapped = CATEGORY_TYPE_MAP[shortcutType];
                if (mapped) {
                    setType(mapped);
                } else {
                    setType(Array.isArray(location.state.type) ? location.state.type : [location.state.type]);
                }
            }
            if (location.state.brand) setBrand(Array.isArray(location.state.brand) ? location.state.brand : [location.state.brand]);
            if (location.state.skinType) setSkinType(Array.isArray(location.state.skinType) ? location.state.skinType : [location.state.skinType]);
            if (location.state.skinColor) setSkinColor(Array.isArray(location.state.skinColor) ? location.state.skinColor : [location.state.skinColor]);
            if (location.state.volume) setVolume(Array.isArray(location.state.volume) ? location.state.volume : [location.state.volume]);
            if (location.state.stock) setStock(Array.isArray(location.state.stock) ? location.state.stock : [location.state.stock]);
        }
    }, [location.state]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/products?pageIndex=1&pageSize=100`
                );
                const data = await response.json();

                if (data.success && data.products) {
                    let filtered = [...data.products];

                    if (sex.length) {
                        filtered = filtered.filter((p) =>
                            sex.includes(p.sex?.toLowerCase())
                        );
                    }

                    if (type.length) {
                        filtered = filtered.filter((p) =>
                            p.tags?.some((tag) => type.includes(tag.toLowerCase()))
                        );
                    }

                    if (brand.length) {
                        filtered = filtered.filter((p) =>
                            brand.includes(p.brand?._id)
                        );
                    }

                    if (skinType.length) {
                        filtered = filtered.filter((p) =>
                            p.skinType?.some((s) => skinType.includes(s.toLowerCase()))
                        );
                    }

                    if (skinColor.length) {
                        filtered = filtered.filter((p) =>
                            skinColor.includes(p.skinColor?.toLowerCase())
                        );
                    }

                    if (volume.length) {
                        filtered = filtered.filter((p) =>
                            volume.includes(p.volume)
                        );
                    }

                    if (stock.length) {
                        if (stock.includes("In Stock")) {
                            filtered = filtered.filter(p => p.stock > 0);
                        }
                        if (stock.includes("Out of Stock")) {
                            filtered = filtered.filter(p => p.stock === 0);
                        }
                    }

                    if (sort) {
                        filtered.sort((a, b) => {
                            switch (sort) {
                                case 'Newest':
                                    return new Date(b.createdAt) - new Date(a.createdAt);
                                case 'Oldest':
                                    return new Date(a.createdAt) - new Date(b.createdAt);
                                case 'Price (Low to High)':
                                    return a.price - b.price;
                                case 'Price (High to Low)':
                                    return b.price - a.price;
                                default:
                                    return 0;
                            }
                        });
                    }

                    setProducts(filtered);
                    setResetKey(Date.now());
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [sort, sex, type, brand, skinType, skinColor, volume, stock]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            document.querySelector('.news_banner_main_wrapper')?.classList.add('visible');
        }, 10);
        return () => clearTimeout(timeout);
    }, [transitionKey]);

    const handleRemoveFilters = () => {
        setSort('');
        setSex([]);
        setType([]);
        setBrand([]);
        setSkinType([]);
        setSkinColor([]);
        setVolume([]);
        setStock([]);
    };

    const filterConfigs = [
        {
            label: "Type", state: type, setter: setType, options: [
                "Cleanser", "Toner", "Serum", "Face Mask", "Cream",
                "Shampoo", "Conditioner", "Hair Serum", "Hair Tonic", "Scalp Treatment",
                "Body Lotion", "Body Wash", "Deodorant", "Sunscreen", "Body Scrub",
                "Fragrance", "Lip Balm", "Lip Stick", "Lip Scrub", "Nail Strengthener", "Cuticle Oil", "Nail Treatment"
            ]
        },
        {
            label: "Brand", state: brand, setter: setBrand,
            options: brandOptions.map(b => ({
                value: b.id,
                label: b.brandName
            }))
        },
        {
            label: "Stock", state: stock, setter: setStock, options: ["In Stock", "Out of Stock"]
        },
        {
            label: "Sex", state: sex, setter: setSex, options: ["Male", "Female", "Unisex"]
        },
        {
            label: "Skin Type", state: skinType, setter: setSkinType,
            options: ["Normal", "Dry", "Oily", "Combination", "Sensitive"]
        },
        {
            label: "Skin Color", state: skinColor, setter: setSkinColor,
            options: ["Light", "Dark", "Neutral", "Cool"]
        },
        {
            label: "Volume", state: volume, setter: setVolume,
            options: ["10g", "30ml", "50ml", "100ml", "200ml", "1000ml", "Full Size"]
        }
    ];

    return (
        <div className="ProductList">
            <Breadcrumb items={[{ name: 'Home', link: '/' }, { name: 'Cosmetics' }]} />

            <div key={transitionKey} className="news_banner_main_wrapper">
                <div className="news_banner_image">
                    <img src={banner} alt="banner" />
                </div>
            </div>

            <div className="filters_and_products_wrapper">
                <div className="filter_sidebar">
                    <Button
                        onClick={handleRemoveFilters}
                        variant="outlined"
                        className="clear_filters_btn"
                    >
                        Clear All Filters
                    </Button>

                    <FormControl fullWidth size="small" className="sort_select_box">
                        <InputLabel id="sortFilter-label">Sort</InputLabel>
                        <Select
                            labelId="sortFilter-label"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            input={<OutlinedInput label="Sort" />}
                        >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="Newest">Newest</MenuItem>
                            <MenuItem value="Oldest">Oldest</MenuItem>
                            <MenuItem value="Price (Low to High)">Price ↑</MenuItem>
                            <MenuItem value="Price (High to Low)">Price ↓</MenuItem>
                        </Select>
                    </FormControl>

                    {filterConfigs.map((filter, i) => {
                        const isActive = filter.state.length > 0;

                        return (
                            <Accordion
                                key={i}
                                expanded={isActive || expandedPanel === filter.label}
                                onChange={(_, isExpanded) => {
                                    if (!isActive) {
                                        setExpandedPanel(isExpanded ? filter.label : null);
                                    }
                                }}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>{filter.label}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <FormControl fullWidth size="small" className="filter_select_box">
                                        <Select
                                            labelId={`${filter.label}-label`}
                                            multiple
                                            value={filter.state}
                                            onChange={(e) => filter.setter(e.target.value)}
                                            input={<OutlinedInput />}
                                            renderValue={(selected) => {
                                                if (filter.label === "Brand") {
                                                    return selected
                                                        .map(val => {
                                                            const matched = filter.options.find(opt => opt.value === val);
                                                            return matched ? matched.label : val;
                                                        })
                                                        .join(', ');
                                                }
                                                return selected.join(', ');
                                            }}

                                            MenuProps={MenuProps}
                                        >
                                            {filter.options.map((option) => {
                                                const value = typeof option === 'string' ? option : option.value;
                                                const label = typeof option === 'string' ? option : option.label;

                                                return (
                                                    <MenuItem key={value} value={value}>
                                                        <Checkbox checked={filter.state.includes(value)} />
                                                        <ListItemText primary={label} />
                                                    </MenuItem>
                                                );
                                            })}

                                        </Select>
                                    </FormControl>
                                </AccordionDetails>
                            </Accordion>
                        );
                    })}
                </div>

                <div className="product_main_list_area">
                    <ProductList products={products} resetKey={resetKey} />
                </div>
            </div>

            <br /><br />
            <Question />
            <Insta />
        </div>
    );
}

export default CosmeticListPage;
