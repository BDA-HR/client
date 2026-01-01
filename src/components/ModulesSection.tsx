import React from "react";
import { useModule } from '../ModuleContext';
import { useNavigate } from "react-router";
import { 
  Users, 
  BarChart3, 
  FileText, 
  Package, 
  ShoppingCart, 
  CreditCard,
  Cpu,
  ChevronRight
} from "lucide-react";
import { BorderBeam } from "../components/ui/border-beam";

interface ModuleCardProps {
  label: string;
  path: string;
  icon: React.ReactNode;
  color: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ 
  label, 
  path, 
  icon, 
  color
}) => {
  const navigate = useNavigate();
  const { setActiveModule } = useModule();

  const handleClick = () => {
    setActiveModule(label);
    navigate(path);
  };

  // Extract colors for gradients
  const fromColor = color.split(' ')[0].replace('from-', '');
  const toColor = color.split(' ')[2] ? color.split(' ')[2].replace('to-', '') : color.split(' ')[1].replace('to-', '');

  return (
    <button
      onClick={handleClick}
      className={`
        relative group w-full
        rounded-2xl p-6
        transition-all duration-500 ease-out
        hover:scale-[1.05] hover:shadow-2xl
        active:scale-95
        flex flex-col items-center justify-center
        overflow-hidden
        bg-white
        border border-gray-200/50
        cursor-pointer
        shadow-md
      `}
    >
      {/* Default white background */}
      <div className="absolute inset-0 bg-white rounded-2xl" />
      
      {/* Beautiful gradient background on hover */}
      <div className={`
        absolute inset-0
        bg-gradient-to-br ${color}
        opacity-0 group-hover:opacity-100
        transition-all duration-500 ease-out
        rounded-2xl
      `} />
      
      {/* Subtle glow effect */}
      <div className={`
        absolute inset-0
        bg-gradient-to-br ${color}
        opacity-0 group-hover:opacity-20
        blur-xl group-hover:blur-2xl
        transition-all duration-700 ease-out
        rounded-2xl
      `} />
      
      {/* BorderBeam Effect */}
      <BorderBeam 
        duration={12} 
        size={200} 
        colorFrom={fromColor}
        colorTo={toColor}
      />
      
      {/* Icon Container */}
      <div className={`
        relative mb-5 p-4 rounded-xl
        ${color}
        bg-gradient-to-br
        transition-all duration-500 ease-out
        group-hover:scale-110 group-hover:rotate-3
        group-hover:bg-white
        group-hover:${fromColor}-600
        shadow-lg
        z-10
      `}>
        <div className="text-white text-2xl group-hover:text-white transition-colors duration-500">
          {icon}
        </div>
      </div>
      
      {/* Module Label */}
      <h3 className={`
        relative text-xl font-bold mb-3
        text-gray-800
        group-hover:text-white
        transition-all duration-500 ease-out
        group-hover:tracking-wide
        z-10
      `}>
        {label}
      </h3>
      
      {/* Click Indicator */}
      <div className="relative flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out z-10">
        <span className="text-white/90">Access Module</span>
        <ChevronRight className="w-4 h-4 text-white/90 group-hover:translate-x-1 transition-transform duration-300" />
      </div>
      
      {/* Floating particles effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/50 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </button>
  );
};

interface ModulesSectionProps {
  onModuleSelect?: (moduleName: string) => void;
}

const ModulesSection: React.FC<ModulesSectionProps> = ({ onModuleSelect }) => {
  const { setActiveModule } = useModule();

  const handleModuleSelect = (moduleName: string) => {
    setActiveModule(moduleName);
    if (onModuleSelect) {
      onModuleSelect(moduleName);
    }
  };

  const modules = [
    { 
      label: "HR", 
      path: "/hr", 
      icon: <Users size={24} />,
      color: "from-blue-500 via-blue-400 to-cyan-400"
    },
    { 
      label: "CRM", 
      path: "/crm", 
      icon: <BarChart3 size={24} />,
      color: "from-purple-500 via-purple-400 to-pink-400"
    },
    { 
      label: "File", 
      path: "/file", 
      icon: <FileText size={24} />,
      color: "from-emerald-500 via-emerald-400 to-teal-400"
    },
    { 
      label: "Inventory", 
      path: "/inventory", 
      icon: <Package size={24} />,
      color: "from-amber-500 via-amber-400 to-orange-400"
    },
    { 
      label: "Procurement", 
      path: "/procurement", 
      icon: <ShoppingCart size={24} />,
      color: "from-rose-500 via-rose-400 to-red-400"
    },
    { 
      label: "Finance", 
      path: "/finance", 
      icon: <CreditCard size={24} />,
      color: "from-green-500 via-green-400 to-lime-400"
    },
    { 
      label: "Core", 
      path: "/core", 
      icon: <Cpu size={24} />,
      color: "from-gray-700 via-gray-600 to-gray-500"
    },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      {/* Background effects */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
      `}</style>
      
      {/* Grid Layout */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl w-full">
        {modules.map((module, index) => (
          <div 
            key={module.label}
            className="relative animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ 
              animationDelay: `${index * 150}ms`,
              animationFillMode: 'both'
            }}
          >
            <ModuleCard
              {...module}
              onSelect={handleModuleSelect}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModulesSection;