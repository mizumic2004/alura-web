import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { loginSuccess } from "../../store/authSlice";
import { useDispatch } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import rightImage from "../../assets/r1.jpeg";
import rightImage2 from "../../assets/r2.jpg";
import rightImage3 from "../../assets/r3.jpg";
import "../../styles/authen/Login.css";
import {
  clearSavedEmail,
  clearSavedPassword,
  getSavedEmail,
  getSavedPassword,
  setSavedEmail,
  setSavedPassword,
} from "../../utils/cookies";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 New state for toggle

  useEffect(() => {
    document.title = "Alurà - Sign In";

    const savedEmail = getSavedEmail();
    const savedPassword = getSavedPassword();
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }

    const handlePopState = (event) => {
      if (location.state?.from) {
        event.preventDefault();
        navigate(location.state.from);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "linear",
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await fetch(`${VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!resp.ok) {
        throw new Error("Wrong email or password.");
      }

      const data = await resp.json();

      dispatch(
        loginSuccess({
          token: data.token,
          user: data.accountId,
          role: data.role,
        })
      );

      if (rememberMe) {
        setSavedEmail(email, 15);
        setSavedPassword(password, 15);
      } else {
        clearSavedEmail();
        clearSavedPassword();
      }

      if (data.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (data.role === "STAFF") {
        navigate("/staff/product-list");
      } else {
        navigate("/");
      }

      toast.success("Login successful.");
    } catch (err) {
      toast.error(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => navigate("/");

  return (
    <div className="container main_container">
      <div className="row login_wrapper">
        <div className="col-lg-6 col-md-6 col-sm-12 left_side">
          <form className="sign_in_form" onSubmit={handleLogin}>
            <h3 className="sign_in_title">Sign in</h3>
            <div className="email_section">
              <label className="email_label" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="password_section mb-3 position-relative">
              <label className="password_label" htmlFor="password">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                placeholder="Enter password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="password_eye">
                <i
                  className={`far ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
                ></i>
              </span>
            </div>

            <div className="remember_forgot_section mb-3">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="remember_me">Remember me</label>
              <Link className="forgot_password_link" to="/forgot-password">
                Forgot password?
              </Link>
            </div>

            <div className="submit_section">
              <button
                type="submit"
                className="sign_in_button btn btn-block"
                disabled={loading}
              >
                {loading && (
                  <i
                    className="fas fa-spinner fa-spin"
                    style={{ marginRight: "5px" }}
                  ></i>
                )}
                Sign in
              </button>
            </div>

            <div className="sign_up_section">
              <span>
                Don't have an account?{" "}
                <Link className="sign_up_link" to="/sign-up">
                  Sign up
                </Link>
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
                  onClick={handleGuestLogin}
                  style={{ cursor: "pointer" }}
                >
                  Navigate to home
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="col-lg-6 col-md-6 col-sm-12 right_side">
          <Slider {...sliderSettings}>
            <div>
              <img className="right_image" src={rightImage} alt="Ring photo" />
            </div>
            <div>
              <img className="right_image" src={rightImage2} alt="Ring photo" />
            </div>
            <div>
              <img className="right_image" src={rightImage3} alt="Ring photo" />
            </div>
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Login;
