import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import "./Honeycomb.css";

const modules = [
  { label: "HR", color: "bg-white", border: "border-[#FF6B6B]" },
  { label: "B", color: "bg-white", border: "border-[#FFD93D]" },
  { label: "C", color: "bg-white", border: "border-[#6BCB77]" },
  { label: "D", color: "bg-white", border: "border-[#4D96FF]" },
  { label: "E", color: "bg-white", border: "border-[#C780FA]" },
  { label: "Files", color: "bg-white", border: "border-[#FFA600]" },
  { label: "Logo", color: "bg-white", border: "border-[#00C2CB]" },
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

  return (
    <section className="flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 h-screen overflow-hidden">
      <div className="relative w-[360px] h-[320px]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-gradient-to-r from-purple-400 to-pink-600 blur-[100px] opacity-20 rounded-full w-[300px] h-[300px] animate-pulse" />
        </div>
        
        {modules.map((mod, i) => {
          const isHR = mod.label === "HR";
          const isFiles = mod.label === "Files";

          return (
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
                rotate: { type: "spring", stiffness: 100 }
              }}
              whileHover={{ 
                scale: 1.15,
                zIndex: 50,
                transition: { duration: 0.3 }
              }}
              className={`absolute left-1/2 top-1/2
                ${positions[i]}
                transition-all duration-300
                group cursor-pointer
              `}
              style={{ width: 110, height: 110 }}
              onClick={() => {
                if (isHR) navigate("/dashboard");
                else if (isFiles) navigate("/files");
              }}
            >
              <div
                className={`
                  hexagon
                  flex items-center justify-center
                  w-full h-full
                  text-2xl font-extrabold
                  shadow-xl
                  transition-all duration-300
                  ${isHR
                    ? "bg-white group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-green-600 group-hover:text-white"
                    : isFiles
                    ? "bg-white group-hover:bg-gradient-to-r group-hover:from-yellow-300 group-hover:to-yellow-500 group-hover:text-white"
                    : mod.color
                  }
                `}
              >
                {mod.label}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}