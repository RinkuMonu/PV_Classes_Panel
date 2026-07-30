import { useEffect, useState } from "react";
import { Camera, Save, UserRound, X } from "lucide-react";
import Swal from "sweetalert2";
import axiosInstance from "../../../config/AxiosInstance";

const ProfileForm = ({
  initialData = { name: "", email: "", phone: "", role: "" },
  submitButtonText = "Update Profile",
}) => {
  const [formData, setFormData] = useState(initialData);
  const [profileImage, setProfileImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get(`/users/getUser`);
        const user = response.data.data;
        setFormData({
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          role: user?.role || "",
        });
        if (user?.profile_image_url) setProfileImage(user.profile_image_url);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("role", formData.role);
      if (selectedFile) formDataToSend.append("profile_image", selectedFile);

      const response = await axiosInstance.put(`/users/updateUser`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data?.data?.profile_image_url) {
        setProfileImage(response.data.data.profile_image_url);
      }
      Swal.fire({ icon: "success", title: "Success", text: "Profile updated successfully!" });
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      alert("Failed to update profile.");
    }
  };

  const formFields = [
    { label: "Name", name: "name", type: "text", placeholder: "Your Name" },
    { label: "Email", name: "email", type: "email", placeholder: "Email" },
    { label: "Contact Number", name: "phone", type: "tel", placeholder: "Contact Number" },
  ];

  return (
    <main className="min-h-full bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        {/* UI-only: profile page presentation now follows the shared PV Classes theme. */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-[#204972] to-[#87b105] p-6 text-white shadow-lg">
          <h1 className="flex items-center text-2xl font-bold"><UserRound className="mr-3" /> Edit Profile</h1>
          <p className="mt-2 text-sm text-white/85">Keep your administrator information and profile picture up to date.</p>
        </div>

        <form onSubmit={handleSubmit} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[320px_1fr]">
            <section className="border-b border-slate-200 bg-gradient-to-b from-[#204972]/[0.06] to-[#87b105]/[0.08] p-6 lg:border-b-0 lg:border-r">
              <h2 className="text-lg font-bold text-[#204972]">Profile picture</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">Use a clear JPG, PNG, or WebP image.</p>

              <div className="mt-6 flex flex-col items-center">
                <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#204972]/10 shadow-lg">
                  {profileImage ? <img className="h-full w-full object-cover" src={profileImage} alt="Profile preview" /> : <UserRound className="h-14 w-14 text-[#204972]/55" />}
                  {profileImage && (
                    <button type="button" aria-label="Remove profile image" className="absolute right-1 top-1 rounded-full bg-white p-1.5 text-red-500 shadow-md hover:bg-red-50" onClick={() => { setProfileImage(null); setSelectedFile(null); }}>
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <label className="mt-6 flex w-full cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-[#204972]/25 bg-white px-4 py-5 text-center transition hover:border-[#87b105] hover:bg-[#87b105]/[0.04]">
                  <input accept="image/*,.jpeg,.jpg,.png,.webp" type="file" className="hidden" onChange={handleImageChange} />
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#204972]/10 text-[#204972]"><Camera className="h-5 w-5" /></span>
                  <span className="mt-3 text-sm font-semibold text-[#204972]">Choose profile image</span>
                  <span className="mt-1 text-xs text-slate-400">JPEG, PNG or WebP</span>
                </label>
              </div>
            </section>

            <section className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-800">Personal information</h2>
              <p className="mt-1 text-sm text-slate-500">Update the details associated with your account.</p>

              <div className="mt-7 grid gap-5 md:grid-cols-2">
                {formFields.map((field) => (
                  <div key={field.name} className={field.name === "name" ? "md:col-span-2" : ""}>
                    <label htmlFor={`profile-${field.name}`} className="mb-2 block text-sm font-semibold text-slate-700">{field.label}</label>
                    <input id={`profile-${field.name}`} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#87b105] focus:bg-white focus:ring-4 focus:ring-[#87b105]/10" type={field.type} name={field.name} placeholder={field.placeholder} value={formData[field.name]} onChange={handleChange} />
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-xl border border-[#204972]/10 bg-[#204972]/[0.04] p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#204972]/70">Account role</p>
                <p className="mt-1 font-semibold capitalize text-[#204972]">{formData.role || "Administrator"}</p>
              </div>
            </section>
          </div>

          <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#204972] px-6 text-sm font-semibold text-white shadow-md transition hover:bg-[#183654]" type="submit">
              <Save className="h-4 w-4" /> {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ProfileForm;
