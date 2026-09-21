import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Building2,
  Briefcase,
  IdCard,
  MapPin,
  Pencil,
  KeyRound,
  Save,
  X,
  Loader2,
  Eye,      // Added for password visibility toggle
  EyeOff,   // Added for password visibility toggle
} from "lucide-react";
import Layout from "../../components/staff/Layout";
import Modal from "../../components/staff/Modal";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { updateStaffMember, getStaffList } from "../../services/staff/staffService";
import { resetPassword } from "../../services/staff/authService";

// Vibrant Blue Glassmorphism Card
function Field({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/20 p-4 text-black shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/25">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue/20 text-black backdrop-blur-md">
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-600">{label}</p>
        <p className="truncate text-sm font-bold text-blue-500">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
}

export default function Profile() {
  const { staff: contextStaff, updateStaffLocal } = useAuth();
  const { showToast } = useToast();

  const [localStaff, setLocalStaff] = useState(contextStaff);
  const [editOpen, setEditOpen] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [pwdForm, setPwdForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // State to track show/hide password for each field
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [saving, setSaving] = useState(false);

  // Helper function to toggle password visibility
  const toggleVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Fetch API Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getStaffList();
        
        const staffArray = Array.isArray(res?.staff) ? res.staff : (Array.isArray(res) ? res : []);
        
        if (staffArray.length > 0) {
          const found = staffArray.find(
            (s) =>
              (s.email && s.email.toLowerCase() === contextStaff?.email?.toLowerCase()) ||
              (s._id && s._id === contextStaff?._id)
          ) || staffArray[0];

          if (found) {
            setLocalStaff(found);
            if (updateStaffLocal) updateStaffLocal(found);
          }
        }
      } catch (err) {
        console.error("API Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Form Initial Value Sync
  useEffect(() => {
    if (localStaff) {
      setForm({
        name: localStaff.name || "",
        phone: localStaff.phone || "",
        address: localStaff.address || "",
      });
    }
  }, [localStaff]);

  // Handle Profile Save
  const handleSave = async () => {
    if (!localStaff?._id) {
      showToast("Staff ID missing", "error");
      return;
    }

    try {
      setSaving(true);
      const res = await updateStaffMember(localStaff._id, form);
      if (res?.success) {
        const updated = res.staff || { ...localStaff, ...form };
        setLocalStaff(updated);
        if (updateStaffLocal) updateStaffLocal(updated);
        showToast("Profile updated successfully!", "success");
        setEditOpen(false);
      }
    } catch (e) {
      showToast(e.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  // DYNAMIC: Real API Password Change Handler
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Frontend Basic Validations
    if (!pwdForm.currentPassword || !pwdForm.newPassword || !pwdForm.confirmPassword) {
      return showToast("All password fields are required.", "error");
    }

    if (pwdForm.newPassword.length < 6) {
      return showToast("New password must be at least 6 characters long.", "error");
    }

    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      return showToast("New password and confirm password do not match.", "error");
    }

    if (pwdForm.currentPassword === pwdForm.newPassword) {
      return showToast("New password must be different from current password.", "error");
    }

    try {
      setSaving(true);
      
      // Dynamic Backend Call
      const response = await resetPassword({
        currentPassword: pwdForm.currentPassword,
        newPassword: pwdForm.newPassword,
        confirmPassword: pwdForm.confirmPassword,
      });

      if (response?.success) {
        showToast(response.message || "Password updated successfully!", "success");
        setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setShowPasswords({ current: false, new: false, confirm: false });
        setPwdOpen(false);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to change password";
      showToast(errorMsg, "error");
    } finally {
      setSaving(false);
    }
  };

  // Field Data Formatting
  const dept =
    typeof localStaff?.department === "object"
      ? localStaff.department?.name
      : localStaff?.department;

  return (
    <Layout title="My Profile" subtitle="Manage your personal information.">
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Blue Glass Header */}
          <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-r from-blue-500 to-cyan-600 via-blue-600 to-indigo-800 p-6 shadow-2xl backdrop-blur-2xl sm:flex-row dark:border-white/10">
            <img
              src={
                localStaff?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  localStaff?.name || "User"
                )}&background=ffff&color=0B8BB9`
              }
              className="h-24 w-24 rounded-2xl object-cover ring-4 ring-white/30 shadow-lg"
              alt="Profile"
            />
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-black text-white capitalize">
                {localStaff?.name || "N/A"}
              </h2>
              <p className="mt-1 text-sm font-medium text-blue-100 capitalize">
                {localStaff?.designation || "Staff"} &middot; {dept || "N/A"}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/30 active:scale-95"
              >
                <Pencil size={15} /> Edit
              </button>
              <button
                onClick={() => setPwdOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-md transition-all hover:bg-blue-50 active:scale-95"
              >
                <KeyRound size={15} /> Password
              </button>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field icon={Mail} label="Email" value={localStaff?.email} />
            <Field icon={Phone} label="Phone" value={localStaff?.phone} />
            <Field icon={Building2} label="Department" value={dept} />
            <Field
              icon={Briefcase}
              label="Designation"
              value={localStaff?.designation}
            />
            <Field
              icon={MapPin}
              label="Address"
              value={localStaff?.address || "Not Provided"}
            />
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Profile"
      >
        <div className="space-y-4">
          <div>
            <label className="label-text">Full Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-text">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-text">Address</label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              rows={3}
              className="input-field resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setEditOpen(false)}
              className="btn-secondary"
            >
              <X size={15} /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary"
            >
              <Save size={15} /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Password Modal */}
      <Modal
        open={pwdOpen}
        onClose={() => {
          setPwdOpen(false);
          setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
          setShowPasswords({ current: false, new: false, confirm: false });
        }}
        title="Change Password"
      >
        <form onSubmit={handlePasswordChange} className="space-y-4">
          
          {/* Current Password Field */}
          <div>
            <label className="label-text">Current Password</label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                required
                value={pwdForm.currentPassword}
                onChange={(e) =>
                  setPwdForm({ ...pwdForm, currentPassword: e.target.value })
                }
                className="input-field pr-10"
              />
              <button
                type="button"
                onClick={() => toggleVisibility("current")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password Field */}
          <div>
            <label className="label-text">New Password</label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                required
                value={pwdForm.newPassword}
                onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                className="input-field pr-10"
              />
              <button
                type="button"
                onClick={() => toggleVisibility("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="label-text">Confirm New Password</label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                required
                value={pwdForm.confirmPassword}
                onChange={(e) =>
                  setPwdForm({ ...pwdForm, confirmPassword: e.target.value })
                }
                className="input-field pr-10"
              />
              <button
                type="button"
                onClick={() => toggleVisibility("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setPwdOpen(false);
                setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                setShowPasswords({ current: false, new: false, confirm: false });
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Updating...
                </>
              ) : (
                <>
                  <KeyRound size={15} /> Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}