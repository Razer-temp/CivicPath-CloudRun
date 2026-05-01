import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { InstallPrompt } from "../features/InstallPrompt";

export const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen relative font-sans">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus-visible:not-sr-only absolute top-0 left-0 z-[100] bg-civic-blue text-white p-4 font-bold rounded-br-lg"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <InstallPrompt />
    </div>
  );
};
