"use client";

export default function QuantityInput({ value, onChange, max }) {
  const handleDecrement = () => {
    if (value > 1) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="flex items-center">
      <button
        type="button"
        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-l-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        onClick={handleDecrement}
        disabled={value <= 1}
      >
        -
      </button>
      <span className="px-4 py-1 border-t border-b border-gray-300 dark:border-gray-600">
        {value}
      </span>
      <button
        type="button"
        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-r-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        onClick={handleIncrement}
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
}
