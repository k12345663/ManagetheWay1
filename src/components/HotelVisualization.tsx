import React from 'react';
import { Hotel } from '../types';
import Floor from './Floor';

interface HotelVisualizationProps {
  hotel: Hotel;
}

const HotelVisualization: React.FC<HotelVisualizationProps> = ({ hotel }) => {
  // Display floors in reverse order (top to bottom)
  const sortedFloors = [...hotel.floors].sort((a, b) => b.floorNumber - a.floorNumber);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-blue-900 border-b pb-2 flex items-center">
        <span className="mr-2">🏨</span>
        Hotel Layout
      </h2>
      <div className="space-y-8">
        {sortedFloors.map((floor) => (
          <Floor key={floor.floorNumber} floor={floor} />
        ))}
      </div>
      <div className="mt-6 flex items-center justify-center gap-6 bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
          <span className="text-sm font-medium">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
          <span className="text-sm font-medium">Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
          <span className="text-sm font-medium">Selected</span>
        </div>
      </div>
    </div>
  );
};

export default HotelVisualization