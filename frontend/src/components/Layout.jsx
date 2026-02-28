import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" className="page">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
}
