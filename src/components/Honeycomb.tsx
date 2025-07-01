import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Honeycomb.css';
import { useModule } from '../ModuleContext';

const modules = [
  { label: "HR", color: "group-hover:from-green-400 group-hover:to-green-600", path: "/dashboard" },
  { label: "CRM", color: "group-hover:from-orange-300 group-hover:to-orange-500", path: "/crm" },
  { label: "Core", color: "group-hover:from-emerald-300 group-hover:to-emerald-500", path: "/core" },
  { label: "Inventory", color: "group-hover:from-yellow-300 group-hover:to-yellow-500", path: "/inventory" },
  { label: "Procurement", color: "group-hover:from-purple-300 group-hover:to-purple-500", path: "/procurement" },
  { label: "Finance", color: "group-hover:from-amber-300 group-hover:to-amber-500", path: "/finance" },
  { label: "Logo", color: "", path: "" },
];

const positions = [
  "-translate-x-[120px] translate-y-0",
  "-translate-x-[60px] translate-y-[100px]",
  "translate-x-[60px] translate-y-[100px]",
  "translate-x-[120px] translate-y-0",
  "translate-x-[60px] -translate-y-[100px]",
  "-translate-x-[60px] -translate-y-[100px]",
  "translate-x-0 translate-y-0",
];

export default function Honeycomb() {
  const navigate = useNavigate();
  const { setActiveModule } = useModule();

  return (
    <section className="flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 h-screen overflow-hidden">
      <div className="relative w-[360px] h-[320px]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-gradient-to-r from-purple-400 to-pink-600 blur-[100px] opacity-20 rounded-full w-[300px] h-[300px] animate-pulse" />
        </div>

        {modules.map((mod, i) => (
          <motion.div
            key={mod.label}
            initial={{ scale: 0, opacity: 0, rotate: 45 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
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
            className={`absolute left-1/2 top-1/2
              ${positions[i]}
              transition-all duration-300
              group cursor-pointer
            `}
            style={{ width: 110, height: 110 }}
            onClick={() => {
              if (mod.label !== "Logo") {
                setActiveModule(mod.label);
                navigate(mod.path);
              }
            }}
          >
            <div
              className={`
                hexagon
                flex items-center justify-center
                w-full h-full
                text-base font-semibold text-center px-2
                shadow-xl
                transition-all duration-300
                bg-white
                ${mod.color ? `group-hover:bg-gradient-to-r ${mod.color} group-hover:text-white` : ""}
              `}
            >
              {mod.label === "Logo" ? (
                <a
                  href="https://bda.org.et"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-full flex items-center justify-center"
                >
                  <img
                    src="/bda-logo-1.png"
                    alt="Company Logo"
                    className="w-full h-full object-cover rounded-full"
                  />
                </a>
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
