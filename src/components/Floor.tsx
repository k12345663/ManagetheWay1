import React from 'react';
import { Floor as FloorType } from '../types';
import Room from './Room';

interface FloorProps {
  floor: FloorType;
}

const Floor: React.FC<FloorProps> = ({ floor }) => {
  return (
    <div className="relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center shadow-inner">
        <span className="text-sm font-bold text-gray-700">{floor.floorNumber}</span>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
        <div className="flex flex-wrap gap-3">
          {floor.rooms.map((room) => (
            <Room key={room.id} room={room} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Floor