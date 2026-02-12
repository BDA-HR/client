import { motion } from 'framer-motion';
import { MapPin, Briefcase, Calendar, Users, Clock } from 'lucide-react';
import { Badge } from '../ui/badge';
import type { Vacancy } from '../../types/vacancy';

interface VacancyDetailHeaderProps {
  vacancy: Vacancy;
}

const VacancyDetailHeader = ({ vacancy }: VacancyDetailHeaderProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysRemaining = () => {
    const today = new Date();
    const closing = new Date(vacancy.closingDate);
    const diff = Math.ceil((closing.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      {/* Title and Status */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{vacancy.title}</h1>
          <p className="text-lg text-gray-600">{vacancy.department}</p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            {vacancy.openings} {vacancy.openings === 1 ? 'Opening' : 'Openings'}
          </Badge>
          {daysRemaining <= 7 && (
            <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
              Closing Soon
            </Badge>
          )}
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-5 h-5 mr-2 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Location</p>
            <p className="font-medium text-gray-900">{vacancy.location}</p>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Briefcase className="w-5 h-5 mr-2 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Type</p>
            <p className="font-medium text-gray-900">{vacancy.type}</p>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-5 h-5 mr-2 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Posted</p>
            <p className="font-medium text-gray-900">{formatDate(vacancy.postedDate)}</p>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-5 h-5 mr-2 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Closing</p>
            <p className={`font-medium ${daysRemaining <= 7 ? 'text-orange-600' : 'text-gray-900'}`}>
              {formatDate(vacancy.closingDate)}
            </p>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-5 h-5 mr-2 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Applicants</p>
            <p className="font-medium text-gray-900">{vacancy.applicants}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VacancyDetailHeader;
