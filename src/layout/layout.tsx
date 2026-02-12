import React, {useState} from 'react';
import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import Header from './Header';
import { Toaster, toast } from 'react-hot-toast';

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
  
  promise: <T,>(promise: Promise<T>, messages: { loading: string; success: string; error: string }, options = {}) => {
    return toast.promise(promise, messages, options);
  },
  
  custom: (message: string, options = {}) => {
    toast(message, options);
  },
};

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className={`fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden ${
        sidebarOpen ? 'block' : 'hidden'
      }`} onClick={() => setSidebarOpen(false)} />
      
      <div className={`fixed inset-y-0 left-0 z-30 w-62 transition duration-300 transform bg-gray-100 lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar />
      </div>
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto py-6 px-4 lg:px-6">
          <Toaster
            position="top-right"
            gutter={12}
            toastOptions={{
              duration: 4000,
              success: {
                duration: 3000,
                style: {
                  background: '#10b981',
                  color: '#fff',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#10b981',
                },
              },
              error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',}
              },
              loading: {
                duration: Infinity,
                style: {
                  color: '#000',
                },
              },
            }}
          />
          
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout