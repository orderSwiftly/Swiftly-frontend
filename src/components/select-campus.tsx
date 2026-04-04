'use client';

import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import Image from 'next/image';

import { GetCampusList, selectCampus } from '@/lib/campus';
import { toast } from 'react-hot-toast';

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
  const [campuses, setCampuses] = useState<Institution[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCampuses = async () => {
      const res = await GetCampusList();
      setCampuses(res.data.institutions || []);
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
      onFinish();
    } catch {
      toast.error('Failed to select campus. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fixed inset-0 z-[997] bg-white flex flex-col items-center pt-8 px-6 pb-24 overflow-y-auto pry-ff">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Select Your Campus
      </h2>

      <div className="relative mb-6 w-full max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search campus..."
          className="w-full pl-11 pr-4 py-3 border focus:outline-none focus:border-[var(--acc-clr)] rounded-xl"
        />
      </div>

      <div className="grid grid-cols-2 gap-5 w-full max-w-md">
        {filteredCampuses.map(campus => (
          <button
            key={campus._id}
            disabled={loading}
            onClick={() => handleSelect(campus)}
            className="flex flex-col items-center p-4 border rounded-2xl cursor-pointer hover:shadow-md transition-shadow disabled:opacity-50"
          >
            <div className="relative w-20 h-20 mb-3">
              <Image
                src={campus.logo || '/campus_avatar.png'}
                alt={campus.name}
                fill
                className="object-cover"
              />
            </div>

            <h3 className="font-bold text-center">{campus.name}</h3>
            <p className="text-sm text-gray-400 text-center">
              {campus.address.city}, {campus.address.state}
            </p>
          </button>
        ))}
      </div>
    </main>
  );
};

export default SelectCampus;
