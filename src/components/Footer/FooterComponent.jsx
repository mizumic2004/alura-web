import React, { useEffect } from 'react';
import '../Footer/Footer.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/footerLogo.png';
import vnpay from '../../assets/vnpay.webp';
import bank from '../../assets/bankLogo.png';
import cash from '../../assets/cashLogo.png';

const FooterComponent = () => {
    useEffect(() => {
        const modals = [
            { modalId: "warrantyModal", linkId: "warrantyModalLink" },
            { modalId: "tosModal", linkId: "tosModalLink" }
        ];

        const openModal = (modal) => {
            modal.style.display = "block";
            document.body.classList.add("modal-open");
        };

        const closeModal = (modal) => {
            modal.style.display = "none";
            document.body.classList.remove("modal-open");
        };

        modals.forEach(({ modalId, linkId }) => {
            const modal = document.getElementById(modalId);
            const btn = document.getElementById(linkId);
            const span = modal?.getElementsByClassName("close")[0];

            if (btn && modal && span) {
                btn.onclick = function (e) {
                    e.preventDefault();
                    openModal(modal);
                };
                span.onclick = function () {
                    closeModal(modal);
                };
            }
        });

    }, []);

    const navigate = useNavigate();

    const handleNavigate = (path, state) => {
        window.scrollTo(0, 0);
        navigate(path, { state });
    };

    const handleLinkClick = (event, scrollTo) => {
        event.preventDefault();
        window.scrollTo(0, scrollTo);
        navigate(event.currentTarget.getAttribute('href'));
    };


    return (
        <>
            <footer className="footer">
                <div className="container">
                    <div className="row footer_column">
                        <div className="col-sm-6 col-md-3 footer_first_column">
                            <img src={logo} alt="Footer Logo" />
                            <h6>Contact us for support</h6>
                            <ul className="footer_content">
                                <li><i className="fas fa-phone-volume"></i><Link to='tel:0795795959'>0795 795 959</Link></li>
                                <li><i className="fas fa-envelope"></i><Link to='mailto:alura@gmail.com'>alura@gmail.com</Link></li>
                            </ul>
                        </div>
                        <div className="col-sm-6 col-md-2 footer_2_column">
                            <h6>Categories</h6>
                            <ul className="footer_content">
                                <li onClick={() => handleNavigate('/cosmetics', { type: 'Face' })}>
                                    <Link to="/cosmetics">Facial cosmetics</Link>
                                </li>
                                <li onClick={() => handleNavigate('/cosmetics', { type: 'Hair' })}>
                                    <Link to="/cosmetics">Hair cosmetics</Link>
                                </li>
                                <li onClick={() => handleNavigate('/cosmetics', { type: 'Body' })}>
                                    <Link to="/cosmetics">Body cosmetics</Link>
                                </li>
                                <li onClick={() => handleNavigate('/cosmetics', { type: 'Lip' })}>
                                    <Link to="/cosmetics">Lips & Nails cosmetics</Link>
                                </li>
                                <li onClick={() => handleNavigate('/cosmetics', { type: 'Treatment' })}>
                                    <Link to="/cosmetics">Medical & Treatment</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-sm-6 col-md-2 footer_3_column">
                            <h6>Services</h6>
                            <ul className="footer_content">
                                <li><Link to="/profile" onClick={(e) => handleLinkClick(e, 160)}>My profile</Link></li>
                                <li><Link to="/order-history" onClick={(e) => handleLinkClick(e, 160)}>Order history</Link></li>
                                <li><Link to="/visual-search" onClick={(e) => handleLinkClick(e, 160)}>Visual search</Link></li>
                            </ul>
                        </div>
                        <div className="col-sm-6 col-md-2 footer_4_column">
                            <h6>Information</h6>
                            <ul className="footer_content">
                                <li><Link to="/faqs" onClick={(e) => handleLinkClick(e, 0)}>FAQs</Link></li>
                                <li><Link to="/introduce" onClick={(e) => handleLinkClick(e, 0)}>About us</Link></li>
                                <li><Link to="/contact" onClick={(e) => handleLinkClick(e, 0)}>Contact us</Link></li>
                            </ul>
                        </div>
                        <div className="col-sm-12 col-md-3 footer_last_column">
                            <h6>Connect with us</h6>
                            <ul className="footer_content social_media_icon" style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '16px' }}>
                                <li><Link to="https://www.facebook.com/profile.php?id=61560517631582" target="_blank"><i className="fb fab fa-facebook-f" target="_blank"></i></Link></li>
                                <li><Link to="https://www.instagram.com/alura" target="_blank"><i className="ins fab fa-instagram"></i></Link></li>
                                <li><Link to="https://www.tiktok.com/@alura" target="_blank"><i className="tik fab fa-tiktok"></i></Link></li>
                                <li><Link to="/" target="_blank"><i className="gg fab fa-google"></i></Link></li>
                            </ul>
                            <h6 className='footer_last_column_title_2'>Secure payment</h6>
                            <ul className="footer_content">
                                <img className='footer_vnpay' src={vnpay} alt="VNPAY Logo" />
                                {/* <img className='footer_bank' src={bank} alt="Bank Logo" /> */}
                                <img className='footer_cash' src={cash} alt="Cash Logo" />
                            </ul>
                        </div>
                    </div>
                    <hr className="hr_footer" />
                    <div className="copyright row">
                        <div className="end_footer col-sm-12 col-md-6">
                            <p>© Copyright 2025 by Alurà</p> <p>ㅤ|ㅤ</p>
                            <Link className="footer_tos_link" id="warrantyModalLink" to=""> Warranty Policyㅤ</Link>
                            <p>| ㅤ</p>
                            <Link className="footer_tos_link" id="tosModalLink" to="">Terms of Service & Privacy Policy</Link>
                        </div>
                    </div>
                </div>
            </footer>

            <div id="tosModal" className="modal">
                <div className="modal-content-footer">
                    {/* <span className="close" style={{ textAlign: 'end' }}>&times;</span> */}
                    <span
                        className="close footer_close"
                        style={{ textAlign: "end", cursor: "pointer" }}
                    >
                        &times;
                    </span>
                    <h4 className="tos_title">Terms of Service & Privacy Policy</h4>
                    <p className="tos_introduce">
                        Welcome to Alurà! By signing up and creating an account on our website,
                        you agree to the following terms, conditions, and privacy policy. You acknowledge that you have read and agree to our Terms of Service & Privacy Policy. Thank you for your visit.
                    </p>

                    <p>
                        <strong>1. Introduction</strong><br />
                        We value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and protect your data.
                    </p>

                    <p>
                        <strong>2. Information We Collect</strong><br />
                        We collect information that you provide to us directly, such as when you create an account, make a purchase, or contact us. This may include your name, email address, phone number, shipping address, and payment information. We also collect information automatically as you navigate our site, including IP address, browser type, and usage data.
                    </p>

                    <p>
                        <strong>3. How We Use Your Information</strong><br />
                        We use your information to provide and improve our services, process transactions, communicate with you, and for marketing purposes. We may also use your information to comply with legal obligations and protect our rights.
                    </p>

                    <p>
                        <strong>4. Sharing Your Information</strong><br />
                        We do not sell your personal information. We may share your information with third parties to facilitate our services, such as payment processors, shipping companies, and marketing partners. These third parties are obligated to protect your information and use it only for the purposes we specify.
                    </p>

                    <p>
                        <strong>5. Data Security</strong><br />
                        We implement various security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure. We strive to use commercially acceptable means to protect your data but cannot guarantee absolute security.
                    </p>

                    <p>
                        <strong>6. Your Choices</strong><br />
                        You have the right to access, update, and delete your personal information. You can manage your account settings or contact us to make changes. You can also opt out of receiving promotional emails by following the unsubscribe instructions in the emails.
                    </p>

                    <p>
                        <strong>7. Changes to This Policy</strong><br />
                        We may update this Privacy Policy periodically. Any changes will be posted on our website, and your continued use of our services constitutes acceptance of the updated policy.
                    </p>

                    <p>
                        <strong>8. Contact Us</strong><br />
                        If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at <a href="/contact"> Alurà</a>.
                    </p>
                </div>
            </div>

            <div id="warrantyModal" className="modal">
                <div className="modal-content-footer">
                    <span className="close footer_close" style={{ textAlign: 'end' }}>&times;</span>
                    <h4 className="tos_title">Warranty Policy</h4>
                    <p className="tos_introduce">
                        Welcome to Alurà! By purchasing our products, you agree to the following terms and conditions of our Warranty Policy. We strive to provide high-quality products and excellent customer service. Thank you for your trust in us. Hope you have a great time shopping.
                    </p>

                    <p>
                        <strong>1. Warranty Coverage</strong><br />
                        Our warranty covers manufacturing defects in materials and workmanship for a period of one year from the date of purchase. This warranty is applicable only to the original purchaser and is non-transferable.
                    </p>

                    <p>
                        <strong>2. What is Not Covered</strong><br />
                        The warranty does not cover damages caused by accidents, misuse, neglect, unauthorized repairs, or normal wear and tear. It also does not cover any loss of stones or gems after the initial 30 days of purchase.
                    </p>

                    <p>
                        <strong>3. Warranty Claim Process</strong><br />
                        To make a warranty claim, please contact our customer service team at <a href="mailto:alura@gmail.com">alura@gmail.com</a> or call us at <a href="tel:0795795959">0795 795 959</a>. You will need to provide your original purchase receipt and a detailed description of the defect. The warranty of the products will be sent through the customer's signed email after a succesfully order.
                    </p>

                    <p>
                        <strong>4. Warranty Resolution</strong><br />
                        Upon receiving your warranty claim, our team will inspect the product. If the defect is covered by the warranty, we will repair the product free of charge. If repair is not possible, we will replace the product with one of equal value.
                    </p>

                    <p>
                        <strong>5. Shipping Costs</strong><br />
                        Shipping is free for warranty service. We will cover the shipping costs to return the repaired or replacement item back to the customer.
                    </p>

                    <p>
                        <strong>6. Warranty Limitations</strong><br />
                        This warranty is the only express warranty provided by Alurà. No implied warranties, including but not limited to warranties of merchantability and fitness for a particular purpose, are provided. Some jurisdictions do not allow limitations on how long an implied warranty lasts, so the above limitations may not apply to you.
                    </p>

                    <p>
                        <strong>7. Changes to This Policy</strong><br />
                        We may update this Warranty Policy periodically. Any changes will be posted on our website, and your continued use of our services constitutes acceptance of the updated policy.
                    </p>

                    <p>
                        <strong>8. Contact Us</strong><br />
                        If you have any questions or concerns about this Warranty Policy, please contact us at <a href="/contact"> Alurà</a>.
                    </p>
                </div>
            </div>


        </>
    );
};

export default FooterComponent;
