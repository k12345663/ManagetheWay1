import React from 'react';
import { BookingResult as BookingResultType } from '../types';
import { Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface BookingResultProps {
  result: BookingResultType | null;
}

const BookingResult: React.FC<BookingResultProps> = ({ result }) => {
  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-xl font-bold mb-6 text-blue-900 border-b pb-2 flex items-center">
        <Clock className="mr-2" />
        Booking Details
      </h2>
      
      <div className="space-y-6">
        <div className="flex items-center text-gray-700 mb-4">
          <User className="mr-2" />
          <span className="font-medium">Guest:</span>
          <span className="ml-2">{result.guestName}</span>
        </div>

        <div>
          <h3 className="font-semibold text-lg text-blue-800 mb-3">Selected Rooms</h3>
          <div className="flex flex-wrap gap-2">
            {result.rooms.map((room) => (
              <motion.div
                key={room.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md font-medium"
              >
                Room {room.id}
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg text-blue-800 mb-3">Travel Time</h3>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-2xl font-bold text-blue-900 mb-4">
              Total: {result.totalTravelTime} minutes
            </p>
            <div className="space-y-2">
              {result.travelTimeBreakdown.map((breakdown, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-3 rounded-md shadow-sm"
                >
                  {breakdown}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingResult;