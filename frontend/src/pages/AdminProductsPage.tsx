import React, { useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Package,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";

interface AdminProductType {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description?: string;
  short_description?: string | null;
  brand?: string;
  gst_percentage?: number;
  low_stock_threshold?: number;
  weight?: string;
  dimensions?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  price: string;
  discount_price: string | null;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  media?: Array<{
    id: number;
    url: string;
    path?: string;
    is_primary: boolean;
  }>;
}

export const AdminProductsPage = () => {
  const [products, setProducts] = useState<AdminProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [lowStockFilter, setLowStockFilter] = useState(false);

  // Form Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProductType | null>(null);
  // Fields State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState("1");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("Meraki House");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [gstPercentage, setGstPercentage] = useState("18");
  const [lowStockThreshold, setLowStockThreshold] = useState("5");
  const [weight, setWeight] = useState("0.00");
  const [dimensions, setDimensions] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [imagePath, setImagePath] = useState("");
  const [originalImagePath, setOriginalImagePath] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get("/categories");
      setCategoriesList(response.data.data || []);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const response = await apiClient.post("/admin/products/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      if (response.data.success || response.data.path) {
        setImagePath(response.data.path);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to upload selected image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePasteImage = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData.items;
    let imageFile: File | null = null;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        imageFile = items[i].getAsFile();
        break;
      }
    }
    
    if (imageFile) {
      e.preventDefault();
      setUploadingImage(true);
      setError(null);
      
      const formData = new FormData();
      formData.append("file", imageFile);
      
      try {
        const response = await apiClient.post("/admin/products/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        
        if (response.data.success || response.data.path) {
          setImagePath(response.data.path);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to upload pasted image.");
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/admin/products", {
        params: {
          search: debouncedSearch || undefined,
          category: categoryFilter || undefined,
          low_stock: lowStockFilter ? "true" : undefined,
        },
      });
      // Collection Resource wrapped response lists items in data.data
      setProducts(response.data.data || []);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, categoryFilter, lowStockFilter]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setName("");
    setSlug("");
    setSku("");
    setCategoryId("1");
    setShortDescription("");
    setDescription("");
    setBrand("Meraki House");
    setPrice("");
    setDiscountPrice("");
    setStock("50");
    setGstPercentage("18");
    setLowStockThreshold("5");
    setWeight("0.00");
    setDimensions("");
    setMetaTitle("");
    setMetaDescription("");
    setIsActive(true);
    setIsFeatured(false);
    setIsBestSeller(false);
    setIsNewArrival(false);
    setImagePath("");
    setShowModal(true);
  };

  const handleOpenEdit = (prod: AdminProductType) => {
    setEditingProduct(prod);
    setName(prod.name);
    setSlug(prod.slug);
    setSku(prod.sku);
    setCategoryId(prod.category?.id.toString() || "1");
    setDescription(prod.description || "");
    setShortDescription(prod.short_description || "");
    setBrand(prod.brand || "Meraki House");
    setGstPercentage(prod.gst_percentage?.toString() || "18");
    setLowStockThreshold(prod.low_stock_threshold?.toString() || "5");
    setWeight(prod.weight || "0.00");
    setDimensions(prod.dimensions || "");
    setMetaTitle(prod.meta_title || "");
    setMetaDescription(prod.meta_description || "");
    
    const pVal = parseFloat(prod.price);
    const dVal = prod.discount_price ? parseFloat(prod.discount_price) : 0;
    
    if (dVal > 0) {
      if (pVal > dVal) {
        // Correctly stored: price is regular (higher), discount_price is sale (lower)
        setPrice(prod.discount_price || "");
        setDiscountPrice(prod.price);
      } else {
        // Legacy incorrect storage: price is sale (lower), discount_price is regular (higher)
        setPrice(prod.price);
        setDiscountPrice(prod.discount_price || "");
      }
    } else {
      setPrice(prod.price);
      setDiscountPrice("");
    }
    
    setStock(prod.stock.toString());
    setIsActive(prod.is_active);
    setIsFeatured(prod.is_featured || false);
    setIsBestSeller(prod.is_best_seller || false);
    setIsNewArrival(prod.is_new_arrival || false);
    const primaryImg = prod.media?.find((img) => img.is_primary)?.url || "";
    setImagePath(primaryImg);
    setOriginalImagePath(primaryImg);
    setShowModal(true);
  };

  const handleDelete = async (prodId: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const response = await apiClient.delete(`/admin/products/${prodId}`);
      if (response.data.success || response.status === 200) {
        setProducts(products.filter((p) => p.id !== prodId));
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!editingProduct && !imagePath) {
      setError("Product image is required for new product creation.");
      setSubmitting(false);
      return;
    }

    const activePriceNum = parseFloat(price);
    const strikethroughPriceNum = discountPrice ? parseFloat(discountPrice) : null;

    if (strikethroughPriceNum && activePriceNum > strikethroughPriceNum) {
      setError("The active price must be less than or equal to the strikethrough price.");
      setSubmitting(false);
      return;
    }

    const payload: any = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      sku,
      category_id: parseInt(categoryId),
      description: description || name,
      short_description: shortDescription || name, // Fallback to name to satisfy NOT NULL constraint
      brand: brand || "Meraki House",
      price: strikethroughPriceNum ? strikethroughPriceNum : activePriceNum,
      discount_price: strikethroughPriceNum ? activePriceNum : null,
      stock: parseInt(stock),
      gst_percentage: parseInt(gstPercentage),
      low_stock_threshold: parseInt(lowStockThreshold),
      weight: parseFloat(weight),
      dimensions: dimensions || null,
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
      is_active: isActive,
      is_featured: isFeatured,
      is_best_seller: isBestSeller,
      is_new_arrival: isNewArrival,
      product_type: "simple",
    };

    if (imagePath && imagePath !== originalImagePath) {
      let cleanPath = imagePath;
      if (imagePath.includes("/storage/")) {
        cleanPath = imagePath.split("/storage/")[1];
      }
      payload.media = [
        {
          type: "image",
          path: cleanPath,
          is_primary: true,
          mime_type: "image/png",
          alt_text: `${name} Product Image`,
          sort_order: 0
        }
      ];
    }

    try {
      if (editingProduct) {
        const response = await apiClient.put(`/admin/products/${editingProduct.id}`, payload);
        if (response.status === 200 || response.data.success) {
          setProducts(products.map((p) => (p.id === editingProduct.id ? response.data.data : p)));
          setShowModal(false);
        }
      } else {
        const response = await apiClient.post("/admin/products", payload);
        if (response.status === 201 || response.data.success) {
          setProducts([response.data.data, ...products]);
          setShowModal(false);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save product details.");
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
            Product Sanctuary
          </h1>
          <p className="font-body text-xs text-[#666666] tracking-wide mt-1">
            Manage your boutique formulations, stock levels, and flags.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 bg-[#28273F] text-white px-5 py-3 rounded-[9999px] font-body text-xs font-semibold uppercase tracking-wider hover:bg-[#9D6C76] active:scale-[0.96] transition-all cursor-pointer shadow-button"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Product Filters bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 border border-[#28273F]/5 rounded-[20px] shadow-[0_8px_30px_rgba(40,39,63,0.005)]">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by SKU or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "42px" }}
            className="w-full pr-4 py-2.5 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[9999px] font-body text-xs text-[#28273F] focus:outline-none focus:border-[#9D6C76] focus:ring-1 focus:ring-[#9D6C76]/30 transition-all duration-300"
          />
          <Search className="w-3.5 h-3.5 text-[#9D6C76] absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%239D6C76' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 24 24'><path d='m6 9 6 6 6-6'/></svg>")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 14px center",
            backgroundSize: "10px",
            paddingLeft: "16px",
            paddingRight: "36px"
          }}
          className="appearance-none px-3.5 py-2.5 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[9999px] font-body text-xs text-[#28273F] font-semibold focus:outline-none focus:border-[#9D6C76] focus:ring-1 focus:ring-[#9D6C76]/30 transition-all duration-300 cursor-pointer"
        >
          <option value="">All Categories</option>
          {categoriesList.map((cat) => (
            <option key={cat.id} value={cat.id.toString()}>
              {cat.name}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 cursor-pointer font-body text-xs text-[#666666] select-none">
          <input
            type="checkbox"
            checked={lowStockFilter}
            onChange={(e) => setLowStockFilter(e.target.checked)}
            className="accent-[#9D6C76]"
          />
          Low Stock Only
        </label>
      </div>

      {/* Products table grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#9D6C76]" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-white border border-[#28273F]/5 rounded-[24px] p-6 shadow-[0_8px_30px_rgba(40,39,63,0.005)]">
          <Package className="w-10 h-10 text-[#28273F]/10 mx-auto mb-3" />
          <p className="font-body text-xs text-[#666666] font-light">No formulations match your search criteria.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#28273F]/5 rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgba(40,39,63,0.005)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body text-xs text-[#666666]">
              <thead>
                <tr className="border-b border-[#28273F]/5 text-[10px] uppercase tracking-wider text-[#28273F]/75 font-semibold bg-[#FAF8F5]/50">
                  <th className="p-4">SKU / Item</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod.id} className="border-b border-[#28273F]/5 hover:bg-[#FAF8F5]/30">
                    <td className="p-4">
                      <div className="font-semibold text-[#28273F] text-sm">{prod.name}</div>
                      <div className="text-[9px] uppercase tracking-widest text-[#9D6C76] font-bold mt-0.5">{prod.sku}</div>
                    </td>
                    <td className="p-4 capitalize">{prod.category?.name || "Uncategorized"}</td>
                    <td className="p-4 font-semibold text-[#28273F]">
                      ₹{parseFloat(prod.price).toLocaleString("en-IN")}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-semibold ${prod.stock <= 5 ? "text-[#EF4444] font-bold" : "text-[#28273F]"}`}>
                          {prod.stock}
                        </span>
                        {prod.stock <= 5 && (
                          <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {prod.is_active ? (
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
                          onClick={() => handleOpenEdit(prod)}
                          className="p-2 border border-[#28273F]/5 rounded-full hover:bg-[#28273F]/5 text-[#28273F]/75 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id)}
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

      {/* Add / Edit Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 md:p-10 flex items-start justify-center">
          <div className="fixed inset-0 bg-[#28273F]/35 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          
          <div className="w-full max-w-[600px] bg-white border border-[#28273F]/5 rounded-[24px] p-6 md:p-8 shadow-2xl relative z-10 my-8 animate-scale">
            <h2 className="font-heading text-lg text-[#28273F] mb-4 pb-3 border-b border-[#28273F]/5">
              {editingProduct ? "Edit Product Details" : "Create New Product"}
            </h2>

            {error && (
              <div className="p-3 bg-[#EF4444]/5 border-l-2 border-[#EF4444] rounded-[6px] text-xs text-[#EF4444] font-body mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 font-body text-xs text-[#666666]">
              {/* Row 1: Product Name & SKU */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lavender Sage Soy Candle"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[10px] text-[#28273F] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">SKU Identifier *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HOME-CAND-LAV-01"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[10px] text-[#28273F] focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Slug URL & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Slug URL</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if empty"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[10px] text-[#28273F] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    style={{
                      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%239D6C76' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 24 24'><path d='m6 9 6 6 6-6'/></svg>")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                      backgroundSize: "10px",
                      paddingLeft: "12px",
                      paddingRight: "32px"
                    }}
                    className="appearance-none w-full py-2.5 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[10px] text-[#28273F] focus:outline-none focus:border-[#9D6C76] focus:ring-1 focus:ring-[#9D6C76]/30 transition-all duration-300 cursor-pointer"
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Product Description & Short Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Description (Long Text)</label>
                <textarea
                  rows={3}
                  placeholder="Tell the story of this formulation, its botanical benefits, ingredients, and usage ritual..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[10px] text-[#28273F] focus:outline-none resize-y"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Short Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Organic, cold-pressed hibiscus shampoo bar."
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[10px] text-[#28273F] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Brand Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Meraki House"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[10px] text-[#28273F] focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 4: Pricing & Stock */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="299"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[10px] text-[#28273F] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Strikethrough Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="399"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[10px] text-[#28273F] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    placeholder="50"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[10px] text-[#28273F] focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 5: Low Stock Threshold, GST, Weight, Dimensions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[#666666]">Low Stock Alert</label>
                  <input
                    type="number"
                    required
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[10px] text-[#28273F] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[#666666]">GST (%)</label>
                  <input
                    type="number"
                    required
                    value={gstPercentage}
                    onChange={(e) => setGstPercentage(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[10px] text-[#28273F] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[#666666]">Weight (g)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[10px] text-[#28273F] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[#666666]">Dimensions (cm)</label>
                  <input
                    type="text"
                    placeholder="e.g. 10x5x5"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[10px] text-[#28273F] focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 6: SEO Meta Title & Meta Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[#666666]">SEO Meta Title</label>
                  <input
                    type="text"
                    placeholder="Search engine title..."
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[10px] text-[#28273F] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[#666666]">SEO Meta Description</label>
                  <input
                    type="text"
                    placeholder="Search engine summary..."
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#28273F]/10 rounded-[10px] text-[#28273F] focus:outline-none"
                  />
                </div>
              </div>

              {/* Product Image Path Field */}
              <div className="space-y-1 p-3 bg-[#FAF8F5] rounded-[14px] border border-[#28273F]/5">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#28273F]">
                    Product Image Path {editingProduct ? "" : "*"}
                  </label>
                  <span className="text-[9px] text-[#9D6C76] font-semibold">
                    {uploadingImage ? "Uploading..." : "Recommended: Square, e.g. 600x600px"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. /home/products/hair_serum.png (or paste / browse image)"
                    value={imagePath}
                    onChange={(e) => setImagePath(e.target.value)}
                    onPaste={handlePasteImage}
                    disabled={uploadingImage}
                    className="flex-grow px-3 py-2 bg-white border border-[#28273F]/10 rounded-[10px] text-[#28273F] focus:outline-none focus:border-[#9D6C76]"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="bg-[#28273F]/5 text-[#28273F] border border-[#28273F]/10 hover:bg-[#28273F]/10 font-bold px-4 py-2 rounded-[10px] uppercase tracking-wider text-[9px] transition-colors cursor-pointer"
                  >
                    Browse
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="accent-[#9D6C76]"
                  />
                  Active status
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="accent-[#9D6C76]"
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="accent-[#9D6C76]"
                  />
                  Best Seller
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="accent-[#9D6C76]"
                  />
                  New Arrival
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
                      Saving...
                    </>
                  ) : (
                    "Save Product"
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

export default AdminProductsPage;