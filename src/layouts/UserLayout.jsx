import HeaderComponent from "../components/Header/HeaderComponent";
import FooterComponent from "../components/Footer/FooterComponent";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";
import AutoScroll from "../components/AutoScroll/AutoScroll";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <>
      <HeaderComponent />
      <main>
        <Outlet />
      </main>
      <ScrollToTop />
      <AutoScroll />
      <FooterComponent />
    </>
  );
};

export default UserLayout;
