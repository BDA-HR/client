// src/pages/ht/Attendance/TimeClockFormContainer.tsx
import React, { useState, useEffect } from 'react';
import TimeClockForm from './TimeClockForm';
import type { ShiftSchedule } from './TimeClockForm';

// Default schedule configuration
const defaultSchedule: ShiftSchedule = {
  Monday: { clockInStart: '08:00', clockInEnd: '10:00', clockOutStart: '17:00', clockOutEnd: '19:00' },
  Tuesday: { clockInStart: '08:00', clockInEnd: '10:00', clockOutStart: '17:00', clockOutEnd: '19:00' },
  Wednesday: { clockInStart: '08:00', clockInEnd: '10:00', clockOutStart: '17:00', clockOutEnd: '19:00' },
  Thursday: { clockInStart: '08:00', clockInEnd: '10:00', clockOutStart: '17:00', clockOutEnd: '19:00' },
  Friday: { clockInStart: '08:00', clockInEnd: '10:00', clockOutStart: '17:00', clockOutEnd: '19:00' },
  Saturday: { clockInStart: '', clockInEnd: '', clockOutStart: '', clockOutEnd: '' },
  Sunday: { clockInStart: '', clockInEnd: '', clockOutStart: '', clockOutEnd: '' },
};

// Load schedule from localStorage or use default
const loadSchedule = (): ShiftSchedule => {
  const saved = localStorage.getItem('shiftSchedule');
  return saved ? JSON.parse(saved) : defaultSchedule;
};

const TimeClockFormContainer: React.FC = () => {
  const [schedule, setSchedule] = useState<ShiftSchedule>(loadSchedule());
  
  // Save to localStorage whenever schedule changes
  useEffect(() => {
    localStorage.setItem('shiftSchedule', JSON.stringify(schedule));
  }, [schedule]);

  const handleScheduleChange = (newSchedule: ShiftSchedule) => {
    setSchedule(newSchedule);
    // Add additional save logic here (API call, etc.)
    console.log("Schedule saved:", newSchedule);
  };

  const handleClose = () => {
    console.log("Closing form");
    // Add navigation logic here (e.g., history.goBack())
  };

  return (
    <TimeClockForm 
      schedule={schedule}
      onScheduleChange={handleScheduleChange}
      onClose={handleClose}
    />
  );
};

export default TimeClockFormContainer;