// src/components/TimeClockDisplay.tsx
import React from 'react';
import type { ShiftSchedule } from '../../pages/hr/attendancepage/TimeClockForm';

interface TimeClockDisplayProps {
  schedule: ShiftSchedule;
}

const TimeClockDisplay: React.FC<TimeClockDisplayProps> = ({ schedule }) => {
  return (
    <div className="time-clock-display bg-white rounded-lg shadow-md p-4">
      <h3 className="text-xl font-semibold mb-4">Current Schedule</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(schedule).map(([day, times]) => (
          <div key={day} className="border rounded-lg p-3">
            <h4 className="font-medium text-lg mb-2">{day}</h4>
            {times.clockInStart ? (
              <div className="space-y-1">
                <p><span className="font-medium">Clock-in:</span> {times.clockInStart} - {times.clockInEnd}</p>
                <p><span className="font-medium">Clock-out:</span> {times.clockOutStart} - {times.clockOutEnd}</p>
              </div>
            ) : (
              <p className="text-gray-500 italic">No schedule</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeClockDisplay;