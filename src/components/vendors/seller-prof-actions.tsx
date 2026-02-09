import { ShoppingBag, Signpost, ChevronRight, Wallet, User, UserCircle } from "lucide-react";
import Link from "next/link";

const actions = [
  {
    link: "/seller/dashboard/settings",
    label: "Account Settings",
    icon: UserCircle,
  },
  {
    link: "/seller/dashboard/profile/account",
    label: "My Account",
    icon: Wallet,
  },
  {
    link: "/seller/dashboard/orders",
    label: "My Orders",
    icon: ShoppingBag,
  },
  {
    link: "/seller/dashboard/addresses",
    label: "My Addresses",
    icon: Signpost,
  },
];

export default function ProfileActions() {
  return (
    <section className="px-4 mt-4 w-full">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Actions</h3>

      <div className="bg-white rounded-xl border border-gray-200 divide-y">
        {actions.map(({ label, icon: Icon, link }) => (
          <Link
            href={link || "#"}
            key={label}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-800">{label}</span>
            </div>

            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
        ))}
      </div>
    </section>
  );
}
