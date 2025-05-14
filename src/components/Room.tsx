import React from 'react';
import { Room as RoomType } from '../types';

interface RoomProps {
  room: RoomType;
}

const Room: React.FC<RoomProps> = ({ room }) => {
  const getStatusClass = () => {
    if (room.isSelected) return 'bg-yellow-500 hover:bg-yellow-600 ring-yellow-300';
    if (room.isOccupied) return 'bg-red-500 hover:bg-red-600 ring-red-300';
    return 'bg-green-500 hover:bg-green-600 ring-green-300';
  };

  return (
    <div
      className={`w-16 h-12 rounded-lg flex items-center justify-center text-white font-medium shadow-lg transition-all transform hover:scale-105 ring-2 ${getStatusClass()}`}
      title={`Room ${room.id} - ${room.isOccupied ? 'Occupied' : room.isSelected ? 'Selected' : 'Available'}`}
    >
      {room.id}
    </div>
  );
};

export default Room