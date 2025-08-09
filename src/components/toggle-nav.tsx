import { Clock, X, CheckCircle, Truck, Package, RotateCcw } from 'lucide-react';

interface ToggleNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function ToggleNav({ activeTab, onTabChange }: ToggleNavProps) {
  const OrderNavLinks = [
    { 
      key: 'pending', 
      label: 'Pending Orders', 
      icon: Clock,
      status: 'pending'
    },
    { 
      key: 'cancelled', 
      label: 'Cancelled Orders', 
      icon: X,
      status: 'cancelled'
    },
    { 
      key: 'confirmed', 
      label: 'Confirmed Orders', 
      icon: CheckCircle,
      status: 'confirmed'
    },
    { 
      key: 'shipped', 
      label: 'Shipped Orders', 
      icon: Truck,
      status: 'shipped'
    },
    { 
      key: 'delivered', 
      label: 'Delivered Orders', 
      icon: Package,
      status: 'delivered'
    },
    { 
      key: 'returned', 
      label: 'Returned Orders', 
      icon: RotateCcw,
      status: 'returned'
    },
  ];

  return (
    <div className="w-full mb-8">
      <nav className="bg-white/5 border border-white/10 rounded-xl p-2">
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {OrderNavLinks.map(link => {
            const Icon = link.icon;
            const isActive = activeTab === link.key;
            
            return (
              <li key={link.key}>
                <button
                  onClick={() => onTabChange(link.key)}
                  className={`
                    w-full flex flex-col items-center justify-center gap-2 p-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-[var(--acc-clr)] text-white shadow-lg' 
                      : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                    }
                  `}
                >
                  <Icon 
                    size={20} 
                    className={`${isActive ? 'text-white' : 'text-gray-400'}`} 
                  />
                  <span className={`text-xs font-medium text-center leading-tight sec-ff ${
                    isActive ? 'text-white' : 'text-gray-400'
                  }`}>
                    {link.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}