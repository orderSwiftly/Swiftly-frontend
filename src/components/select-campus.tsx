'use client';

import { Search, ChevronLeft } from 'lucide-react';
import Image from 'next/image';

type Props = {
  onFinish: () => void;
};

const schools = [
  { id: 1, name: 'Babcock University', location: 'Illishan-remo, Ogun state' },
  { id: 2, name: 'University of Lagos', location: 'Lagos state' },
  { id: 3, name: 'University of Port Harcourt', location: 'Port Harcourt' },
  { id: 4, name: 'Covenant University', location: 'Ota, Ogun state' },
  { id: 5, name: 'University of Ibadan', location: 'Ibadan, Oyo state' },
  { id: 6, name: 'Pan-Atlantic University', location: 'Lagos state' },
];

export default function SelectCampus({ onFinish }: Readonly<Props>) {
  const handleSelect = (school: typeof schools[0]) => {
    localStorage.setItem('selected-campus', JSON.stringify(school));
    onFinish();
  };

  return (
    <main className="fixed inset-0 z-[997] bg-white flex flex-col items-center pt-8 px-6 pb-24 overflow-y-auto">

      {/* Header */}
      <div className="w-full max-w-md relative">
        <button className="absolute left-0 top-0 bg-gray-200/70 p-2 rounded-xl">
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        <div className="text-center pt-2">
          <h1 className="text-2xl font-bold text-[#6FCF97] tracking-wider pry-ff">
            SWIFTLY
          </h1>
        </div>
      </div>

      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center pry-ff">
          Select Your Campus
        </h2>

        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center sec-ff">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl sec-ff focus:outline-none focus:ring-2 focus:ring-[#6FCF97] focus:border-transparent"
            placeholder="Search"
          />
        </div>

        {/* Schools */}
        <div className="grid grid-cols-2 gap-5 mt-6 mb-10">
          {schools.map((school) => (
            <button
              key={school.id}
              onClick={() => handleSelect(school)}
              className="group flex flex-col items-center p-4 border border-gray-200 rounded-2xl hover:border-[#6FCF97]  cursor-pointer"
            >
              <div className="relative mb-3">
                <div className="w-20 h-20 rounded-full overflow-hidden">
                  <Image
                    src="/campus_avatar.png"
                    alt={school.name}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              <h3 className="font-bold text-gray-800 pry-ff">
                {school.name}
              </h3>
              <p className="text-gray-400 text-sm sec-ff">
                {school.location}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* footer */}
      <div>
        <p className="text-xs text-gray-600 text-center sec-ff hover:underline cursor-pointer transition-all duration-200">
          Can’t find your school? Contact us
        </p>
      </div>
    </main>
  );
}