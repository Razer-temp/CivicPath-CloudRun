import { CalendarPlus } from "lucide-react";

interface AddToCalendarProps {
  title: string;
  description: string;
  date: Date;
}

export const AddToCalendar = ({ title, description, date }: AddToCalendarProps) => {
  const generateICS = () => {
    // Format date properly: YYYYMMDDTHHmmssZ
    const formatDate = (d: Date) => {
      return d.toISOString().replace(/-|:|\.\d+/g, '');
    };

    const start = formatDate(date);
    // Make event 1 hour by default
    const endDate = new Date(date.getTime() + 60 * 60 * 1000);
    const end = formatDate(endDate);

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CivicPath//EN',
      'BEGIN:VEVENT',
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={generateICS}
      className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
    >
      <CalendarPlus className="w-4 h-4 text-civic-blue" />
      Add deadline to Calendar
    </button>
  );
};
