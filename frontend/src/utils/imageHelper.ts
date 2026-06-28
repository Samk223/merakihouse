export const resolveImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/storage/") || path.startsWith("storage/")) {
    const clean = path.startsWith("/") ? path : `/${path}`;
    return `http://localhost:8000${clean}`;
  }
  if (path.startsWith("/uploads/") || path.startsWith("uploads/")) {
    const clean = path.startsWith("/") ? path : `/${path}`;
    return `http://localhost:8000${clean}`;
  }
  return path;
};

// Keep resolveProductImage as a compatibility export pointing to resolveImageUrl
export const resolveProductImage = (path?: string) => {
  const resolved = resolveImageUrl(path);
  return resolved || "/placeholders/product.png";
};
