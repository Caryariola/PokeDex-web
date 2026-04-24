export default function StatSlider({ label, field, color, value, onChange }) {
  return (
    <div className="space-y-1">
 
      {/* Top row: label on the left, current value on the right */}
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-black uppercase text-gray-400">
          {label}
        </label>
        {/* value changes color depending on which stat it is */}
        <span className={`text-xs font-bold ${color}`}>{value}</span>
      </div>
 
      {/* The actual range slider input */}
      <input
        type="range"
        min="1"
        max="255"
        value={value}
        // When the user moves the slider, call onChange with the new value
        onChange={(e) => onChange(field, e.target.value)}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-red-600 bg-gray-200"
      />
    </div>
  );
}