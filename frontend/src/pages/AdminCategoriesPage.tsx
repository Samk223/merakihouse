import React, { useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import {
  Plus,
  Trash2,
  Loader2,
  CheckCircle,
  XCircle,
  FolderOpen
} from "lucide-react";

interface CategoryType {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  media?: Array<{
    id: number;
    path: string;
    is_primary: boolean;
    sort_order: number;
  }>;
}

export const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form Modal State
  const [showModal, setShowModal] = useState(false);
  
  // Fields State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [masterPhoto, setMasterPhoto] = useState("");
  const [heroBanner, setHeroBanner] = useState("");
  
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/admin/categories", {
        params: { per_page: 50 }
      });
      // Categories paginated response returns list inside data.data
      setCategories(response.data.data || []);
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setName("");
    setDescription("");
    setDisplayOrder("0");
    setIsActive(true);
    setMasterPhoto("");
    setHeroBanner("");
    setError(null);
    setShowModal(true);
  };

  const handleDelete = async (catId: number) => {
    if (!window.confirm("Are you sure you want to delete this category? This will soft-delete it from the shop.")) return;
    try {
      const response = await apiClient.delete(`/admin/categories/${catId}`);
      if (response.data.success || response.status === 200) {
        setCategories(categories.filter((c) => c.id !== catId));
      }
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const mediaList = [];
    if (masterPhoto) {
      mediaList.push({
        type: "image",
        path: masterPhoto,
        is_primary: true,
        mime_type: "image/png",
        alt_text: `${name} Collection Master Photo`,
        sort_order: 0
      });
    }
    if (heroBanner) {
      mediaList.push({
        type: "image",
        path: heroBanner,
        is_primary: false,
        mime_type: "image/png",
        alt_text: `${name} Hero Banner`,
        sort_order: 1
      });
    }

    const payload = {
      name,
      description: description || undefined,
      display_order: parseInt(displayOrder) || 0,
      is_active: isActive,
      media: mediaList.length > 0 ? mediaList : undefined
    };

    try {
      const response = await apiClient.post("/admin/categories", payload);
      if (response.data.success || response.status === 201) {
        setCategories([response.data.data, ...categories]);
        setShowModal(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create category. Please verify your details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full space-y-6 animate-fade-in select-none">
      {/* Page Header */}
      <div className="flex justify-between items-center pb-3 border-b border-[#28273F]/5">
        <div>
          <h1 className="font-heading text-2xl text-[#28273F] tracking-wide">
            Category Sanctuary
          </h1>
          <p className="font-body text-xs text-[#666666] tracking-wide mt-1">
            Configure your shop collections, banner layouts, and menu categories.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 bg-[#28273F] text-white px-5 py-3 rounded-[9999px] font-body text-xs font-semibold uppercase tracking-wider hover:bg-[#9D6C76] active:scale-[0.96] transition-all cursor-pointer shadow-button"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Categories table grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#9D6C76]" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 bg-white border border-[#28273F]/5 rounded-[24px] p-6 shadow-[0_8px_30px_rgba(40,39,63,0.005)]">
          <FolderOpen className="w-10 h-10 text-[#28273F]/10 mx-auto mb-3" />
          <p className="font-body text-xs text-[#666666] font-light">No collections registered yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#28273F]/5 rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgba(40,39,63,0.005)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body text-xs text-[#666666]">
              <thead>
                <tr className="border-b border-[#28273F]/5 text-[10px] uppercase tracking-wider text-[#28273F]/75 font-semibold bg-[#FAF8F5]/50">
                  <th className="p-4">Category Name</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Display Order</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-[#28273F]/5 hover:bg-[#FAF8F5]/30">
                    <td className="p-4">
                      <div className="font-semibold text-[#28273F] text-sm">{cat.name}</div>
                      <div className="text-[10px] text-[#666666] font-light mt-0.5 max-w-[300px] truncate">{cat.description || "No description provided."}</div>
                    </td>
                    <td className="p-4 text-[#9D6C76] font-mono">{cat.slug}</td>
                    <td className="p-4 font-semibold text-[#28273F]">{cat.display_order}</td>
                    <td className="p-4">
                      {cat.is_active ? (
                        <span className="flex items-center gap-1 text-[#10B981] font-semibold text-[10px]">
                          <CheckCircle className="w-3.5 h-3.5 fill-[#10B981]/10" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[#EF4444] font-semibold text-[10px]">
                          <XCircle className="w-3.5 h-3.5 fill-[#EF4444]/10" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-2 border border-[#28273F]/5 rounded-full hover:bg-[#EF4444]/5 text-[#EF4444] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#28273F]/35 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          
          <div className="w-full max-w-[600px] bg-white border border-[#28273F]/5 rounded-[24px] p-6 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto animate-scale">
            <h2 className="font-heading text-lg text-[#28273F] mb-4 pb-3 border-b border-[#28273F]/5">
              Create New Category
            </h2>

            {error && (
              <div className="p-3 bg-[#EF4444]/5 border-l-2 border-[#EF4444] rounded-[6px] text-xs text-[#EF4444] font-body mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 font-body text-xs text-[#666666]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Scalp Formulations"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[10px] text-[#28273F] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Display Order</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[10px] text-[#28273F] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Description</label>
                <textarea
                  rows={3}
                  placeholder="Tell customers about the ingredients or purpose of this collection..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[10px] text-[#28273F] focus:outline-none resize-none"
                />
              </div>

              {/* Master Photo Input & Guidelines */}
              <div className="space-y-1.5 p-3.5 bg-[#FAF8F5] rounded-[14px] border border-[#28273F]/5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#28273F]">Collection Master Photo Path</label>
                  <span className="text-[9px] text-[#9D6C76] font-semibold">Ratio: 4:3 (e.g. 640x480px)</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. /home/categories/hair_care_thumbnail.png"
                  value={masterPhoto}
                  onChange={(e) => setMasterPhoto(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#28273F]/10 rounded-[10px] text-[#28273F] focus:outline-none"
                />
                <p className="text-[9px] text-[#888888] font-light">
                  This photo serves as the master cover card displayed on the collections catalog grid.
                </p>
              </div>

              {/* Hero Banner Input & Guidelines */}
              <div className="space-y-1.5 p-3.5 bg-[#FAF8F5] rounded-[14px] border border-[#28273F]/5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#28273F]">Hero Banner Image Path</label>
                  <span className="text-[9px] text-[#9D6C76] font-semibold">Ratio: 1920x450px (Wide)</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. /home/categories/hair_care_hero_v3.png"
                  value={heroBanner}
                  onChange={(e) => setHeroBanner(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#28273F]/10 rounded-[10px] text-[#28273F] focus:outline-none"
                />
                <p className="text-[9px] text-[#888888] font-light">
                  This landscape banner stretches across the top header of the category products page.
                </p>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="accent-[#9D6C76]"
                  />
                  Active status (visible to storefront users)
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#28273F]/5">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#28273F] text-white py-2.5 px-6 rounded-[9999px] font-body text-[10px] font-bold tracking-wider uppercase hover:bg-[#9D6C76] active:scale-[0.96] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Save Category"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="border border-[#28273F]/10 text-[#28273F] py-2.5 px-6 rounded-[9999px] font-body text-[10px] font-bold tracking-wider uppercase hover:bg-[#28273F]/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;
