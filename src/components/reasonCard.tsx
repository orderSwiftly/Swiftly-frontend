'use client';

import { LucideIcon } from 'lucide-react';

interface ReasonCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

export default function ReasonCard({ Icon, title, description, color }: ReasonCardProps) {
  return (
    <div className="flex flex-col items-start gap-3 p-6 bg-white rounded-xl shadow-md text-left h-full hover:transform hover:scale-103 transition-transform duration-500 ease-in-out cursor-pointer">
      <Icon className={`w-6 h-6 ${color}`} />
      <h3 className="text-base font-semibold pry-ff">{title}</h3>
      <p className="text-sm text-gray-600 sec-ff">{description}</p>
    </div>
  );
}