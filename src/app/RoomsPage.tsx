"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const RoomsPage = () => {
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from('room')
        .select('*');

      if (error) {
        console.error('Error fetching rooms:', error);
      } else {
        setRooms(data);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Rooms</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {rooms.map((room) => (
            <li key={room.id} className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-gray-600 text-2xl font-semibold mb-2">{room.name}</h2>
              <p className="text-gray-600">Room ID: {room.id}</p>
              <p className="text-gray-600">Created At: {new Date(room.created_at).toLocaleString()}</p>
              <p className="text-gray-600">Address: {room.address}</p>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default RoomsPage;