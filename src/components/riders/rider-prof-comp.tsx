import ProfileHeader from "./rider-prof-header";
import UserInfoCard from "./rider-info-card";
import ProfileActions from "./rider-prof-actions";
import ProfilePreference from "./rider-prof-pref";

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
