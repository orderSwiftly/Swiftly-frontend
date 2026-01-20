'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { GetCampusList, selectCampus } from '@/lib/campus';

export interface Institution {
  _id: string;
  name: string;
  logo: string;
  address: { city: string; state: string; country: string };
}

type Props = {
  onFinish: () => void;
};

const SelectCampus: React.FC<Props> = ({ onFinish }) => {
  const router = useRouter();
  const [campuses, setCampuses] = useState<Institution[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const res = await GetCampusList();
        setCampuses(res.data.institutions || []);
      } catch (error) {
        console.error('Error fetching campuses:', error);
      }
    };
    fetchCampuses();
  }, []);

  const filteredCampuses = campuses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = async (campus: Institution) => {
    setLoading(true);
    try {
      await selectCampus(campus._id);
      localStorage.setItem('selected-campus', JSON.stringify(campus));
      onFinish(); // ✅ use onFinish prop
    } catch (error) {
      console.error('Error selecting campus:', error);
      alert('Failed to select campus. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fixed inset-0 z-[997] bg-white flex flex-col items-center pt-8 px-6 pb-24 overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 text-center pry-ff mb-4">Select Your Campus</h2>
      <div className="relative mb-6 w-full max-w-md">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center sec-ff">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search campus..."
          className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl sec-ff focus:outline-none focus:ring-2 focus:ring-[#6FCF97] focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 gap-5 w-full max-w-md">
        {filteredCampuses.length > 0 ? (
          filteredCampuses.map(campus => (
            <button
              key={campus._id}
              onClick={() => handleSelect(campus)}
              disabled={loading}
              className="group flex flex-col items-center p-4 border border-gray-200 rounded-2xl hover:border-[#6FCF97] cursor-pointer"
            >
              <div className="relative mb-3 w-20 h-20 overflow-hidden">
                <Image
                  src={campus.logo && campus.logo.startsWith('http') ? campus.logo : '/campus_avatar.png'}
                  alt={campus.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-bold text-gray-800 pry-ff text-center">{campus.name}</h3>
              <p className="text-gray-400 text-sm sec-ff text-center">
                {campus.address.city}, {campus.address.state}
              </p>
            </button>
          ))
        ) : (
          <p className="col-span-2 text-center text-gray-500">No campuses found.</p>
        )}
      </div>
    </main>
  );
};

export default SelectCampus;
