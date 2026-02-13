import React, { useState, useEffect } from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Toaster, toast } from "react-hot-toast";

// Create custom toast functions for easier use
export const showToast = {
  success: (message: string, options = {}) => {
    toast.success(message, {
      id: `success-${Date.now()}`,
      ...options,
    });
  },

  error: (message: string, options = {}) => {
    toast.error(message, {
      id: `error-${Date.now()}`,
      ...options,
    });
  },

  loading: (message: string, options = {}) => {
    return toast.loading(message, options);
  },

  dismiss: (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string },
    options = {},
  ) => {
    return toast.promise(promise, messages, options);
  },

  custom: (message: string, options = {}) => {
    toast(message, options);
  },
};

const Layout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024); 
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const toggleSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };


  useEffect(() => {
    if (!isMobile) {
      setMobileSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile overlay */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-20 transition-opacity bg-black/50 lg:hidden ${
            mobileSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

  
      {isMobile ? (
        // Mobile sidebar - slides in from left
        <div
          className={`fixed inset-y-0 left-0 z-30 transition-all duration-300 transform lg:hidden ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar />
        </div>
      ) : (
        // Desktop sidebar - always visible
        <div className="flex h-screen">
          <Sidebar />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
        <Header toggleSidebar={toggleSidebar} isMobile={isMobile} />

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="py-6 px-4 lg:px-6">
            <Toaster
              position="top-right"
              gutter={12}
              toastOptions={{
                duration: 4000,
                success: {
                  duration: 3000,
                  style: {
                    background: "#10b981",
                    color: "#fff",
                  },
                  iconTheme: {
                    primary: "#fff",
                    secondary: "#10b981",
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#fff",
                  },
                },
                loading: {
                  duration: Infinity,
                  style: {
                    color: "#000",
                  },
                },
              }}
            />

            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
