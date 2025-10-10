import { motion } from 'framer-motion'
import SettingsHeader from '../../components/hr/settings components/SettingsHeader';


// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};
function PageSettings() {
  return (
     <>
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`w-full h-full flex flex-col space-y-6`}>
          <SettingsHeader />
            <div>Settings content goes here...</div>
      </motion.section> 
      
      </>
    )
}



export default PageSettings