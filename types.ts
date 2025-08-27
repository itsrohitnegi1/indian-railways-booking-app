
export enum TrainClass {
  SLEEPER = 'Sleeper (SL)',
  AC3 = 'AC 3 Tier (3A)',
  AC2 = 'AC 2 Tier (2A)',
  AC1 = 'AC 1st Class (1A)',
  GENERAL = 'General (GN)',
}

export interface SeatAvailability {
  class: TrainClass;
  seats: number;
  fare: number;
}

export interface Train {
  id: string;
  trainNumber: string;
  trainName: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  availability: SeatAvailability[];
}

export interface Passenger {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
}

export interface Booking {
  id: string;
  train: Train;
  passengers: Passenger[];
  bookedClass: TrainClass;
  date: string;
  totalFare: number;
  status: 'Confirmed' | 'Cancelled';
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
    isLoading?: boolean;
}
