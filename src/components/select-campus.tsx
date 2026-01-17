'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // <-- import router
import { Search, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { GetCampusList, selectCampus } from '@/lib/campus';

export interface Institution {
  _id: string;
  name: string;
  logo: string;
  address: {
    city: string;
    state: string;
    country: string;
  };
}

export default function SelectCampus() {
  const router = useRouter(); // <-- initialize router
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

  const filteredCampuses = campuses.filter((campus) =>
    campus.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = async (campus: Institution) => {
    setLoading(true);
    try {
      await selectCampus(campus._id);
      localStorage.setItem('selected-campus', JSON.stringify(campus));
      router.push('/dashboard'); // <-- redirect to /home
    } catch (error) {
      console.error('Error selecting campus:', error);
      alert('Failed to select campus. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fixed inset-0 z-[997] bg-white flex flex-col items-center pt-8 px-6 pb-24 overflow-y-auto">
      {/* Header */}
      <div className="w-full max-w-md relative mb-6">
        <button className="absolute left-0 top-0 bg-gray-200/70 p-2 rounded-xl">
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        <div className="text-center pt-2">
          <Image
            src="/swiftly.png"
            alt="Swifly Logo"
            width={40}
            height={40}
            className="mx-auto mb-2"
          />
        </div>
      </div>

      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center pry-ff mb-4">
          Select Your Campus
        </h2>

        {/* Search */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center sec-ff">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl sec-ff focus:outline-none focus:ring-2 focus:ring-[#6FCF97] focus:border-transparent"
            placeholder="Search campus..."
          />
        </div>

        {/* Campuses */}
        <div className="grid grid-cols-2 gap-5">
          {filteredCampuses.length > 0 ? (
            filteredCampuses.map((campus) => (
              <button
                key={campus._id}
                onClick={() => handleSelect(campus)}
                disabled={loading}
                className="group flex flex-col items-center p-4 border border-gray-200 rounded-2xl hover:border-[#6FCF97] cursor-pointer"
              >
                <div className="relative mb-3 w-20 h-20 overflow-hidden group-hover:border-[#6FCF97]">
                  <Image
                    src={
                      campus.logo && campus.logo.startsWith('http')
                        ? campus.logo
                        : '/campus_avatar.png'
                    }
                    alt={campus.name}
                    fill
                    className="object-cover"
                    sizes="80px"
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
      </div>

      {/* Footer */}
      <div className="mt-6">
        <p className="text-xs text-gray-600 text-center sec-ff hover:underline cursor-pointer transition-all duration-200">
          Can’t find your school? Contact us
        </p>
      </div>
    </main>
  );
}
