import { Button } from '../../components/ui/button'
import StatsCards from '../../components/dashboard/StatsCards'
import UpcomingEvents from '../../components/dashboard/UpcomingEvents'
import RecentActivity from '../../components/dashboard/RecentActivity'
import PendingActivity from '../../components/dashboard/PendingActivity'
import { dashboardMetrics, departments, employeeStatusData, timeOffRequests, attendanceApprovals, recentActivities, upcomingEvents } from '../../data/data'
import { motion } from 'framer-motion';
import { Plus, RefreshCw, FileDown } from 'lucide-react';
// import EmployeeStatus from '../components/dashboard/EmployeeStatus'
import DepartmentChart from '../../components/dashboard/DepartmentChart'
import EmployeeStatusChart from '../../components/dashboard/EmployeeChart'


function Dashboard() {
    const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
      },
    },
  };
    const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <section className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, <span className='text-primary-600'>John</span></h1>
          <p className="mt-1 text-sm text-gray-500">Here is the overview of the key metrics and activities.</p>
        </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button
              variant="outline"
              size="sm"
            >
              <RefreshCw size={16} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
            >
              <FileDown size={16} />
              Export
            </Button>
            <Button
              size="sm"
              className='bg-primary-700'
            >
              <Plus size={16} />
              New Employee
            </Button>
          </div>
      </section>
      <motion.div variants={itemVariants}>
        <StatsCards
          totalEmployees={dashboardMetrics.totalEmployees}
          activeEmployees={dashboardMetrics.activeEmployees}
          onLeaveEmployees={dashboardMetrics.onLeaveEmployees}
          openPositions={dashboardMetrics.openPositions}
          upcomingTrainings={dashboardMetrics.upcomingTrainings}
          pendingAppraisals={dashboardMetrics.pendingAppraisals}
        />
      </motion.div>
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6"
      >
        <EmployeeStatusChart data={employeeStatusData} />
        <DepartmentChart departments={departments} />
      </motion.div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2"
        >
<PendingActivity
  timeOffRequests={timeOffRequests}
  attendanceApprovals={attendanceApprovals}
/><motion.div variants={itemVariants} className="mt-6">
<RecentActivity activities={recentActivities} />      </motion.div>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="lg:col-span-1"
        >
          <div className="sticky top-0">
<UpcomingEvents events={upcomingEvents} />          </div>
        </motion.div>
      </div>

    </motion.div>
  )
}

export default Dashboard