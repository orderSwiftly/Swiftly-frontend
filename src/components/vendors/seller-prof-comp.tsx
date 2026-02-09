import ProfileHeader from "./seller-prof-header";
import UserInfoCard from "./seller-info-card";
import ProfileActions from "./seller-prof-actions";
import ProfilePreference from "./seller-prof-pref";

export default function ProfileComponent() {
  return (
    <main className="flex flex-col items-start justify-start w-full pry-ff bg-white">
      <ProfileHeader />
      <UserInfoCard />
      <ProfileActions />
      <ProfilePreference />
    </main>
  );
}
