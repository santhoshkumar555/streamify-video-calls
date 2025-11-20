import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../lib/api";
import toast from "react-hot-toast";
import { LANGUAGES } from "../constants";
import { Edit2, Save, X } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isLoading } = useAuthUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    nativeLanguage: "",
    learningLanguage: "",
    location: "",
  });

  const { mutate: updateProfileMutation, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  const handleEdit = () => {
    setFormData({
      fullName: authUser.fullName || "",
      bio: authUser.bio || "",
      nativeLanguage: authUser.nativeLanguage || "",
      learningLanguage: authUser.learningLanguage || "",
      location: authUser.location || "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      fullName: "",
      bio: "",
      nativeLanguage: "",
      learningLanguage: "",
      location: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }

    updateProfileMutation(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
          <div className="card-body">
            {/* Header with Edit Button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title text-2xl">Profile</h2>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="btn btn-primary btn-sm gap-2"
                >
                  <Edit2 className="size-4" />
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              /* Edit Mode */
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Profile Picture */}
                <div className="flex justify-center mb-4">
                  <div className="avatar">
                    <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img
                        src={authUser.profilePic || "https://via.placeholder.com/120"}
                        alt={authUser.fullName}
                      />
                    </div>
                  </div>
                </div>

                {/* Full Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Full Name *</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                {/* Email (Read-only) */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Email</span>
                  </label>
                  <input
                    type="email"
                    value={authUser.email}
                    className="input input-bordered w-full"
                    disabled
                  />
                  <label className="label">
                    <span className="label-text-alt opacity-70">Email cannot be changed</span>
                  </label>
                </div>

                {/* Bio */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Bio</span>
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="textarea textarea-bordered h-24"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Languages */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Native Language</span>
                    </label>
                    <select
                      name="nativeLanguage"
                      value={formData.nativeLanguage}
                      onChange={handleChange}
                      className="select select-bordered w-full"
                    >
                      <option value="">Select language</option>
                      {LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Learning Language</span>
                    </label>
                    <select
                      name="learningLanguage"
                      value={formData.learningLanguage}
                      onChange={handleChange}
                      className="select select-bordered w-full"
                    >
                      <option value="">Select language</option>
                      {LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Location</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="City, Country"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 justify-end mt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-ghost gap-2"
                    disabled={isPending}
                  >
                    <X className="size-4" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary gap-2"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <span className="loading loading-spinner loading-sm" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="size-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* View Mode */
              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="flex justify-center">
                  <div className="avatar">
                    <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img
                        src={authUser.profilePic || "https://via.placeholder.com/120"}
                        alt={authUser.fullName}
                      />
                    </div>
                  </div>
                </div>

                {/* Name and Email */}
                <div className="text-center">
                  <h3 className="text-3xl font-bold">{authUser.fullName}</h3>
                  <p className="text-base-content opacity-70 mt-1">{authUser.email}</p>
                </div>

                <div className="divider"></div>

                {/* Languages */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-300 rounded-lg">
                    <div className="stat-title">Native Language</div>
                    <div className="stat-value text-2xl">
                      {authUser.nativeLanguage || "Not set"}
                    </div>
                  </div>

                  <div className="stat bg-base-300 rounded-lg">
                    <div className="stat-title">Learning</div>
                    <div className="stat-value text-2xl">
                      {authUser.learningLanguage || "Not set"}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {authUser.bio && (
                  <div className="w-full">
                    <h3 className="font-semibold mb-2">Bio</h3>
                    <p className="text-base-content opacity-70">{authUser.bio}</p>
                  </div>
                )}

                {/* Location */}
                {authUser.location && (
                  <div className="w-full">
                    <h3 className="font-semibold mb-2">Location</h3>
                    <p className="text-base-content opacity-70">{authUser.location}</p>
                  </div>
                )}

                {/* Member Since */}
                <div className="w-full">
                  <p className="text-sm text-base-content opacity-50">
                    Member since {new Date(authUser.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Back Button */}
                <div className="flex justify-center mt-6">
                  <button onClick={() => navigate("/")} className="btn btn-primary">
                    Back to Home
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
