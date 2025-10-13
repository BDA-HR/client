import { motion } from 'framer-motion';

function SettingsHeader() {
  return (
    <div><motion.h1 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold bg-gradient-to-r from-green-500 to-green-900 bg-clip-text text-transparent dark:text-white"
        >
          Settings
        </motion.h1></div>
  )
}

export default SettingsHeader