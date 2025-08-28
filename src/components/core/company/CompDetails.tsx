import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Building2, User, DollarSign, Users, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

type Company = {
  id: number;
  name: string;
  nameAm: string;
  manager: string;
  budget: string;
  employees: number;
  branches: number;
};

const CompanyDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuth) {
      setLoading(false);
      return;
    }

    const storedCompany = sessionStorage.getItem('selectedCompany');
    if (storedCompany) {
      const parsedCompany = JSON.parse(storedCompany);
      if (parsedCompany.id.toString() === id) {
        setCompany(parsedCompany);
        setLoading(false);
        return;
      }
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [id]);

  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p>Loading company details...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Company Not Found</h1>
          <p>No company data found for the given ID.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* 🟢 Company Name Card */}
        <motion.div 
          className="bg-white rounded-xl shadow p-6 border"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-emerald-100 text-emerald-700">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-emerald-700">{company.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{company.nameAm}</p>
            </div>
          </div>
        </motion.div>

        {/* 🟢 Company Info Card */}
        <motion.div 
          className="bg-white rounded-xl shadow p-6 border"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Company Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-gray-500">Manager:</span>
              <span className="font-medium text-gray-800">{company.manager}</span>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span className="text-gray-500">Budget:</span>
              <span className="font-medium text-gray-800">{company.budget}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-gray-500">Employees:</span>
              <span className="font-medium text-gray-800">{company.employees}</span>
            </div>
            <div className="flex items-center gap-3">
              <Layers className="h-4 w-4 text-gray-500" />
              <span className="text-gray-500">Branches:</span>
              <span className="font-medium text-gray-800">{company.branches}</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-6 text-right">Viewed at: {new Date().toLocaleString()}</p>
        </motion.div>

      </div>
    </div>
  );
};

export default CompanyDetailsPage;
