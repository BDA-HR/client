import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import "./Honeycomb.css"; // Hexagon shape

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
  "-translate-x-[84px] translate-y-0",
  "-translate-x-[42px] translate-y-[66px]",
  "translate-x-[42px] translate-y-[66px]",
  "translate-x-[84px] translate-y-0",
  "translate-x-[42px] -translate-y-[66px]",
  "-translate-x-[42px] -translate-y-[66px]",
  "translate-x-0 translate-y-0",
];

export default function Honeycomb() {
  const navigate = useNavigate();

  return (
    <section className="flex items-center justify-center bg-[#f3f3f3] h-screen">
      <div className="relative w-[228px] h-[204px]">
        {modules.map((mod, i) => {
          const isHR = mod.label === "HR";
          const isFiles = mod.label === "Files";

          return (
            <motion.div
              key={mod.label}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: 'easeOut' }}
              className={`absolute left-1/2 top-1/2
                ${positions[i]}
                transition-transform duration-300
                group cursor-pointer
              `}
              style={{ width: 72, height: 72 }}
              onClick={() => {
                if (isHR) {
                  navigate("/dashboard");
                } else if (isFiles) {
                  navigate("/files");
                }
              }}
            >
            <div
            className={`
                hexagon
                flex items-center justify-center
                w-full h-full
                text-lg font-bold
                shadow-2xl
                transition-all duration-300
                group-hover:scale-110
                ${
                isHR
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
