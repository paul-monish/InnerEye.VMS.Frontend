import { forwardRef } from "react";
import DatePickerLib from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, X } from "lucide-react";

const CustomInput = forwardRef(function CustomInput(
  { value, onClick, onClear, hasError },
  ref,
) {
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition bg-white border ${
        hasError
          ? "border-red-400 ring-1 ring-red-100"
          : "border-gray-300 hover:border-gray-400"
      }`}
    >
      <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
      <span
        className={`flex-1 text-sm ${value ? "text-gray-700" : "text-gray-400"}`}
      >
        {value || "Select date"}
      </span>
      {value && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="p-0.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
});

export default function DatePicker({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  error,
}) {
  const selected = value ? new Date(value) : null;

  const handleChange = (date) => {
    if (!date) {
      onChange("");
      return;
    }
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    onChange(`${y}-${m}-${d}`);
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-600">
          {label}
        </label>
      )}
      <DatePickerLib
        selected={selected}
        onChange={handleChange}
        minDate={minDate ? new Date(minDate) : undefined}
        maxDate={maxDate ? new Date(maxDate) : undefined}
        dateFormat="dd MMM yyyy"
        placeholderText="Select date"
        isClearable={false}
        showPopperArrow={false}
        popperPlacement="bottom-start"
        wrapperClassName="!block"
        customInput={
          <CustomInput hasError={!!error} onClear={() => onChange("")} />
        }
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
