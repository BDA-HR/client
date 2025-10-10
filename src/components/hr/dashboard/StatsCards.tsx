import React from 'react';
import MetricCard from '../../ui/MetricCard';
import { Users, UserPlus, Clock, Award, BookOpen } from 'lucide-react';

interface StatsCardsProps {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  openPositions: number;
  upcomingTrainings: number;
  pendingAppraisals: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  totalEmployees,
  activeEmployees,
  onLeaveEmployees,
  openPositions,
  upcomingTrainings,
  pendingAppraisals,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <MetricCard
        title="Total Employees"
        value={totalEmployees}
        icon={<Users size={24} className="text-primary-600" />}
        className="border-l-4 px-4 border-l-primary-500"
      />
      <MetricCard
        title="Active Employees"
        value={activeEmployees}
        change={2.5}
        icon={<Users size={24} className="text-success-600" />}
        className="border-l-4 border-l-success-500 px-4"
      />
      <MetricCard
        title="On Leave"
        value={onLeaveEmployees}
        icon={<Clock size={24} className="text-accent-600" />}
        className="border-l-4 border-l-accent-500 px-4"
      />
      <MetricCard
        title="Open Positions"
        value={openPositions}
        change={1.8}
        icon={<UserPlus size={24} className="text-secondary-600" />}
        className="border-l-4 border-l-secondary-500 px-4"
      />
      <MetricCard
        title="Upcoming Trainings"
        value={upcomingTrainings}
        icon={<BookOpen size={24} className="text-primary-600" />}
        className="border-l-4 border-l-primary-500 px-4"
      />
      <MetricCard
        title="Pending Appraisals"
        value={pendingAppraisals}
        icon={<Award size={24} className="text-accent-600" />}
        className="border-l-4 border-l-accent-500 px-4"
      />
    </div>
  );
};

export default StatsCards;