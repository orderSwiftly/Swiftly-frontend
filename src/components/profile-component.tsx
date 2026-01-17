import ProfileActions from "./profile-actions";
import ProfilePreference from "./profile-preference";

export default function ProfileComponent() {
    return (
        <main className=" flex flex-col items-start justify-center space-y-4 pry-ff">
            <ProfileActions />
            <ProfilePreference />
        </main>
    )
}