import { useState, useRef, useEffect } from "react";

const CustomSelect = ({ options, value, onChange, placeholder, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative w-full min-w-[150px]" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-white border ${isOpen ? "border-black ring-1 ring-black/5" : "border-gray-200"
          } hover:border-gray-300 text-gray-900 font-medium rounded-xl px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:border-black focus:ring-1 focus:ring-black/5 shadow-sm`}
      >
        <div className="flex items-center gap-2 truncate">
          {icon && <span className="text-gray-400 flex-shrink-0">{icon}</span>}
          <span className={!selectedOption ? "text-gray-400" : ""}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""
            }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-gray-100 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2 text-sm transition-colors flex items-center justify-between group ${value === option.value
                  ? "bg-gray-50/80 font-semibold text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium"
                }`}
            >
              <div className="flex items-center gap-2 truncate">
                {option.icon && (
                  <span className={value === option.value ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600"}>
                    {option.icon}
                  </span>
                )}
                {option.label}
              </div>

              {/* Checkmark for selected item */}
              {value === option.value && (
                <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
