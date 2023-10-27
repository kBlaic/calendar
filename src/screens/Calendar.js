import React, { useState, useEffect } from "react";
import axios from 'axios';
import Calendar from "react-calendar";
import '../calendar.css'

const CalendarScreen = () => {
   const [events, setEvents] = useState([]);
   const [selectedMonth, setSelectedMonth] = useState(new Date());

   useEffect(() => {
      const fetchEventsForMonth = async () => {
         try {
            const month = selectedMonth.getMonth() + 1;
            const year = selectedMonth.getFullYear();
            const daysInMonth = new Date(year, month, 0).getDate();

            const requests = Array.from({ length: daysInMonth }, (_, index) => {
               const day = index + 1;
               return axios.get(`https://byabbe.se/on-this-day/${month}/${day}/events.json`);
            });

            const responses = await Promise.all(requests);
            const monthEvents = responses.map(response => response.data.events[0]).filter(Boolean);
            setEvents(monthEvents);
         } catch (error) {
            console.error('Error fetching events: ', error);
         }
      };

      fetchEventsForMonth();
   }, [selectedMonth]);

   const tileContent = ({ date, view }) => {
         const isInCurrentMonth = date.getMonth() === selectedMonth.getMonth();
         if (!isInCurrentMonth) {
            return null;
         }

         const index = date.getDate() - 1;
         const dayEvent = events[index] ? events[index].description : '';

         return (
            <div className="day-tile">{dayEvent}</div>
         );
   };

   const tileDisabled = ({ date, view }) => {
      if (view === 'month') {
         const currentMonth = selectedMonth.getMonth();
         return date.getMonth() !== currentMonth;
      }
      return false;
   };

   const onChangeMonth = date => {
      setSelectedMonth(date.activeStartDate);
   };

   return (
      <div>
         <h2>{selectedMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</h2>
         <Calendar
            onActiveStartDateChange={onChangeMonth}
            tileContent={tileContent}
            tileDisabled={tileDisabled}
            locale="en"
            formatShortWeekday={(locale, date) => new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date)}
         />
      </div>
   )
};

export default CalendarScreen;