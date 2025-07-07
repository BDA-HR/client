// src/pages/ht/Attendance/TimeClockForm.tsx
import React from 'react';

export interface DaySchedule {
  clockInStart: string;
  clockInEnd: string;
  clockOutStart: string;
  clockOutEnd: string;
}

export interface ShiftSchedule {
  [day: string]: DaySchedule;
}

export interface TimeClockFormProps {
  schedule: ShiftSchedule;
  onScheduleChange: (newSchedule: ShiftSchedule) => void;
  onClose: () => void;
}

const TimeClockForm: React.FC<TimeClockFormProps> = ({ 
  schedule, 
  onScheduleChange, 
  onClose 
}) => {
  const [localSchedule, setLocalSchedule] = React.useState<ShiftSchedule>(schedule);
  const [selectedDay, setSelectedDay] = React.useState<string>("Monday");

  const handleTimeChange = (day: string, field: keyof DaySchedule, value: string) => {
    setLocalSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    onScheduleChange(localSchedule);
    onClose();
  };

  return (
    <div className="schedule-form bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Shift Schedule Configuration</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Day to Configure
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(localSchedule).map(day => (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedDay === day
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h5 className="font-semibold text-blue-700 mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Clock-in Window
          </h5>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Start Time</label>
              <input
                type="time"
                value={localSchedule[selectedDay].clockInStart}
                onChange={(e) => handleTimeChange(selectedDay, 'clockInStart', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">End Time</label>
              <input
                type="time"
                value={localSchedule[selectedDay].clockInEnd}
                onChange={(e) => handleTimeChange(selectedDay, 'clockInEnd', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-red-50 rounded-lg border border-red-100">
          <h5 className="font-semibold text-red-700 mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Clock-out Window
          </h5>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Start Time</label>
              <input
                type="time"
                value={localSchedule[selectedDay].clockOutStart}
                onChange={(e) => handleTimeChange(selectedDay, 'clockOutStart', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">End Time</label>
              <input
                type="time"
                value={localSchedule[selectedDay].clockOutEnd}
                onChange={(e) => handleTimeChange(selectedDay, 'clockOutEnd', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Save Schedule
        </button>
      </div>
    </div>
  );
};

export default TimeClockForm;