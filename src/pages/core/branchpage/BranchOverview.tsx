// import { motion } from 'framer-motion';
// import { useModule } from '../../../ModuleContext';
// import BranchHeader from '../../../components/core/BranchHeader';
// import BranchOverviewCard from '../../../components/core/BranchOverviewCard';
// import BranchTabs from '../../../components/core/BranchTabs';
// import { Button } from '../../../components/ui/button';
// import { Plus } from 'lucide-react';
// import { useState } from 'react';

// const BranchOverview = () => {
//   const { activeModule } = useModule();
//   const [currentBranchId, setCurrentBranchId] = useState(1);

//   return (
//     <motion.div 
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//       className="space-y-6 p-6"
//     >
//       {/* Header Section */}
//       <section className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
//         <BranchHeader />
//         <div className="flex gap-3">
//           <Button size="sm" className="gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md shadow-emerald-500/20">
//             <Plus size={16} />
//             <span>New Branch</span>
//           </Button>
//         </div>
//       </section>

//       {/* Branch Overview Card */}
//       <BranchOverviewCard 
//         currentBranchId={currentBranchId} 
//         setCurrentBranchId={setCurrentBranchId} 
//       />

//       {/* Tabs for Branch Details */}
//       <BranchTabs />
//     </motion.div>
//   );
// };

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: { 
//     opacity: 1, 
//     transition: { 
//       staggerChildren: 0.1,
//       when: "beforeChildren"
//     } 
//   }
// };

// export default BranchOverview;