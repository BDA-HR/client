import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Edit3, Trash2, Users, UserCheck } from 'lucide-react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../ui/accordion';
import type { HolidayListDto } from '../../../types/core/holiday';

interface HolidayListProps {
  holidays: HolidayListDto[];
  loading?: boolean;
  onEdit: (holiday: HolidayListDto) => void;
  onDelete: (holiday: HolidayListDto) => void;
  currentFiscalYear?: string;
}

export const HolidayList = ({
  holidays,
  loading = false,
  onEdit,
  onDelete,
  currentFiscalYear = '2024'
}: HolidayListProps) => {
  // Group holidays by month
  const holidaysByMonth = holidays.reduce((acc, holiday) => {
    const date = new Date(holiday.date);
    const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(holiday);
    return acc;
  }, {} as Record<string, HolidayListDto[]>);

  // Sort months chronologically
  const sortedMonths = Object.keys(holidaysByMonth).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  const getDaySuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const formatHolidayDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const weekday = date.toLocaleString('default', { weekday: 'long' });
    
    return {
      day,
      month,
      year,
      weekday,
      fullDate: `${weekday}, ${day}${getDaySuffix(day)} ${month} ${year}`
    };
  };

  const isUpcomingHoliday = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const holidayDate = new Date(dateString);
    holidayDate.setHours(0, 0, 0, 0);
    
    return holidayDate >= today;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (holidays.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Holidays</h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          No holidays have been added for the current fiscal year ({currentFiscalYear}).
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Holidays by Month using Accordion */}
      <Accordion type="multiple" className="space-y-6">
        {sortedMonths.map((month, monthIndex) => (
          <motion.div
            key={month}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: monthIndex * 0.1 }}
          >
            <AccordionItem value={month} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <AccordionTrigger className="hover:no-underline hover:bg-gray-50 px-6 py-4 border-b data-[state=open]:bg-gray-50">
                <div className="flex items-center gap-3 text-left">
                  <Calendar className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {month}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {holidaysByMonth[month].length} holiday{holidaysByMonth[month].length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-0">
                <div className="divide-y">
                  {holidaysByMonth[month].map((holiday, index) => {
                    const dateInfo = formatHolidayDate(holiday.date);
                    const upcoming = isUpcomingHoliday(holiday.date);
                    
                    return (
                      <HolidayListItem
                        key={holiday.id}
                        holiday={holiday}
                        dateInfo={dateInfo}
                        upcoming={upcoming}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        index={index}
                      />
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
          <div className="text-2xl font-bold text-green-600">
            {holidays.filter(h => isUpcomingHoliday(h.date)).length}
          </div>
          <div className="text-sm text-gray-600">Upcoming Holidays</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
          <div className="text-2xl font-bold text-green-600">
            {holidays.filter(h => new Date(h.date).getMonth() === new Date().getMonth()).length}
          </div>
          <div className="text-sm text-gray-600">This Month</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
          <div className="text-2xl font-bold text-blue-600">
            {holidays.filter(h => h.isPublic).length}
          </div>
          <div className="text-sm text-gray-600">Public Holidays</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
          <div className="text-2xl font-bold text-purple-600">
            {new Set(holidays.map(h => new Date(h.date).getMonth())).size}
          </div>
          <div className="text-sm text-gray-600">Months with Holidays</div>
        </div>
      </motion.div>
    </div>
  );
};

// Individual holiday item
const HolidayListItem = ({ 
  holiday, 
  dateInfo, 
  upcoming, 
  onEdit, 
  onDelete, 
  index
}: {
  holiday: HolidayListDto;
  dateInfo: any;
  upcoming: boolean;
  onEdit: (holiday: HolidayListDto) => void;
  onDelete: (holiday: HolidayListDto) => void;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className="p-6 hover:bg-gray-50 transition-colors duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {/* Date Badge */}
          <div className="text-center min-w-16">
            <div className="bg-green-50 rounded-lg p-3 border border-green-100">
              <div className="text-green-600 font-bold text-lg">
                {dateInfo.day}
              </div>
              <div className="text-green-500 text-xs font-medium uppercase">
                {dateInfo.month}
              </div>
            </div>
            {upcoming && (
              <Badge className="mt-2 bg-green-100 text-green-800 border-green-200 text-xs">
                Upcoming
              </Badge>
            )}
          </div>

          {/* Holiday Details */}
          <div className="flex-1 min-w-0">
            {/* Holiday Name */}
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-lg font-semibold text-gray-900">
                {holiday.name}
              </h4>
              {holiday.isPublic ? (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Public
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 flex items-center gap-1">
                  <UserCheck className="h-3 w-3" />
                  Private
                </Badge>
              )}
              {upcoming && new Date(holiday.date).getMonth() === new Date().getMonth() && (
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  This Month
                </Badge>
              )}
            </div>

            {/* Ethiopian Date */}
            {holiday.dateStrAm && (
              <div className="mb-2">
                <p className="text-sm text-gray-600 font-medium">
                  {holiday.dateStrAm}
                </p>
              </div>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {dateInfo.weekday}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {dateInfo.fullDate}
              </div>
            </div>

            {/* Additional Information */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {holiday.fiscYear && (
                <span>Fiscal Year: {holiday.fiscYear}</span>
              )}
              {holiday.description && (
                <span className="max-w-xs truncate" title={holiday.description}>
                  {holiday.description}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons - Only visible when month is expanded */}
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(holiday)}
            className="flex items-center gap-1"
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(holiday)}
            className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
    </motion.div>
  );
};