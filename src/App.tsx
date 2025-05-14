import React, { useState, useEffect } from 'react';
import HotelVisualization from './components/HotelVisualization';
import BookingForm from './components/BookingForm';
import BookingResult from './components/BookingResult';
import { Hotel, BookingResult as BookingResultType, BookingFormData } from './types';
import { 
  initializeHotel, 
  resetAllBookings, 
  generateRandomOccupancy, 
  bookRooms 
} from './utils/hotelUtils';
import { Building } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const [hotel, setHotel] = useState<Hotel>(initializeHotel());
  const [bookingResult, setBookingResult] = useState<BookingResultType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBookRooms = (bookingData: BookingFormData) => {
    try {
      setError(null);
      const result = bookRooms(hotel, bookingData);
      
      const updatedHotel = { ...hotel };
      result.rooms.forEach((selectedRoom) => {
        const floor = updatedHotel.floors.find((f) => f.floorNumber === selectedRoom.floor);
        if (floor) {
          const room = floor.rooms.find((r) => r.id === selectedRoom.id);
          if (room) {
            room.isSelected = true;
            room.isOccupied = true;
          }
        }
      });
      
      setHotel(updatedHotel);
      setBookingResult(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      setBookingResult(null);
    }
  };

  const handleResetBookings = () => {
    setHotel(resetAllBookings(hotel));
    setBookingResult(null);
    setError(null);
  };

  const handleGenerateRandomOccupancy = () => {
    setHotel(generateRandomOccupancy(hotel));
    setBookingResult(null);
    setError(null);
  };

  useEffect(() => {
    document.title = 'Hotel Room Reservation System';
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-blue-900 text-white py-4 shadow-md"
      >
        <div className="container mx-auto px-4 flex items-center">
          <Building className="mr-2" />
          <h1 className="text-2xl font-bold">Hotel Room Reservation System</h1>
        </div>
      </motion.header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:w-2/3"
          >
            <HotelVisualization hotel={hotel} />
          </motion.div>
          
          <div className="lg:w-1/3 space-y-6">
            <BookingForm
              onBookRooms={handleBookRooms}
              onGenerateRandomOccupancy={handleGenerateRandomOccupancy}
              onResetBookings={handleResetBookings}
            />
            
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg"
                role="alert"
              >
                <p className="font-bold">Booking Error</p>
                <p>{error}</p>
              </motion.div>
            )}
            
            {bookingResult && <BookingResult result={bookingResult} />}
          </div>
        </div>
      </main>
      
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800 text-white py-4 mt-8"
      >
        <div className="container mx-auto px-4 text-center">
          <p>Managed and developed by Prathmesh Kolte</p>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;