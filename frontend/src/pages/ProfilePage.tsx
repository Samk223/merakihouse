import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";
import { Plus, Trash2, MapPin, Check, Phone, ShieldCheck, Mail, Loader2, Home } from "lucide-react";

interface AddressType {
  id: number;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export const ProfilePage = () => {
  const { user, refreshProfile } = useAuth();
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Profile Name Edit State
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Address form state
  const [showForm, setShowForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      setNewName(user.name);
    }
  }, [user]);

  const resetForm = () => {
    setEditingAddressId(null);
    setFullName("");
    setPhone("");
    setAddressLine1("");
    setAddressLine2("");
    setCity("");
    setState("");
    setPostalCode("");
    setShowForm(false);
  };

  const handleEditClick = (addr: AddressType) => {
    setEditingAddressId(addr.id);
    setFullName(addr.full_name);
    setPhone(addr.phone);
    setAddressLine1(addr.address_line_1);
    setAddressLine2(addr.address_line_2 || "");
    setCity(addr.city);
    setState(addr.state);
    setPostalCode(addr.postal_code);
    setShowForm(true);
  };

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/addresses");
      if (response.data.success) {
        setAddresses(response.data.data || []);
      }
    } catch (err) {
      console.error("Failed to load addresses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSetDefault = async (addressId: number) => {
    setActionId(addressId);
    setError(null);
    try {
      const response = await apiClient.patch(`/addresses/${addressId}/default`);
      if (response.data.success) {
        setAddresses(
          addresses.map((addr) => ({
            ...addr,
            is_default: addr.id === addressId,
          }))
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to set default address.");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (addressId: number) => {
    if (!window.confirm("Are you sure you want to delete this shipping address?")) return;
    setActionId(addressId);
    setError(null);
    try {
      const response = await apiClient.delete(`/addresses/${addressId}`);
      if (response.data.success) {
        setAddresses(addresses.filter((addr) => addr.id !== addressId));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete address.");
    } finally {
      setActionId(null);
    }
  };

  const validateAddress = () => {
    if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
      setFormError("Please fill in all required fields.");
      return false;
    }

    const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.replace(/\s+/g, ""))) {
      setFormError("Please enter a valid 10-digit Indian mobile number.");
      return false;
    }

    const pinRegex = /^[1-9]\d{5}$/;
    if (!pinRegex.test(postalCode.replace(/\s+/g, ""))) {
      setFormError("Please enter a valid 6-digit Indian PIN code.");
      return false;
    }

    return true;
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateAddress()) return;

    setSaving(true);
    try {
      if (editingAddressId) {
        const response = await apiClient.patch(`/addresses/${editingAddressId}`, {
          full_name: fullName,
          phone: phone.replace(/\s+/g, ""),
          address_line_1: addressLine1,
          address_line_2: addressLine2 || undefined,
          city: city,
          state: state,
          postal_code: postalCode.replace(/\s+/g, ""),
          country: "India",
        });

        if (response.data.success) {
          setAddresses(
            addresses.map((addr) =>
              addr.id === editingAddressId ? response.data.data : addr
            )
          );
          resetForm();
        }
      } else {
        const response = await apiClient.post("/addresses", {
          full_name: fullName,
          phone: phone.replace(/\s+/g, ""),
          address_line_1: addressLine1,
          address_line_2: addressLine2 || undefined,
          city: city,
          state: state,
          postal_code: postalCode.replace(/\s+/g, ""),
          country: "India",
          is_default: addresses.length === 0,
        });

        if (response.data.success) {
          setAddresses([...addresses, response.data.data]);
          resetForm();
        }
      }
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to save address.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in select-none">
      {/* Account Info Cards */}
      <section className="space-y-4">
        <h2 className="font-heading text-lg text-[#28273F] pb-3 border-b border-[#28273F]/5">
          Sanctuary Profile details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isEditingName ? (
            <div className="flex flex-col gap-2.5 p-4 border border-[#9D6C76]/20 bg-[#FAF8F5]/10 rounded-[16px] text-xs font-body text-[#666666] animate-fade-in">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#9D6C76]" strokeWidth={1.5} />
                <div className="flex-grow">
                  <span className="text-[9px] uppercase font-bold text-[#28273F]/65 block mb-1">Edit Account Name</span>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#28273F]/10 rounded-[10px] font-body text-xs text-[#28273F] focus:outline-none"
                    placeholder="please enter Your Name"
                    required
                  />
                </div>
              </div>
              {nameError && (
                <span className="text-[9.5px] text-[#EF4444] block pl-8 font-medium">{nameError}</span>
              )}
              <div className="flex gap-2 justify-end pl-8 mt-1">
                <button
                  onClick={async () => {
                    if (!newName.trim()) {
                      setNameError("Please enter your name");
                      return;
                    }
                    setSavingName(true);
                    setNameError(null);
                    try {
                      const response = await apiClient.patch("/profile", { name: newName });
                      if (response.data.success) {
                        await refreshProfile();
                        setIsEditingName(false);
                      }
                    } catch (err: any) {
                      setNameError(err.response?.data?.message || "Failed to update profile name.");
                    } finally {
                      setSavingName(false);
                    }
                  }}
                  disabled={savingName}
                  className="text-[9px] tracking-wider uppercase font-bold text-[#9D6C76] hover:underline cursor-pointer"
                >
                  {savingName ? "Saving..." : "Save"}
                </button>
                <span className="text-[#666666]/30">|</span>
                <button
                  onClick={() => {
                    setIsEditingName(false);
                    setNewName(user?.name || "");
                    setNameError(null);
                  }}
                  disabled={savingName}
                  className="text-[9px] tracking-wider uppercase font-bold text-[#666666] hover:underline cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 border border-[#28273F]/5 bg-[#FAF8F5]/30 rounded-[16px] text-xs font-body text-[#666666]">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#9D6C76]" strokeWidth={1.5} />
                <div>
                  <span className="text-[9px] uppercase font-bold text-[#28273F]/65 block">Account Name</span>
                  <span className="text-sm font-semibold text-[#28273F]">{user?.name}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setNewName(user?.name || "");
                  setNameError(null);
                  setIsEditingName(true);
                }}
                className="text-[10px] tracking-wider uppercase font-semibold text-[#9D6C76] hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 p-4 border border-[#28273F]/5 bg-[#FAF8F5]/30 rounded-[16px] text-xs font-body text-[#666666]">
            <Mail className="w-5 h-5 text-[#9D6C76]" strokeWidth={1.5} />
            <div>
              <span className="text-[9px] uppercase font-bold text-[#28273F]/65 block">Registered Email</span>
              <span className="text-sm font-semibold text-[#28273F]">{user?.email}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Saved Addresses list */}
      <section className="space-y-5">
        <div className="flex justify-between items-center pb-3 border-b border-[#28273F]/5">
          <h2 className="font-heading text-lg text-[#28273F]">Shipping Details</h2>
          {!showForm && (
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="inline-flex items-center gap-1 text-[10px] font-body tracking-wider uppercase font-semibold text-[#9D6C76] border border-[#9D6C76]/20 px-3.5 py-1.5 rounded-[9999px] hover:bg-[#9D6C76]/5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Location
            </button>
          )}
        </div>

        {error && (
          <div className="p-3 bg-[#EF4444]/5 border-l-2 border-[#EF4444] rounded-[6px] text-[10px] text-[#EF4444] font-body">
            {error}
          </div>
        )}

        {/* Form panel */}
        {showForm && (
          <form onSubmit={handleAddAddress} className="space-y-4 border border-[#28273F]/5 rounded-[20px] p-6 bg-[#FAF8F5]/30 animate-fade-in">
            <h3 className="font-heading text-sm text-[#28273F] mb-1">
              {editingAddressId ? "Edit Shipping Location" : "Add Shipping Location"}
            </h3>
            {formError && (
              <div className="p-3 bg-[#EF4444]/5 border-l-2 border-[#EF4444] rounded-[6px] text-[10px] text-[#EF4444] font-body">
                {formError}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-[#666666] font-body">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="please enter Your Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#28273F]/10 rounded-[10px] font-body text-xs text-[#28273F] focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-[#666666] font-body">Mobile Phone *</label>
                <input
                  type="text"
                  required
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#28273F]/10 rounded-[10px] font-body text-xs text-[#28273F] focus:outline-none"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-wider text-[#666666] font-body">Street Address *</label>
              <input
                type="text"
                required
                placeholder="Line 1 (House No, Building, Street)"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#28273F]/10 rounded-[10px] font-body text-xs text-[#28273F] focus:outline-none"
              />
              <input
                type="text"
                placeholder="Line 2 (Area, Colony, Landmark - Optional)"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#28273F]/10 rounded-[10px] font-body text-xs text-[#28273F] focus:outline-none mt-2"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-[#666666] font-body">City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#28273F]/10 rounded-[10px] font-body text-xs text-[#28273F] focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-[#666666] font-body">State *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maharashtra"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#28273F]/10 rounded-[10px] font-body text-xs text-[#28273F] focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-[#666666] font-body">PIN Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 400001"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#28273F]/10 rounded-[10px] font-body text-xs text-[#28273F] focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="font-body text-[10px] font-bold tracking-wider uppercase active:scale-[0.96] transition-all duration-300 ease-[cubic-bezier(0.3,0,0,1)] cursor-pointer flex items-center gap-1.5 shadow-xs"
                style={{
                  background: "transparent",
                  color: "#28273F",
                  border: "1.5px solid #28273F",
                  padding: "10px 24px",
                  borderRadius: "9999px",
                  lineHeight: "1"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#9D6C76";
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.borderColor = "#9D6C76";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#28273F";
                  e.currentTarget.style.borderColor = "#28273F";
                }}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {editingAddressId ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  editingAddressId ? "Update Location" : "Save Location"
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="font-body text-[10px] font-bold tracking-wider uppercase active:scale-[0.96] transition-all duration-300 ease-[cubic-bezier(0.3,0,0,1)] cursor-pointer shadow-xs"
                style={{
                  background: "transparent",
                  color: "#28273F",
                  border: "1.5px solid #28273F",
                  padding: "10px 24px",
                  borderRadius: "9999px",
                  lineHeight: "1"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#28273F";
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.borderColor = "#28273F";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#28273F";
                  e.currentTarget.style.borderColor = "#28273F";
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Addresses list display */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-[#9D6C76]" />
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-10 bg-[#FAF8F5]/35 border border-[#28273F]/5 rounded-[20px] p-6">
            <MapPin className="w-8 h-8 text-[#28273F]/10 mx-auto mb-3" />
            <p className="font-body text-xs text-[#666666] font-light">
              No saved shipping locations found. Add your address for simplified checkout.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-5 border rounded-[20px] bg-white relative flex flex-col justify-between transition-all duration-300 ${
                  addr.is_default ? "border-[#9D6C76] shadow-[0_4px_15px_rgba(157,108,118,0.02)]" : "border-[#28273F]/5 shadow-[0_4px_15px_rgba(40,39,63,0.005)]"
                }`}
              >
                <div className="font-body text-xs text-[#666666] leading-relaxed">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-[#28273F] text-sm">{addr.full_name}</span>
                    {addr.is_default && (
                      <span className="bg-[#9D6C76] text-white text-[8px] font-bold tracking-widest uppercase px-2 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p>{addr.address_line_1}{addr.address_line_2 ? `, ${addr.address_line_2}` : ""}</p>
                  <p>{addr.city}, {addr.state} - <span className="font-bold text-[#28273F]">{addr.postal_code}</span></p>
                  <p className="flex items-center gap-1.5 mt-2 text-[#28273F]/75">
                    <Phone className="w-3.5 h-3.5 text-[#9D6C76]" />
                    {addr.phone}
                  </p>
                </div>

                <div className="flex gap-3 mt-5 pt-4 border-t border-[#28273F]/5">
                  {!addr.is_default && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      disabled={actionId === addr.id}
                      className="text-[9px] font-body tracking-wider uppercase font-semibold text-[#9D6C76] hover:underline cursor-pointer"
                    >
                      Set As Default
                    </button>
                  )}
                  <button
                    onClick={() => handleEditClick(addr)}
                    disabled={actionId === addr.id}
                    className={`inline-flex items-center gap-1 text-[9px] font-body tracking-wider uppercase font-semibold text-[#9D6C76] hover:underline cursor-pointer ${addr.is_default ? "" : "ml-auto"}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    disabled={actionId === addr.id}
                    className={`inline-flex items-center gap-1 text-[9px] font-body tracking-wider uppercase font-semibold text-[#EF4444] hover:underline cursor-pointer ${addr.is_default ? "ml-auto" : ""}`}
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;