import { useNavigate } from 'react-router-dom';
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

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <section className="flex items-center justify-center h-screen w-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span className="font-medium">Logout</span>
      </button>

      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 drop-shadow">
          Welcome to the <span className="text-purple-600">BDA Platform</span>
        </h1>
      </div>

      <div className="relative w-full max-w-[90vmin] h-[90vmin] flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-gradient-to-r from-purple-400 to-pink-600 blur-[10vmin] opacity-20 rounded-full w-[60%] h-[60%] animate-pulse" />
        </div>

        {modules.map((mod, i) => (
          <div
            key={mod.label}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${positions[i]} group cursor-pointer transition-all duration-300`}
            style={{
              width: 'clamp(68px, 15.5vmin, 125px)',
              height: 'clamp(68px, 15.5vmin, 125px)',
              animation: `honeycomb 2.1s ease forwards`,
              animationDelay: `${i * 0.1}s`,
              opacity: 0, 
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
          </div>
        ))}
      </div>
    </section>
  );
}
