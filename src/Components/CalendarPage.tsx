import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Box } from '@mui/material';
import { startOfWeek, endOfWeek, setHours, setMinutes, setSeconds } from 'date-fns';
import './CalendarPage.css'; // Import custom CSS for styling

interface CalendarPageProps {
  setDateRange: (range: { start: Date; end: Date }) => void;
  setSelectedDate: (date: Date) => void;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ setDateRange, setSelectedDate }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    // When the component mounts, set the initial date range for the current week
    const start = setSeconds(setMinutes(setHours(startOfWeek(currentDate, { weekStartsOn: 0 }), 0), 0), 0);
    const end = setSeconds(setMinutes(setHours(endOfWeek(currentDate, { weekStartsOn: 0 }), 23), 59), 59);
    const adjustedEnd = new Date(end);
    adjustedEnd.setDate(end.getDate() - 1); // Adjust to end of Saturday

    setDateRange({ start, end: adjustedEnd });
  }, [currentDate, setDateRange]);

  const handleDateClick = (date: Date) => {
    // Calculate the start of the week (Sunday) at midnight
    const start = setSeconds(setMinutes(setHours(startOfWeek(date, { weekStartsOn: 0 }), 0), 0), 0);
    
    // Calculate the end of the week (Saturday) at 23:59:59
    const end = setSeconds(setMinutes(setHours(endOfWeek(date, { weekStartsOn: 0 }), 23), 59), 59);
    const adjustedEnd = new Date(end);
    adjustedEnd.setDate(end.getDate() - 1); // Adjust to end of Saturday

    // Update the selected date
    setSelectedDate(date);

    // Update the selected date range to cover the entire week of the clicked date
    setDateRange({ start, end: adjustedEnd });
  };

  return (
    <Box sx={{ maxWidth: '90%', margin: 'auto' }}>
      <Box className="calendar-container">
        <Calendar
          onClickDay={handleDateClick} // Set the date range and selected date when a day is clicked
          locale="en-US"
        />
      </Box>
    </Box>
  );
};

export default CalendarPage;
