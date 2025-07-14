import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/authen/Register.css";
import rightImage from "../../assets/r1.jpeg";
import rightImage2 from "../../assets/r2.jpg";
import rightImage3 from "../../assets/r3.jpg";

const API_URL = import.meta.env.VITE_API_URL;

const Register = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [agree, setAgree] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        document.title = "Alurà - Sign Up";
    }, []);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        cssEase: "linear",
    };

    const validateInputs = () => {
        if (!name || !email || !password || !confirmPassword) {
            toast.error("Please fill all required fields.");
            return false;
        }
        if (password.length < 8) {
            toast.error("Password must have at least 8 characters.");
            return false;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return false;
        }
        if (!agree) {
            toast.error("You must agree to Terms of Service & Privacy Policy to create an account.");
            return false;
        }
        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validateInputs()) return;

        setLoading(true);
        try {
            const resp = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, phone: "", address: "" }),
            });

            if (!resp.ok) {
                const errData = await resp.json().catch(() => ({}));
                if (errData.message === "Email already registered") {
                    toast.error(
                        "Email already registered an account. Please use another email."
                    );
                } else {
                    throw new Error(
                        errData.message || `Register failed with status ${resp.status}`
                    );
                }
                return;
            }

            toast.success("Account created successfully.");
            navigate("/sign-in");
        } catch (err) {
            toast.error(err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        navigate("");
    };



    return (
        <div className="register_main_container container-fluid">
            <div className="row register_wrapper">
                <div className="col-lg-6 col-md-6 col-sm-12 register_left_side">
                    <form className="sign_up_form" onSubmit={handleRegister}>
                        <h3 className="sign_up_title">Sign up</h3>

                        <div className="email_section">
                            <label className="email_label" htmlFor="name">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="email_section">
                            <label className="email_label" htmlFor="email">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="password_section mb-3 position-relative">
                            <label className="password_label" htmlFor="password">Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                id="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span className="password_eye">
                                <i
                                    className={`far ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                                    id="togglePassword"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    style={{ cursor: "pointer" }}
                                ></i>
                            </span>
                        </div>

                        <div className="re_password_section mb-3 position-relative">
                            <label className="password_label" htmlFor="re_password">Confirm password</label>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="form-control"
                                id="re_password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <span className="re_password_eye">
                                <i
                                    className={`far ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}
                                    id="toggleRePassword"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    style={{ cursor: "pointer" }}
                                ></i>
                            </span>
                        </div>

                        <div className="term_of_service mb-3">
                            <input
                                id="tos_checkbox"
                                type="checkbox"
                                checked={agree}
                                onChange={(e) => setAgree(e.target.checked)}
                            />
                            <label style={{ fontSize: "13px" }} className="tos">
                                I agree with the{" "}
                                <span className="tos_link" onClick={() => setIsModalOpen(true)}>
                                    Terms of Service & Privacy Policy
                                </span>
                            </label>
                        </div>

                        <div className="submit_section">
                            <button
                                id="successPopup"
                                type="submit"
                                className="sign_up_button btn btn-block"
                                disabled={loading}
                            >
                                {loading && (
                                    <i className="fas fa-spinner fa-spin" style={{ marginRight: "5px" }}></i>
                                )}
                                Sign up
                            </button>
                        </div>

                        <div className="sign_up_section">
                            <span>
                                Already have an account?{" "}
                                <Link className="sign_up_link" to="/sign-in">Sign in</Link>
                            </span>
                        </div>

                        <div className="google_section text-center">
                            <div className="or_line_container">
                                <hr className="line" />
                                <span className="or_text">OR</span>
                                <hr className="line" />
                            </div>
                            <div className="google_guest_section">
                                <div
                                    className="guest_login_section"
                                    onClick={handleGoogleLogin}
                                    style={{ cursor: "pointer" }}
                                >
                                    Login with Google
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="col-lg-6 col-md-6 col-sm-12 register_right_side">
                    <Slider {...sliderSettings}>
                        <div><img className="register_image" src={rightImage} alt="Ring photo" /></div>
                        <div><img className="register_image" src={rightImage2} alt="Ring photo" /></div>
                        <div><img className="register_image" src={rightImage3} alt="Model with jewelry photo" /></div>
                    </Slider>
                </div>
            </div>

            {isModalOpen && (
                <div id="tosModal" className={`modal show`}>
                    <div className="modal-content">
                        <span
                            className="close"
                            style={{ textAlign: "end", cursor: "pointer" }}
                            onClick={() => setIsModalOpen(false)}
                        >
                            &times;
                        </span>

                        <h4 className="tos_title">Terms of Service & Privacy Policy</h4>
                        <p class="tos_introduce">
                            Welcome to Dian Jewelry! By signing up and creating an account on
                            our website, you agree to the following terms, conditions, and
                            privacy policy. You acknowledge that you have read and agree to our
                            Terms of Service & Privacy Policy. Thank you for your visit.
                        </p>

                        <p>
                            <strong>1. Introduction</strong>
                            <br />
                            We value your privacy and are committed to protecting your personal
                            information. This Privacy Policy outlines how we collect, use, and
                            protect your data.
                        </p>

                        <p>
                            <strong>2. Information We Collect</strong>
                            <br />
                            We collect information that you provide to us directly, such as when
                            you create an account, make a purchase, or contact us. This may
                            include your name, email address, phone number, shipping address,
                            and payment information. We also collect information automatically
                            as you navigate our site, including IP address, browser type, and
                            usage data.
                        </p>

                        <p>
                            <strong>3. How We Use Your Information</strong>
                            <br />
                            We use your information to provide and improve our services, process
                            transactions, communicate with you, and for marketing purposes. We
                            may also use your information to comply with legal obligations and
                            protect our rights.
                        </p>

                        <p>
                            <strong>4. Sharing Your Information</strong>
                            <br />
                            We do not sell your personal information. We may share your
                            information with third parties to facilitate our services, such as
                            payment processors, shipping companies, and marketing partners.
                            These third parties are obligated to protect your information and
                            use it only for the purposes we specify.
                        </p>

                        <p>
                            <strong>5. Data Security</strong>
                            <br />
                            We implement various security measures to protect your personal
                            information. However, no method of transmission over the internet or
                            electronic storage is 100% secure. We strive to use commercially
                            acceptable means to protect your data but cannot guarantee absolute
                            security.
                        </p>

                        <p>
                            <strong>6. Your Choices</strong>
                            <br />
                            You have the right to access, update, and delete your personal
                            information. You can manage your account settings or contact us to
                            make changes. You can also opt out of receiving promotional emails
                            by following the unsubscribe instructions in the emails.
                        </p>

                        <p>
                            <strong>7. Changes to This Policy</strong>
                            <br />
                            We may update this Privacy Policy periodically. Any changes will be
                            posted on our website, and your continued use of our services
                            constitutes acceptance of the updated policy.
                        </p>

                        <p>
                            <strong>8. Contact Us</strong>
                            <br />
                            If you have any questions or concerns about this Privacy Policy or
                            our data practices, please contact us at{" "}
                            <a href="/contact"> Alurà</a>.
                        </p>
                    </div>
                </div>

            )}

        </div>
    );
};

export default Register;
