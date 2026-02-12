import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { Vacancy } from '../../types/vacancy';

interface VacancyCardProps {
  vacancy: Vacancy;
}

const VacancyCard = ({ vacancy }: VacancyCardProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-2xl hover:border-green-300 transition-all duration-300 cursor-pointer relative overflow-hidden"
      onClick={() => navigate(`/vacancies/${vacancy.id}`)}
    >
      {/* Hover Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/0 to-green-50/0 group-hover:from-green-50/50 group-hover:to-blue-50/30 transition-all duration-300" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
              {vacancy.title}
            </h3>
            <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              {vacancy.department}
            </p>
          </div>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 font-semibold px-3 py-1">
            {vacancy.openings} {vacancy.openings === 1 ? 'Opening' : 'Openings'}
          </Badge>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-green-600" />
            <span className="font-medium">{vacancy.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Briefcase className="w-4 h-4 mr-2 text-green-600" />
            <span className="font-medium">{vacancy.type}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              <span>Posted {formatDate(vacancy.postedDate)}</span>
            </div>
          </div>
        </div>

        {/* Description Preview */}
        <p className="text-sm text-gray-600 mb-5 line-clamp-2 leading-relaxed">
          {vacancy.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-5 border-t border-gray-100">
          <div className="flex items-center text-sm space-x-1">
            <span className='flex items Center font-medium text-gray-600'>
             Deadline: </span>
            <span className={`font-medium ${daysRemaining <= 7 ? 'text-orange-600' : 'text-gray-600'}`}>
              {vacancy.closingDate} 
            </span>
          </div>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 shadow-md group-hover:shadow-lg transition-all"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/vacancies/${vacancy.id}`);
            }}
          >
            View Details
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default VacancyCard;
