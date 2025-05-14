import { Room, Floor, Hotel, BookingResult, BookingFormData } from '../types';

export const initializeHotel = (): Hotel => {
  const floors: Floor[] = [];

  // Floors 1-9 with 10 rooms each
  for (let floorNum = 1; floorNum <= 9; floorNum++) {
    const rooms: Room[] = [];
    for (let roomNum = 1; roomNum <= 10; roomNum++) {
      const roomId = floorNum * 100 + roomNum;
      rooms.push({
        id: roomId,
        floor: floorNum,
        number: roomNum,
        isOccupied: false,
        isSelected: false,
      });
    }
    floors.push({ floorNumber: floorNum, rooms });
  }

  // Floor 10 with 7 rooms
  const floor10Rooms: Room[] = [];
  for (let roomNum = 1; roomNum <= 7; roomNum++) {
    const roomId = 1000 + roomNum;
    floor10Rooms.push({
      id: roomId,
      floor: 10,
      number: roomNum,
      isOccupied: false,
      isSelected: false,
    });
  }
  floors.push({ floorNumber: 10, rooms: floor10Rooms });

  return { floors };
};

export const getAvailableRooms = (hotel: Hotel): Room[] => {
  return hotel.floors
    .sort((a, b) => a.floorNumber - b.floorNumber) // Sort by floor number to prioritize lower floors
    .flatMap((floor) => 
      floor.rooms.filter((room) => !room.isOccupied)
    );
};

export const resetAllBookings = (hotel: Hotel): Hotel => {
  const updatedFloors = hotel.floors.map((floor) => ({
    ...floor,
    rooms: floor.rooms.map((room) => ({
      ...room,
      isOccupied: false,
      isSelected: false,
    })),
  }));

  return { floors: updatedFloors };
};

export const generateRandomOccupancy = (hotel: Hotel): Hotel => {
  const updatedFloors = hotel.floors.map((floor) => ({
    ...floor,
    rooms: floor.rooms.map((room) => ({
      ...room,
      isOccupied: Math.random() > 0.6,
      isSelected: false,
    })),
  }));

  return { floors: updatedFloors };
};

export const calculateTravelTime = (room1: Room, room2: Room): number => {
  // Vertical travel: 2 minutes per floor
  const verticalTime = Math.abs(room1.floor - room2.floor) * 2;
  
  // Horizontal travel: 1 minute per room
  const horizontalTime = Math.abs(room1.number - room2.number);
  
  return verticalTime + horizontalTime;
};

export const bookRooms = (hotel: Hotel, bookingData: BookingFormData): BookingResult => {
  const { numRooms, guestName } = bookingData;

  if (numRooms <= 0 || numRooms > 5) {
    throw new Error('Number of rooms must be between 1 and 5');
  }

  const availableRooms = getAvailableRooms(hotel);
  
  if (availableRooms.length < numRooms) {
    throw new Error(`Not enough available rooms. Only ${availableRooms.length} rooms available.`);
  }

  // Group available rooms by floor, prioritizing lower floors
  const roomsByFloor = new Map<number, Room[]>();
  availableRooms.forEach((room) => {
    if (!roomsByFloor.has(room.floor)) {
      roomsByFloor.set(room.floor, []);
    }
    roomsByFloor.get(room.floor)?.push(room);
  });

  // Sort rooms on each floor by room number
  roomsByFloor.forEach((rooms) => {
    rooms.sort((a, b) => a.number - b.number);
  });

  let selectedRooms: Room[] = [];
  let bestTotalTime = Infinity;
  
  // Try to find consecutive rooms on the same floor first, starting from lower floors
  for (const [floor, rooms] of roomsByFloor.entries()) {
    if (rooms.length >= numRooms) {
      const consecutiveRooms = findBestConsecutiveRooms(rooms, numRooms);
      if (consecutiveRooms) {
        const totalTime = calculateTotalTravelTime(consecutiveRooms);
        if (totalTime < bestTotalTime) {
          selectedRooms = consecutiveRooms;
          bestTotalTime = totalTime;
        }
      }
    }
  }

  // If we couldn't find enough rooms on a single floor
  if (selectedRooms.length === 0) {
    // Try different combinations of rooms across floors, prioritizing lower floors
    const combinations = findBestRoomCombination(
      Array.from(roomsByFloor.values()).flat().sort((a, b) => a.floor - b.floor),
      numRooms
    );
    selectedRooms = combinations;
  }

  // Calculate travel time breakdown
  const travelTimeBreakdown: string[] = [];
  let totalTravelTime = 0;

  for (let i = 0; i < selectedRooms.length - 1; i++) {
    const currentRoom = selectedRooms[i];
    const nextRoom = selectedRooms[i + 1];
    const travelTime = calculateTravelTime(currentRoom, nextRoom);
    totalTravelTime += travelTime;

    const verticalTime = Math.abs(currentRoom.floor - nextRoom.floor) * 2;
    const horizontalTime = Math.abs(currentRoom.number - nextRoom.number);

    let breakdown = `From Room ${currentRoom.id} to Room ${nextRoom.id}: `;
    
    if (verticalTime > 0) {
      breakdown += `${verticalTime} min (${Math.abs(currentRoom.floor - nextRoom.floor)} floors)`;
    }
    
    if (verticalTime > 0 && horizontalTime > 0) {
      breakdown += ' + ';
    }
    
    if (horizontalTime > 0) {
      breakdown += `${horizontalTime} min (${Math.abs(currentRoom.number - nextRoom.number)} rooms)`;
    }
    
    breakdown += ` = ${travelTime} min`;
    travelTimeBreakdown.push(breakdown);
  }

  return {
    rooms: selectedRooms,
    totalTravelTime,
    travelTimeBreakdown,
    guestName
  };
};

const findBestConsecutiveRooms = (rooms: Room[], count: number): Room[] | null => {
  if (rooms.length < count) return null;

  let bestRooms: Room[] | null = null;
  let minGap = Infinity;

  for (let i = 0; i <= rooms.length - count; i++) {
    const currentRooms = rooms.slice(i, i + count);
    const totalGap = currentRooms[currentRooms.length - 1].number - currentRooms[0].number;
    
    if (totalGap < minGap) {
      minGap = totalGap;
      bestRooms = currentRooms;
    }
  }

  return bestRooms;
};

const calculateTotalTravelTime = (rooms: Room[]): number => {
  let totalTime = 0;
  for (let i = 0; i < rooms.length - 1; i++) {
    totalTime += calculateTravelTime(rooms[i], rooms[i + 1]);
  }
  return totalTime;
};

const findBestRoomCombination = (availableRooms: Room[], count: number): Room[] => {
  let bestCombination: Room[] = [];
  let minTotalTime = Infinity;

  const findCombinations = (current: Room[], remaining: Room[], start: number) => {
    if (current.length === count) {
      const totalTime = calculateTotalTravelTime(current);
      if (totalTime < minTotalTime) {
        minTotalTime = totalTime;
        bestCombination = [...current];
      }
      return;
    }

    for (let i = start; i < remaining.length; i++) {
      findCombinations([...current, remaining[i]], remaining, i + 1);
    }
  };

  findCombinations([], availableRooms, 0);
  return bestCombination;
};