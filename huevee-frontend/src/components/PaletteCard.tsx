import React, { useState } from 'react';

type PaletteProps = {
  title: string;
  theme: string;
  description: string;
  colors: { hex: string; position: number }[];
};

const PaletteCard: React.FC<PaletteProps> = ({ title, theme, description, colors }) => {
  const [expanded, setExpanded] = useState(false);
  const [copiedColorIndex, setCopiedColorIndex] = useState<number | null>(null);
  const [copiedAllHex, setCopiedAllHex] = useState(false);
  const maxChars = 35; // some limit to keep card sizes consistent
  const needsTruncate = description.length > maxChars;
  const displayText = expanded ? description : description.slice(0, maxChars);

  const handleColorClick = (hex: string, index: number) => {
    navigator.clipboard.writeText(hex);
    setCopiedColorIndex(index);
    setTimeout(() => setCopiedColorIndex(null), 2000); // Show checkmark for 2 seconds
  };

  const handleCopyAllHex = () => {
    const allHex = colors.map(c => c.hex).join(', ');
    navigator.clipboard.writeText(allHex);
    setCopiedAllHex(true);
    setTimeout(() => setCopiedAllHex(false), 2000); // Show checkmark for 2 seconds
  };

  return (
    <div className={"bg-white rounded-lg shadow-md p-4 mb-4 flex flex-col transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer " + (expanded ? '' : 'h-30') }>
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-gray-500">{theme}</p>
        <p className="mt-2 text-gray-700">
          {displayText}
          {!expanded && needsTruncate && '...'}
          {needsTruncate && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-indigo-600 underline ml-1"
            >
              {expanded ? 'less' : 'more'}
            </button>
          )}
        </p>
      </div>
      <div className="flex items-center mt-4 gap-2">
        <div className="flex gap-2">
          {colors.map((color, index) => (
            <div
              key={index}
              className="relative group"
              onClick={() => handleColorClick(color.hex, index)}
            >
              <div
                className="w-10 h-10 rounded cursor-pointer transition-all duration-200 hover:shadow-lg"
                style={{ 
                  backgroundColor: color.hex,
                  border: copiedColorIndex === index ? '2px solid #10b981' : 'none'
                }}
                title={color.hex}
              />
              {copiedColorIndex === index && (
                <div className="absolute inset-0 flex items-center justify-center rounded bg-black bg-opacity-50 text-white text-sm font-bold">
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={handleCopyAllHex}
          className="ml-2 p-1.5 rounded text-gray-600 hover:bg-gray-200 transition-all duration-200"
          title="Copy all hex codes"
        >
          {copiedAllHex ? (
            <span className="text-green-600 font-bold">✓</span>
          ) : (
            <span className="text-lg">📋</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default PaletteCard;