import React, { useState, useEffect } from 'react';

interface TimesheetEntry {
  date: string;
  clockIn: string;
  clockOut: string;
  regularHours: number;
  overtimeHours: number;
}

const Timesheet = () => {
  const [weekStart, setWeekStart] = useState<string>('2023-10-09');
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);
  const [submissionStatus, setSubmissionStatus] = useState<'draft' | 'submitted' | 'approved'>('draft');

  // Generate sample entries when week changes
  useEffect(() => {
    const generateEntries = () => {
      const startDate = new Date(weekStart);
      const weekEntries: TimesheetEntry[] = [];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        // Generate random times for demonstration
        const clockInHour = 8 + Math.floor(Math.random() * 2); // 8-9 AM
        const clockOutHour = 16 + Math.floor(Math.random() * 3); // 4-6 PM
        
        const entry: TimesheetEntry = {
          date: date.toISOString().split('T')[0],
          clockIn: `${clockInHour.toString().padStart(2, '0')}:00`,
          clockOut: `${clockOutHour.toString().padStart(2, '0')}:30`,
          regularHours: clockOutHour - clockInHour,
          overtimeHours: Math.max(0, (clockOutHour - clockInHour) - 8)
        };
        
        weekEntries.push(entry);
      }
      
      setEntries(weekEntries);
    };

    generateEntries();
  }, [weekStart]);

  // Calculate total hours
  const calculateHours = () => {
    return entries.reduce((totals, entry) => {
      totals.totalRegular += entry.regularHours;
      totals.totalOvertime += entry.overtimeHours;
      return totals;
    }, { totalRegular: 0, totalOvertime: 0 });
  };

  const handleSubmit = () => {
    setSubmissionStatus('submitted');
  };

  const { totalRegular, totalOvertime } = calculateHours();

  return (
    <div className="timesheet p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <div className="timesheet-header flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">
          Timesheet: {weekStart} to {getWeekEnd(weekStart)}
        </h3>
        <select
          value={weekStart}
          onChange={e => setWeekStart(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="2023-10-09">Oct 9-15, 2023</option>
          <option value="2023-10-02">Oct 2-8, 2023</option>
          <option value="2023-10-16">Oct 16-22, 2023</option>
        </select>
      </div>

      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Date</th>
            <th className="border p-2 text-left">Clock In</th>
            <th className="border p-2 text-left">Clock Out</th>
            <th className="border p-2 text-left">Regular Hours</th>
            <th className="border p-2 text-left">Overtime</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
              <td className="border p-2">{formatDate(entry.date)}</td>
              <td className="border p-2">{entry.clockIn}</td>
              <td className="border p-2">{entry.clockOut}</td>
              <td className="border p-2">{entry.regularHours}</td>
              <td className="border p-2">{entry.overtimeHours}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="timesheet-summary mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="font-bold">Total Regular Hours: {totalRegular}</p>
        <p className="font-bold">Total Overtime Hours: {totalOvertime}</p>
      </div>

      <div className="timesheet-actions mt-6 flex items-center gap-4">
        <button
          className={`px-4 py-2 rounded ${
            submissionStatus === 'draft' 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
          disabled={submissionStatus !== 'draft'}
          onClick={handleSubmit}
        >
          {submissionStatus === 'draft' ? 'Submit for Approval' : 'Submitted'}
        </button>
        <span className={`status ${
          submissionStatus === 'draft' ? 'text-yellow-600' :
          submissionStatus === 'submitted' ? 'text-blue-600' : 'text-green-600'
        } font-bold`}>
          Status: {submissionStatus.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

// Helper functions
function getWeekEnd(startDate: string): string {
  const date = new Date(startDate);
  date.setDate(date.getDate() + 6);
  return date.toISOString().split('T')[0];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
}

export default Timesheet;