
import React, { useState } from 'react';
import { Train, TrainClass } from '../types';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface TrainCardProps {
  train: Train;
  onBook: (train: Train, selectedClass: TrainClass) => void;
}

export const TrainCard: React.FC<TrainCardProps> = ({ train, onBook }) => {
  const [selectedClass, setSelectedClass] = useState<TrainClass | null>(null);

  const handleBookClick = () => {
    if (selectedClass) {
      onBook(train, selectedClass);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl mb-6">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{train.trainName}</h3>
            <p className="text-sm text-gray-500">{train.trainNumber}</p>
          </div>
          <div className="flex items-center mt-2 sm:mt-0 text-lg font-semibold text-gray-700">
            <div className="text-center">
              <p>{train.departureTime}</p>
              <p className="text-sm font-normal text-gray-500">{train.fromCode}</p>
            </div>
            <div className="mx-4 flex flex-col items-center">
              <span className="text-xs text-gray-400 mb-1">{train.duration}</span>
              <ArrowRightIcon className="w-6 h-6 text-gray-400" />
            </div>
            <div className="text-center">
              <p>{train.arrivalTime}</p>
              <p className="text-sm font-normal text-gray-500">{train.toCode}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold text-gray-600 mb-3">Availability & Fare:</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {train.availability.map((avail) => (
              <div
                key={avail.class}
                onClick={() => setSelectedClass(avail.class)}
                className={`p-3 border rounded-lg text-center cursor-pointer transition-all duration-200 ${
                  selectedClass === avail.class
                    ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-500'
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                }`}
              >
                <p className="font-semibold text-sm text-gray-800">{avail.class}</p>
                {avail.seats > 0 ? (
                  <p className="text-green-600 font-bold text-sm mt-1">AVL {avail.seats}</p>
                ) : (
                  <p className="text-red-600 font-bold text-sm mt-1">WL</p>
                )}
                <p className="text-xs text-gray-500 mt-1">₹{avail.fare}</p>
              </div>
            ))}
          </div>
        </div>

        {selectedClass && (
          <div className="mt-6 text-right">
            <button
              onClick={handleBookClick}
              disabled={train.availability.find(a => a.class === selectedClass)?.seats === 0}