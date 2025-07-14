import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Breadcrumb.css';

const Breadcrumb = ({ items }) => {
    const navigate = useNavigate();

    const handleNavigation = (item) => {
        if (item.name === 'Diamond Jewelry') {
            navigate('/diamond-jewelry', { state: { category: 'all' } });
        }
        else if (item.name === 'Wedding Jewelry') {
            navigate('/diamond-jewelry', { state: { category: 'weddingJewelry' } });
        }
        else if (item.link) {
            navigate(item.link);
        }
    };

    return (
        <div className="sub-nav-container">
            <div className="sub_nav">
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        <span
                            className="nav-item"
                            onClick={() => handleNavigation(item)}
                            style={{ cursor: 'pointer' }}
                        >
                            {item.name}
                        </span>
                        {index < items.length - 1 && <span style={{ color: '#838a96' }}>  |  </span>}
                    </React.Fragment>
                ))}
            </div>
            <hr className="sub_nav_hr" />
        </div>
    );
}

export default Breadcrumb;
