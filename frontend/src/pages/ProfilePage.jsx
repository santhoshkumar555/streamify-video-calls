import useAuthUser from "../hooks/useAuthUser";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { authUser, isLoading } = useAuthUser();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-base-content opacity-70 text-lg">Unable to load profile</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body items-center text-center">
            <div className="avatar mb-4">
              <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={authUser.profilePic || "https://via.placeholder.com/120"}
                  alt={authUser.fullName}
                />
              </div>
            </div>

            <h2 className="card-title text-3xl">{authUser.fullName}</h2>
            <p className="text-base-content opacity-70">{authUser.email}</p>

            <div className="divider"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="stat bg-base-300 rounded-lg">
                <div className="stat-title">Native Language</div>
                <div className="stat-value text-2xl">{authUser.nativeLanguage}</div>
              </div>

              <div className="stat bg-base-300 rounded-lg">
                <div className="stat-title">Learning</div>
                <div className="stat-value text-2xl">{authUser.learningLanguage}</div>
              </div>
            </div>

            {authUser.bio && (
              <div className="w-full mt-4">
                <h3 className="font-semibold mb-2">Bio</h3>
                <p className="text-base-content opacity-70">{authUser.bio}</p>
              </div>
            )}

            {authUser.location && (
              <div className="w-full mt-2">
                <h3 className="font-semibold mb-2">Location</h3>
                <p className="text-base-content opacity-70">{authUser.location}</p>
              </div>
            )}

            <div className="w-full mt-4">
              <p className="text-sm text-base-content opacity-50">
                Member since {new Date(authUser.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="card-actions mt-6">
              <button
                onClick={() => navigate("/")}
                className="btn btn-primary"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
