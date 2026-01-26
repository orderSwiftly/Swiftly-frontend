import ProfileHeader from "./profile-header";
import UserInfoCard from "./user-info-card";
import ProfileActions from "./profile-actions";
import ProfilePreference from "./profile-preference";

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
