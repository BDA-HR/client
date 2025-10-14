import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

function SettingsHeader() {
  return (
    <div className="flex items-center gap-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2"
      >
        <Settings className="w-5 h-5 text-green-600" />
        <motion.h1 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold bg-gradient-to-r from-green-500 to-green-900 bg-clip-text text-transparent dark:text-white"
        >
          Settings
        </motion.h1>
      </motion.div>
    </div>
  )
}

export default SettingsHeader