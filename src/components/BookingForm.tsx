import React, { useState } from 'react';
import { Hotel, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { BookingFormData } from '../types';

interface BookingFormProps {
  onBookRooms: (data: BookingFormData) => void;
  onGenerateRandomOccupancy: () => void;
  onResetBookings: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  onBookRooms,
  onGenerateRandomOccupancy,
  onResetBookings,
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    numRooms: 1,
    guestName: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.guestName.trim()) {
      alert('Please enter guest name');
      return;
    }
    onBookRooms(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-xl font-bold mb-6 text-blue-900 border-b pb-2 flex items-center">
        <Hotel className="mr-2" />
        Room Reservation
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="guestName" className="block text-gray-700 font-medium mb-2">
            Guest Name
          </label>
          <div className="relative">
            <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="guestName"
              className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              value={formData.guestName}
              onChange={(e) => setFormData(prev => ({ ...prev, guestName: e.target.value }))}
              placeholder="Enter guest name"
            />
          </div>
        </div>
        <div>
          <label htmlFor="numRooms" className="block text-gray-700 font-medium mb-2">
            Number of Rooms (1-5)
          </label>
          <input
            type="number"
            id="numRooms"
            min={1}
            max={5}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            value={formData.numRooms}
            onChange={(e) => setFormData(prev => ({ ...prev, numRooms: parseInt(e.target.value, 10) }))}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="bg-blue-900 hover:bg-blue-800 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
          >
            Book Rooms
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            className="bg-amber-600 hover:bg-amber-500 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
            onClick={onGenerateRandomOccupancy}
          >
            Random Occupancy
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            className="bg-gray-600 hover:bg-gray-500 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
            onClick={onResetBookings}
          >
            Reset All
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default BookingForm;