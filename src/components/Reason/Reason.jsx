import { Component } from 'react';
import './Reason.css';

class Reason extends Component {
    render() {
        return (
            <div className="reason_container">
                <h1 className="reason_title">The Reason To Choose Us</h1>
                <div className="reason_grid">
                    <div className="reason_card">
                        <div className="reason_icon"><i className="fas fa-gem"></i></div>
                        <h3 className="reason_card_title">AFFORDABLE LUXURY</h3>
                        <p className="reason_card_description">We offer premium skincare and aesthetic treatments using advanced technology — all at competitive prices without sacrificing quality.</p>
                    </div>
                    <div className="reason_card">
                        <div className="reason_icon"><i className="fas fa-heart"></i></div>
                        <h3 className="reason_card_title">CLINICAL EXCELLENCE</h3>
                        <p className="reason_card_description">Our treatments are performed by certified professionals using FDA-approved methods and products, ensuring both safety and stunning results.</p>
                    </div>
                    <div className="reason_card">
                        <div className="reason_icon"><i className="fas fa-clock"></i></div>
                        <h3 className="reason_card_title">PERSONALIZED CARE</h3>
                        <p className="reason_card_description">From consultation to post-treatment follow-up, we take time to understand your goals and design personalized care plans for optimal outcomes.</p>
                    </div>
                    <div className="reason_card">
                        <div className="reason_icon"><i className="fas fa-gift"></i></div>
                        <h3 className="reason_card_title">AFTERCARE & PROMOTIONS</h3>
                        <p className="reason_card_description">We provide detailed aftercare guidance, long-term support, and exclusive seasonal offers to ensure a seamless and rewarding experience.</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Reason;
