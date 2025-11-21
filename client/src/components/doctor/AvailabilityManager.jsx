import React from 'react';
import { Calendar, Plus, X } from 'lucide-react';

const AvailabilityManager = ({ 
  availability, 
  isEditing, 
  onAvailabilityChange, 
  onAddSlot, 
  onRemoveSlot 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-4">
        Weekly Availability
      </label>
      {isEditing ? (
        <div className="space-y-3">
          {availability.map((slot, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <select
                value={slot.day}
                onChange={(e) => {
                  const newAvailability = [...availability];
                  newAvailability[index].day = e.target.value;
                  onAvailabilityChange(newAvailability);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Mon">Monday</option>
                <option value="Tue">Tuesday</option>
                <option value="Wed">Wednesday</option>
                <option value="Thu">Thursday</option>
                <option value="Fri">Friday</option>
                <option value="Sat">Saturday</option>
                <option value="Sun">Sunday</option>
              </select>
              <input
                type="time"
                value={slot.from}
                onChange={(e) => {
                  const newAvailability = [...availability];
                  newAvailability[index].from = e.target.value;
                  onAvailabilityChange(newAvailability);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-gray-500">to</span>
              <input
                type="time"
                value={slot.to}
                onChange={(e) => {
                  const newAvailability = [...availability];
                  newAvailability[index].to = e.target.value;
                  onAvailabilityChange(newAvailability);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => onRemoveSlot(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={onAddSlot}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Availability Slot</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {availability && availability.length > 0 ? (
            availability.map((slot, index) => (
              <div key={index} className="flex items-center space-x-2 text-gray-900">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{slot.day}:</span>
                <span>{slot.from} - {slot.to}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No availability set</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AvailabilityManager;
