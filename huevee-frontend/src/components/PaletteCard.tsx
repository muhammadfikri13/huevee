import React from 'react';

type PaletteProps = {
  title: string;
  theme: string;
  description: string;
  colors: { hex: string; position: number }[];
};

const PaletteCard: React.FC<PaletteProps> = ({ title, theme, description, colors }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-sm text-gray-500">{theme}</p>
      <p className="mt-2 text-gray-700">{description}</p>
      <div className="flex mt-4">
        {colors.map((color, index) => (
          <div
            key={index}
            className="w-10 h-10 rounded mr-2"
            style={{ backgroundColor: color.hex }}
            title={color.hex}
          />
        ))}
      </div>
    </div>
  );
};

export default PaletteCard;