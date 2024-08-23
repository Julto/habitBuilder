import React, { useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Box } from '@mui/material';
import { startOfWeek, endOfWeek, setHours, setMinutes, setSeconds } from 'date-fns';
import './CalendarPage.css';

interface CalendarPageProps {
  setDateRange: (range: { start: Date; end: Date }) => void;
  setSelectedDate: (date: Date) => void;
  selectedDate: Date;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ setDateRange, setSelectedDate, selectedDate }) => {
  useEffect(() => {
    const start = setSeconds(setMinutes(setHours(startOfWeek(selectedDate, { weekStartsOn: 0 }), 0), 0), 0);
    const end = setSeconds(setMinutes(setHours(endOfWeek(selectedDate, { weekStartsOn: 0 }), 23), 59), 59);
    const adjustedEnd = new Date(end);
    adjustedEnd.setDate(end.getDate() - 1);

    setDateRange({ start, end: adjustedEnd });
  }, [selectedDate, setDateRange]);

  const handleDateClick = (date: Date) => {
    const start = setSeconds(setMinutes(setHours(startOfWeek(date, { weekStartsOn: 0 }), 0), 0), 0);
    const end = setSeconds(setMinutes(setHours(endOfWeek(date, { weekStartsOn: 0 }), 23), 59), 59);
    const adjustedEnd = new Date(end);
    adjustedEnd.setDate(end.getDate() - 1);

    setSelectedDate(date);

    setDateRange({ start, end: adjustedEnd });
  };

  return (
    <Box sx={{ maxWidth: '90%', margin: 'auto' }}>
      <Box className="calendar-container">
        <Calendar
          onClickDay={handleDateClick}
          value={selectedDate}
          locale="en-US"
        />
      </Box>
    </Box>
  );
};

export default CalendarPage;
