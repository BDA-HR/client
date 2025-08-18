import React, { useState, useEffect } from 'react';

interface AttendanceRecord {
  id: string;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut: string;
  status: 'Present' | 'Absent' | 'Late' | 'Early Departure';
  hoursWorked: number;
}

const AttendanceList = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [filters, setFilters] = useState({ date: '', status: '' });
  const [showFullHistory, setShowFullHistory] = useState(false);

  useEffect(() => {
    // Generate comprehensive mock data
    const mockData: AttendanceRecord[] = [
      {
        id: '1',
        employeeName: 'John Doe',
        date: '2023-10-15',
        clockIn: '09:00',
        clockOut: '17:30',
        status: 'Present',
        hoursWorked: 8.5
      },
      {
        id: '2',
        employeeName: 'Jane Smith',
        date: '2023-10-15',
        clockIn: '09:45',
        clockOut: '17:00',
        status: 'Late',
        hoursWorked: 7.25
      },
      {
        id: '3',
        employeeName: 'Robert Johnson',
        date: '2023-10-15',
        clockIn: '09:00',
        clockOut: '15:30',
        status: 'Early Departure',
        hoursWorked: 6.5
      },
      {
        id: '4',
        employeeName: 'Sarah Williams',
        date: '2023-10-15',
        clockIn: '',
        clockOut: '',
        status: 'Absent',
        hoursWorked: 0
      },
      {
        id: '5',
        employeeName: 'Michael Brown',
        date: '2023-10-15',
        clockIn: '08:50',
        clockOut: '17:40',
        status: 'Present',
        hoursWorked: 8.83
      },
      {
        id: '6',
        employeeName: 'Emily Davis',
        date: '2023-10-14',
        clockIn: '09:30',
        clockOut: '18:00',
        status: 'Late',
        hoursWorked: 8.5
      },
      {
        id: '7',
        employeeName: 'David Wilson',
        date: '2023-10-14',
        clockIn: '09:00',
        clockOut: '16:45',
        status: 'Early Departure',
        hoursWorked: 7.75
      },
      {
        id: '8',
        employeeName: 'Lisa Taylor',
        date: '2023-10-14',
        clockIn: '08:55',
        clockOut: '17:25',
        status: 'Present',
        hoursWorked: 8.5
      },
      {
        id: '9',
        employeeName: 'James Anderson',
        date: '2023-10-13',
        clockIn: '10:15',
        clockOut: '18:30',
        status: 'Late',
        hoursWorked: 8.25
      },
      {
        id: '10',
        employeeName: 'Maria Garcia',
        date: '2023-10-13',
        clockIn: '',
        clockOut: '',
        status: 'Absent',
        hoursWorked: 0
      }
    ];
    setRecords(mockData);
  }, []);

  // Apply filters and determine which records to show
  const filteredRecords = records.filter(record => {
    const matchesDate = filters.date ? record.date === filters.date : true;
    const matchesStatus = filters.status ? record.status === filters.status : true;
    return matchesDate && matchesStatus;
  });

  // Determine records to display (recent or all)
  const displayRecords = showFullHistory 
    ? filteredRecords 
    : filteredRecords.slice(0, 5);

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Present': return 'bg-green-100 text-green-800 border border-green-200';
      case 'Late': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'Early Departure': return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'Absent': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <div className='p-4 md:p-6 bg-gray-50 min-h-screen'>
      <div className="flex justify-between items-center mb-6">
        <h2 className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent text-2xl md:text-3xl font-bold">Attendance <span className='text-gray-900'>list</span></h2>
        <button
          onClick={() => setShowFullHistory(!showFullHistory)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          {showFullHistory ? 'Show Recent Only' : 'View Full History'}
        </button>
      </div>

      <div className="filters flex flex-col md:flex-row justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg shadow-sm">
  <div className="flex-1 min-w-[200px]">
    <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Date</label>
    <input 
      type="date" 
      value={filters.date}
      onChange={e => setFilters({ ...filters, date: e.target.value })}
      className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
    />
  </div>
    <div className="flex-1 min-w-[200px]">
    <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
    <select
      value={filters.status}
      onChange={e => setFilters({ ...filters, status: e.target.value })}
      className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition cursor-pointer"
    >
      <option value="">All Statuses</option>
      <option value="Present">Present</option>
      <option value="Late">Late Arrivals</option>
      <option value="Absent">Absences</option>
      <option value="Early Departure">Early Departures</option>
    </select>
  </div>
  <div className="flex items-end">
    <button
      onClick={() => setFilters({ date: '', status: '' })}
      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
    >
      Clear Filters
    </button>
  </div>
</div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-left">Employee</th>
              <th className="border p-3 text-left">Date</th>
              <th className="border p-3 text-left">Clock In</th>
              <th className="border p-3 text-left">Clock Out</th>
              <th className="border p-3 text-left">Hours</th>
              <th className="border p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {displayRecords.length === 0 ? (
              <tr>
                <td colSpan={6} className="border p-4 text-center text-gray-500">
                  No attendance records found
                </td>
              </tr>
            ) : (
              displayRecords.map(record => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="border p-3 font-medium">{record.employeeName}</td>
                  <td className="border p-3">{record.date}</td>
                  <td className="border p-3">{record.clockIn || '-'}</td>
                  <td className="border p-3">{record.clockOut || '-'}</td>
                  <td className="border p-3">
                    {record.hoursWorked > 0 ? record.hoursWorked.toFixed(2) : '-'}
                  </td>
                  <td className="border p-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!showFullHistory && filteredRecords.length > 5 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Showing 5 of {filteredRecords.length} records. 
          <button 
            className="ml-2 text-green-600 hover:underline"
            onClick={() => setShowFullHistory(true)}
          >
            Show all
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendanceList;