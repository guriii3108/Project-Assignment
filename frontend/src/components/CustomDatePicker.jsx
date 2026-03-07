import { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// We override the default styles in index.css

// Custom Input for the DatePicker so it matches our CustomSelect
const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <button
    type="button"
    className="w-full flex items-center justify-between bg-white border border-gray-200 hover:border-gray-300 text-gray-900 font-medium rounded-xl px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:border-black focus:ring-1 focus:ring-black/5 shadow-sm"
    onClick={onClick}
    ref={ref}
  >
    <span className={!value ? "text-gray-400" : "text-gray-900"}>
      {value || placeholder || "Select date..."}
    </span>
    <svg
      className="w-4 h-4 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  </button>
));

CustomInput.displayName = "CustomInput";

const CustomDatePicker = ({ selectedDate, onChange, placeholderText }) => {
  return (
    <div className="w-full min-w-[150px] custom-datepicker-container">
      <DatePicker
        selected={selectedDate}
        onChange={onChange}
        customInput={<CustomInput placeholder={placeholderText} />}
        dateFormat="MMM d, yyyy"
        isClearable
        showPopperArrow={false}
        calendarClassName="border-0 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] rounded-xl font-sans"
      />
    </div>
  );
};

export default CustomDatePicker;
