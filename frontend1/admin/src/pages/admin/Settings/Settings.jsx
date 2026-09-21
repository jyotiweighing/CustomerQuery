
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  User,
  Building2,
  Building,
  Bell,
  Lock,
  Trash2,
  Edit3,
  Plus,
  Layers,
  Eye,
  EyeOff,
  Camera,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import PageHeader from "../../../components/admin/common/PageHeader";
import FormInput from "../../../components/admin/common/FormInput";
import Button from "../../../components/admin/common/Button";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../../../services/admin/userService";
import {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../../services/admin/departmentService";
import { showAlert } from "../../../utils/sweetAlert";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "company", label: "Company", icon: Building2 },
  { id: "departments", label: "Departments", icon: Building },
  // { id: "notifications", label: "Notifications", icon: Bell },
  { id: "password", label: "Security", icon: Lock },
];

export default function Settings() {
  const [active, setActive] = useState("profile");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    mobile: "",
    companyName: "",
    role: "",
    image: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      setProfile(res.user);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("mobile", profile.mobile);
      formData.append("companyName", profile.companyName);

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      await updateProfile(formData);

      showAlert({
        icon: "success",
        title: "Updated Successfully",
        text: "Your profile preferences have been saved.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      showAlert({
        icon: "error",
        title: "Update Failed",
        text: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden ">
      {/* Ambient Radial Glass Gradient Mesh */}
      {/* <div className="absolute -top-24 -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/15 to-pink-500/10 rounded-full blur-3xl pointer-events-none" /> */}
      <div className="absolute top-1/2 -right-20 w-[450px] h-[450px]  rounded-full blur-3xl pointer-events-none" />

      <input
        type="file"
        id="profileImage"
        hidden
        accept="image/*"
        onChange={(e) => setSelectedFile(e.target.files[0])}
      />

      <PageHeader
        title="Settings & Preferences"
        subtitle="Manage your personal credentials, workspace options, and notifications"
      />

      <div className="flex flex-col lg:flex-row gap-6 relative z-10 mt-6">
        {/* Navigation Sidebar */}
        <div className="lg:w-72 shrink-0 h-fit rounded-3xl bg-white/60 backdrop-blur-2xl border border-white/80 p-3 shadow-2xl shadow-indigo-950/5">
          <div className="px-4 py-3 mb-2 hidden lg:block border-b border-slate-200/50">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Workspace Settings
            </span>
          </div>
          <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible no-scrollbar">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = active === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActive(t.id)}
                  className={`group flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-indigo-600/30 scale-[1.01]"
                      : "text-slate-600 hover:bg-white/80 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={18}
                      className={`transition-transform duration-300 ${
                        isActive
                          ? "scale-110 text-white"
                          : "text-slate-400 group-hover:text-blue-700"
                      }`}
                    />
                    <span>{t.label}</span>
                  </div>
                  {isActive && (
                    <span className="hidden lg:block w-2 h-2 rounded-full bg-white shadow-sm animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 rounded-3xl bg-white/70 backdrop-blur-2xl border border-white/80 p-6 sm:p-8 lg:p-10 shadow-2xl shadow-indigo-950/5 transition-all">
          {active === "profile" && (
            <ProfileTab
              profile={profile}
              setProfile={setProfile}
              handleUpdate={handleUpdate}
              selectedFile={selectedFile}
            />
          )}

          {active === "company" && (
            <CompanyTab
              profile={profile}
              setProfile={setProfile}
              handleUpdate={handleUpdate}
            />
          )}

          {active === "departments" && <DepartmentsTab />}

          {active === "notifications" && (
            <SimpleTab
              title="Notification Settings"
              desc="Customize how and when you receive workspace alerts."
              items={[
                "New query received in queue",
                "Query assigned directly to you",
                "Query marked as resolved",
                "Escalation warning alerts",
              ]}
              toggle
            />
          )}

          {active === "password" && <PasswordTab />}
        </div>
      </div>
    </div>
  );
}

const getInitials = (name = "") => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

/* ==========================================
   PROFILE TAB
   ========================================== */
function ProfileTab({ profile, setProfile, handleUpdate, selectedFile }) {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between border-b border-slate-100/80 pb-5">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Profile Settings
          </h3>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Update your account details and display avatar
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-bold">
          <ShieldCheck size={14} /> Verified Account
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-3xl bg-gradient-to-r from-slate-50/80 via-indigo-50/20 to-purple-50/20 border border-slate-200/60 shadow-inner">
        <div className="relative group cursor-pointer">
          {selectedFile ? (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Profile Preview"
              className="h-28 w-28 rounded-3xl object-cover border-4 border-white shadow-xl shadow-slate-300/50 ring-2 ring-indigo-500/20"
            />
          ) : profile.image ? (
            <img
              src={profile.image}
              alt="Profile"
              className="h-28 w-28 rounded-3xl object-cover border-4 border-white shadow-xl shadow-slate-300/50 ring-2 ring-indigo-500/20"
            />
          ) : (
            <div className="h-28 w-28 rounded-3xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 flex items-center justify-center text-white text-3xl font-black border-4 border-white shadow-xl shadow-indigo-500/20">
              {getInitials(profile.name)}
            </div>
          )}
          <button
            onClick={() => document.getElementById("profileImage").click()}
            className="absolute -bottom-2 -right-2 p-2.5 rounded-2xl bg-slate-900 text-white shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer border-2 border-white"
            title="Upload Photo"
          >
            <Camera size={15} />
          </button>
        </div>

        <div className="text-center sm:text-left space-y-2">
          <h4 className="text-base font-bold text-slate-800">Your Avatar</h4>
          <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
            Allowed PNG, JPG or GIF. Max filesize of 2MB.
          </p>
          <div className="pt-1">
            <Button
              variant="secondary"
              onClick={() => document.getElementById("profileImage").click()}
              className="!rounded-xl !px-4 !py-2 !text-xs font-bold bg-white hover:bg-slate-50 border-slate-200 shadow-sm"
            >
              Upload New Picture
            </Button>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <FormInput
          label="Full Name"
          value={profile.name || ""}
          onChange={(e) =>
            setProfile({
              ...profile,
              name: e.target.value,
            })
          }
        />

        <FormInput label="Email Address" value={profile.email || ""} disabled />

        <FormInput
          label="Phone Number"
          value={profile.mobile || ""}
          onChange={(e) =>
            setProfile({
              ...profile,
              mobile: e.target.value,
            })
          }
        />

        <FormInput label="Role" value={profile.role || ""} disabled />
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          onClick={handleUpdate}
          className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm font-bold rounded-2xl shadow-xl shadow-indigo-600/25 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
        >
          <Sparkles size={16} />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}

/* ==========================================
   COMPANY TAB
   ========================================== */
function CompanyTab({ profile, setProfile, handleUpdate }) {
  return (
    <div className="space-y-8">
      <div className="border-b border-slate-100/80 pb-5">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          Company Profile
        </h3>
        <p className="text-xs font-medium text-slate-500 mt-1">
          Manage your organization details and business domain
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <FormInput
          label="Company Name"
          value={profile.companyName || ""}
          onChange={(e) =>
            setProfile({
              ...profile,
              companyName: e.target.value,
            })
          }
        />

        <FormInput
          label="Primary Business Email"
          value={profile.email || ""}
          disabled
        />
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          onClick={handleUpdate}
          className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm font-bold rounded-2xl shadow-xl shadow-indigo-600/25 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
        >
          <Sparkles size={16} />
          <span>Update Company Info</span>
        </button>
      </div>
    </div>
  );
}

/* ==========================================
   DEPARTMENTS TAB
   ========================================== */
function DepartmentsTab() {
  const [deptList, setDeptList] = useState([]);

  useEffect(() => {
    fetchDepts();
  }, []);

  const fetchDepts = async () => {
    try {
      const res = await getDepartments();
      setDeptList(res.departments || res.data || []);
    } catch (err) {
      console.error("Failed to load departments:", err);
    }
  };

  const handleAddDept = async () => {
    const { value: deptName } = await Swal.fire({
      background: "transparent",
      showCancelButton: true,
      confirmButtonText: "Create Team ➔",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        popup: "p-0 bg-transparent shadow-none border-none max-w-md w-full",
        actions:
          "flex flex-row justify-end gap-3 mt-6 pt-4 border-t border-slate-100/80 w-full",
        confirmButton:
          "px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer",
        cancelButton:
          "px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-2xl transition-all cursor-pointer",
      },
      html: `
        <div class="relative text-left font-sans p-6 rounded-[32px] bg-white/95 backdrop-blur-2xl border border-white shadow-2xl">
          <div class="flex items-center gap-3.5 mb-6">
            <div class="h-12 w-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-lg shadow-emerald-500/20">
              🚀
            </div>
            <div>
              <h3 class="text-xl font-black text-slate-900 tracking-tight">New Department</h3>
              <p class="text-xs text-slate-500 mt-0.5">Add an operational group to your team workspace</p>
            </div>
          </div>

          <div class="space-y-2 mt-4">
            <label class="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Department Title
            </label>
            <input 
              id="swal-light-input" 
              class="w-full px-4 py-3.5 text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400 block"
              placeholder="e.g. Technical Support, Billing..." 
              autocomplete="off"
            />
          </div>
        </div>
      `,
      preConfirm: () => {
        const input = document.getElementById("swal-light-input");
        if (!input || !input.value.trim()) {
          Swal.showValidationMessage("Please enter a department name");
          return false;
        }
        return input.value.trim();
      },
    });

    if (deptName) {
      try {
        await addDepartment({ name: deptName });
        showAlert({
          icon: "success",
          title: "Created!",
          text: "Department created successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchDepts();
      } catch (err) {
        showAlert({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Could not add department",
        });
      }
    }
  };

  const handleEditDept = async (dept) => {
    const { value: updatedName } = await Swal.fire({
      background: "transparent",
      showCancelButton: true,
      confirmButtonText: "Save Changes ➔",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        popup: "p-0 bg-transparent shadow-none border-none max-w-md w-full",
        actions:
          "flex flex-row justify-end gap-3 mt-6 pt-4 border-t border-slate-100/80 w-full",
        confirmButton:
          "px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-600/25 active:scale-95 transition-all cursor-pointer",
        cancelButton:
          "px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-2xl transition-all cursor-pointer",
      },
      html: `
        <div class="relative text-left font-sans p-6 rounded-[32px] bg-white/95 backdrop-blur-2xl border border-white shadow-2xl">
          <div class="flex items-center gap-3.5 mb-6">
            <div class="h-12 w-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-lg shadow-indigo-600/20">
              ✏️
            </div>
            <div>
              <h3 class="text-xl font-black text-slate-900 tracking-tight">Edit Department</h3>
              <p class="text-xs text-slate-500 mt-0.5">Rename department title</p>
            </div>
          </div>

          <div class="space-y-2 mt-4">
            <label class="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Department Name
            </label>
            <input 
              id="swal-light-edit" 
              value="${dept.name}"
              class="w-full px-4 py-3.5 text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all block"
              placeholder="Enter department name" 
              autocomplete="off"
            />
          </div>
        </div>
      `,
      preConfirm: () => {
        const input = document.getElementById("swal-light-edit");
        if (!input || !input.value.trim()) {
          Swal.showValidationMessage("Department name cannot be empty!");
          return false;
        }
        return input.value.trim();
      },
    });

    if (updatedName && updatedName !== dept.name) {
      try {
        await updateDepartment(dept.id || dept._id, { name: updatedName });
        showAlert({
          icon: "success",
          title: "Updated!",
          text: "Department updated successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchDepts();
      } catch (err) {
        showAlert({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Could not update department",
        });
      }
    }
  };

  const handleDeleteDept = async (id) => {
    const result = await Swal.fire({
      background: "transparent",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        popup: "p-0 bg-transparent shadow-none border-none max-w-sm w-full",
        actions: "flex flex-col gap-2 mt-4 w-full",
        confirmButton:
          "w-full py-3.5 bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-rose-500/25 active:scale-95 transition-all cursor-pointer",
        cancelButton:
          "w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-2xl transition-all cursor-pointer",
      },
      html: `
        <div class="relative text-center font-sans p-6 rounded-[32px] bg-white/95 backdrop-blur-2xl border border-white shadow-2xl">
          <div class="mx-auto mb-4 h-16 w-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center text-2xl shadow-inner">
            🗑️
          </div>
          <h3 class="text-xl font-black text-slate-900 tracking-tight">Remove Department?</h3>
          <p class="text-xs text-slate-500 mt-2 leading-relaxed px-2">
            This action cannot be undone. Associated members will need to be reassigned.
          </p>
        </div>
      `,
    });

    if (result.isConfirmed) {
      try {
        await deleteDepartment(id);
        showAlert({
          icon: "success",
          title: "Deleted!",
          text: "Department deleted successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchDepts();
      } catch (err) {
        showAlert({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Could not delete department",
        });
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100/80">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Departments & Teams
          </h3>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Configure operational departments in your platform
          </p>
        </div>
        <button
          onClick={handleAddDept}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-bold rounded-2xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Department</span>
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {deptList.length > 0 ? (
          deptList.map((d) => (
            <div
              key={d.id || d._id}
              className="group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white/60 backdrop-blur-md border border-slate-200/80 hover:bg-white hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white transition-all duration-300 shadow-sm">
                  <Layers size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 tracking-tight capitalize">
                    {d.name}
                  </h4>
                  <span className="text-[11px] font-medium text-slate-400">
                    Active Team
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEditDept(d)}
                  title="Edit Department"
                  className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteDept(d.id || d._id)}
                  title="Delete Department"
                  className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50">
            <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-3">
              <Layers size={28} />
            </div>
            <p className="text-sm font-bold text-slate-700">
              No departments added yet
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Create departments to assign and distribute queries effectively.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================
   PASSWORD TAB
   ========================================== */
function PasswordTab() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      showAlert({
        icon: "warning",
        title: "Missing Fields",
        text: "Please complete all fields",
      });
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      showAlert({
        icon: "error",
        title: "Mismatch",
        text: "New passwords do not match",
      });
      return;
    }

    if (form.newPassword.length < 6) {
      showAlert({
        icon: "warning",
        title: "Weak Password",
        text: "Password must be at least 6 characters long",
      });
      return;
    }

    try {
      setLoading(true);
      await changePassword(form);

      showAlert({
        icon: "success",
        title: "Password Updated",
        text: "Your password has been changed successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      showAlert({
        icon: "error",
        title: "Update Failed",
        text: err.response?.data?.message || "Could not change password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-100/80 pb-5">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          Security & Password
        </h3>
        <p className="text-xs font-medium text-slate-500 mt-1">
          Update your authentication password
        </p>
      </div>

      <div className="max-w-md space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Current Password
          </label>
          <div className="relative flex items-center">
            <input
              type={showCurrent ? "text" : "password"}
              value={form.currentPassword}
              onChange={(e) => update("currentPassword", e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3.5 pr-12 outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 transition text-sm font-semibold text-slate-900 placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            New Password
          </label>
          <div className="relative flex items-center">
            <input
              type={showNew ? "text" : "password"}
              value={form.newPassword}
              onChange={(e) => update("newPassword", e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3.5 pr-12 outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 transition text-sm font-semibold text-slate-900 placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Confirm New Password
          </label>
          <div className="relative flex items-center">
            <input
              type={showConfirm ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3.5 pr-12 outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 transition text-sm font-semibold text-slate-900 placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm font-bold rounded-2xl shadow-xl shadow-indigo-600/25 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Saving..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}

/* ==========================================
   SIMPLE TAB
   ========================================== */
function SimpleTab({ title, desc, items, toggle }) {
  const [toggles, setToggles] = useState([true, true, false, false]);

  const toggleHandler = (idx) => {
    setToggles((prev) => prev.map((val, i) => (i === idx ? !val : val)));
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-100/80 pb-5">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          {title}
        </h3>
        <p className="text-xs font-medium text-slate-500 mt-1">{desc}</p>
      </div>

      <div className="space-y-3.5">
        {items.map((item, i) => (
          <div
            key={item}
            className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/60 backdrop-blur-md px-6 py-4 hover:border-indigo-300 transition-all shadow-sm"
          >
            <span className="text-sm font-bold text-slate-800">{item}</span>
            {toggle && (
              <button
                type="button"
                onClick={() => toggleHandler(i)}
                className={`h-7 w-12 rounded-full transition-colors duration-300 relative cursor-pointer p-0.5 ${
                  toggles[i]
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md shadow-indigo-500/20"
                    : "bg-slate-200"
                }`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                    toggles[i] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}