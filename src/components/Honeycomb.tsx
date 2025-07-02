import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Honeycomb.css';
import { useModule } from '../ModuleContext';

const modules = [
  { label: "HR", color: "group-hover:from-green-400 group-hover:to-green-600", path: "/dashboard" },
  { label: "CRM", color: "group-hover:from-orange-300 group-hover:to-orange-500", path: "/crm" },
  { label: "File", color: "group-hover:from-emerald-300 group-hover:to-emerald-500", path: "/file" },
  { label: "Inventory", color: "group-hover:from-yellow-300 group-hover:to-yellow-500", path: "/inventory" },
  { label: "Procurement", color: "group-hover:from-purple-300 group-hover:to-purple-500", path: "/procurement" },
  { label: "Finance", color: "group-hover:from-indigo-800 group-hover:to-indigo-500", path: "/finance" },
  { label: "Logo", color: "", path: "/core" }, 
];

const positions = [
  "-translate-x-[120px] translate-y-0",
  "-translate-x-[60px] translate-y-[104px]",
  "translate-x-[60px] translate-y-[104px]",
  "translate-x-[120px] translate-y-0",
  "translate-x-[60px] -translate-y-[104px]",
  "-translate-x-[60px] -translate-y-[104px]",
  "translate-x-0 translate-y-0",
];


export default function Honeycomb() {
  const navigate = useNavigate();
  const { setActiveModule } = useModule();

  return (
    <section className="flex items-center justify-center h-screen w-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
      <div className="relative w-full max-w-[90vmin] h-[90vmin] flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-gradient-to-r from-purple-400 to-pink-600 blur-[10vmin] opacity-20 rounded-full w-[60%] h-[60%] animate-pulse" />
        </div>

        {modules.map((mod, i) => (
          <motion.div
            key={mod.label}
            initial={{ scale: 0, opacity: 0, rotate: 45 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              rotate: 0,
            }}
            transition={{
              delay: i * 0.15,
              duration: 0.7,
              ease: [0.17, 0.67, 0.83, 0.67],
              rotate: { type: 'spring', stiffness: 100 },
            }}
            whileHover={{
              scale: 1.15,
              zIndex: 50,
              transition: { duration: 0.3 },
            }}
            className={`absolute
              transform -translate-x-1/2 -translate-y-1/2
              ${positions[i]}
              transition-all duration-300
              group cursor-pointer
            `}
            style={{ 
              width: 'clamp(68px, 15.5vmin, 125px)',
              height: 'clamp(68px, 15.5vmin, 125px)' 
            }}
            onClick={() => {
              if (mod.path) {
                setActiveModule(mod.label === "Logo" ? "Core" : mod.label);
                navigate(mod.path);
              }
            }}
          >
            <div
              className={`
                hexagon
                flex items-center justify-center
                w-full h-full
                font-semibold text-center px-2
                shadow-xl
                transition-all duration-300
                bg-white
                ${mod.color ? `group-hover:bg-gradient-to-r ${mod.color} group-hover:text-white` : ""}
              `}
            >
              {mod.label === "Logo" ? (
                  <img
                    src="/bda-logo-1.png"
                    alt="Company Logo"
                    className="w-[80%] h-[80%] object-contain"
                  />
              ) : (
                mod.label
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}