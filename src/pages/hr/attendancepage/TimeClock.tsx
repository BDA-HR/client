import React, { useState, useEffect } from 'react';

const TimeClock = () => {
  const [clockStatus, setClockStatus] = useState<'in' | 'out'>('in');
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());
  const [message, setMessage] = useState<string>('');
  const [lastClockOut, setLastClockOut] = useState<string | null>(null); // New state for clock-out time

  // Fixed interval using useEffect
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const handleClockAction = () => {
    const action = clockStatus === 'in' ? 'clock-in' : 'clock-out';
    
    // Validate against shift schedule
    const isValid = validateTime(action);
    
    if (isValid) {
      const actionMessage = `Successfully clocked ${action.replace('-', ' ')} at ${currentTime}`;
      setMessage(actionMessage);
      
      // Store clock-out time when user clocks out
      if (action === 'clock-out') {
        setLastClockOut(currentTime);
      }
      
      setClockStatus(clockStatus === 'in' ? 'out' : 'in');
    } else {
      setMessage('Outside scheduled shift hours!');
    }
  };

  const validateTime = (action: string): boolean => {
    const now = new Date();
    const hours = now.getHours();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Example validation: 
    // - Weekdays only (Mon-Fri)
    // - Clock-in allowed 8:30-9:30 AM
    // - Clock-out allowed 4:30-6:30 PM
    
    if (day === 0 || day === 6) { // Weekend
      return false;
    }
    
    if (action === 'clock-in') {
      return hours >= 8 && hours < 10; // 8AM - 10AM
    } 
    
    if (action === 'clock-out') {
      return hours >= 16 && hours < 19; // 4PM - 7PM
    }
    
    return false;
  };

  return (
    <div className="time-clock p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-gray-800 mb-2">{currentTime}</div>
        <p className="text-gray-600">Current Time</p>
      </div>
      
      <button 
        className={`w-full py-4 rounded-lg text-xl font-bold text-white shadow-lg transition-all ${
          clockStatus === 'in' 
            ? 'bg-green-500 hover:bg-green-600' 
            : 'bg-red-500 hover:bg-red-600'
        }`}
        onClick={handleClockAction}
      >
        {clockStatus === 'in' ? 'CLOCK IN' : 'CLOCK OUT'}
      </button>
      
      {message && (
        <div className={`mt-4 p-3 rounded-lg text-center ${
          message.includes('Successfully') 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}
      
      {/* New section to display last clock-out time */}
      {lastClockOut && (
        <div className="mt-4 p-3 bg-purple-100 rounded-lg text-center">
          <p className="text-purple-800 font-medium">
            Last Clock Out: {lastClockOut}
          </p>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-bold text-lg text-blue-800 mb-2">Current Shift Schedule</h4>
        <p className="text-blue-700">Monday - Friday: 9:00 AM - 5:30 PM</p>
        <p className="text-blue-700 mt-1">Clock-in window: 8:30 - 9:30 AM</p>
        <p className="text-blue-700">Clock-out window: 4:30 - 6:30 PM</p>
      </div>
    </div>
  );
};

export default TimeClock;