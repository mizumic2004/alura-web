import { useNavigate } from 'react-router-dom';
import './Question.css';

const Question = () => {
    const navigate = useNavigate();

    const handleMoreFaqsClick = () => {
        navigate('/FAQs');
    };

    return (
        <div className="question_component">
            <div className="container question-container">
                <div className="question_content row">
                    <div className="question_text col-lg-6 col-md-6 col-sm-12">
                        <h3>Have a question about our cosmetics?</h3>
                        <p>We’re here to help anytime.</p>
                    </div>
                    <div className="contact-info  col-lg-6 col-md-6 col-sm-12">
                        <div className="contact_item">
                            <a href='tel:0795795959'><i className="fas fa-phone-alt"></i> 0795 795 959</a>
                        </div>
                        <br />
                        <div className="contact_item">
                            <a href='mailto:alura@gmail.com'><i className="fas fa-envelope"></i> alura@gmail.com</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQs */}
            <div className="faqs_container">
                <div className="row">
                    <div className="col-md-4 faqs_header">
                        <h1>Most FAQs about our products</h1>
                        <button className="more_faqs_btn" onClick={handleMoreFaqsClick}>More</button>
                    </div>
                    <div className="col-md-8 faq_items">
                        <hr className="top_line" />
                        <div className="faq_item">
                            <h5>Are your products suitable for sensitive skin?</h5>
                            <p>Yes! We offer a wide range of products formulated specifically for sensitive skin. Always check the product label and ingredients list to ensure compatibility.</p>
                        </div>
                        <hr />
                        <div className="faq_item">
                            <h5>Do you test on animals?</h5>
                            <p>No, all our products are 100% cruelty-free. We are committed to ethical sourcing and never test any of our items on animals.</p>
                        </div>
                        <hr />
                        <div className="faq_item">
                            <h5>How can I find the right skincare routine for my skin type?</h5>
                            <p>You can use our filters by skin type to browse compatible products. If you're unsure, our team is happy to assist through email or phone support.</p>
                        </div>
                        <hr className="bottom_line" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Question;
