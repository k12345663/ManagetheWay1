export interface Room {
  id: number;
  floor: number;
  number: number;
  isOccupied: boolean;
  isSelected: boolean;
}

export interface Floor {
  floorNumber: number;
  rooms: Room[];
}

export interface Hotel {
  floors: Floor[];
}

export interface BookingResult {
  rooms: Room[];
  totalTravelTime: number;
  travelTimeBreakdown: string[];
  guestName: string;
}

export interface BookingFormData {
  numRooms: number;
  guestName: string;
}