import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

function EducationalQualHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2"
    >
      <GraduationCap className="w-6 h-6 text-green-600" />
      <h1 className="text-2xl font-bold text-black">
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-block"
        >
          <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Educational
          </span>{" "}
          Qualifications
        </motion.span>
      </h1>
    </motion.div>
  );
}

export default EducationalQualHeader;
