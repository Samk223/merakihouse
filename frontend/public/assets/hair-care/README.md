# Hair Care Category Asset Guidelines

This document outlines the organized folder structure, naming conventions, asset standards, and best practices for managing media assets in the Hair Care category.

---

# Folder Structure

## Category-Level Folders

*   **`hero/`**: Promotional banners for the main category page header.
    *   **`hero/desktop/`**: Banners optimized for desktop layouts (16:5 or 3:1 ratio).
    *   **`hero/mobile/`**: Banners optimized for mobile viewports (3:4 or 9:16 ratio).
*   **`banners/`**: Seasonal, promotional, or secondary campaign banners.
*   **`thumbnails/`**: Small square/rectangular image assets for category navigation, filters, or cart items.
*   **`icons/`**: Badges, stamps, or vector symbols representing certifications and category attributes (e.g., sulfate-free, organic).
*   **`illustrations/`**: Custom graphics, diagrams, and vectors illustrating routine steps or product benefits.
*   **`lifestyle/`**: Model photography and styled product placement images.
*   **`ingredients/`**: High-quality imagery of natural ingredients (e.g., Rosemary, Aloe Vera, Argan Oil).
    *   **`ingredients/rosemary/`**: Rosemary raw plant closeups and spotlight graphics.
    *   **`ingredients/aloe-vera/`**: Aloe Vera plant closeups and spotlight graphics.
    *   **`ingredients/argan-oil/`**: Argan oil and kernel imagery.
*   **`videos/`**: Tutorials, category promos, and educational video assets.
*   **`collection/`**: Curated product group assets or composite category layout graphics.
*   **`gift-kit/`**: Creative packaging and styling assets for Hair Care bundles or holiday gift sets.

## Product-Level Folders (`products/[product-name]/`)

Every individual product folder under `products/` is structured with these folders:
*   **`front/`**: Primary product image showing the front of the packaging or product bar, isolated on a clean background.
*   **`back/`**: Product image showing the back of the packaging (barcode, ingredients, warnings).
*   **`angle/`**: 3D perspective product shots showing side, top, or three-quarter views.
*   **`flatlay/`**: Creative flatlay/top-down arrangements featuring the product with props or raw ingredients.
*   **`lifestyle/`**: Contextual or modeled photography featuring the product in a real-world setting.
*   **`videos/`**: How-to-use videos, texture demonstrations, or close-up reels.

---

# Naming Convention

Always use kebab-case for naming files. Avoid spaces or uppercase characters to ensure web compatibility.

*   `hair-care-hero-master.webp` (original master hero file)
*   `hair-care-hero-desktop.webp` (desktop hero banner)
*   `hair-care-hero-mobile.webp` (mobile hero banner)
*   `hair-care-thumbnail.webp` (category listing thumbnail)
*   `hair-care-lifestyle-01.webp` (lifestyle display image 1)
*   `hair-care-lifestyle-02.webp` (lifestyle display image 2)
*   `hair-care-ingredient-rosemary.webp` (rosemary ingredient card image)
*   `hair-care-ingredient-aloe-vera.webp` (aloe vera ingredient card image)
*   `hair-care-video-hero.mp4` (main category intro/background video)

---

# Image Standards

To optimize load speeds and layout consistency:
*   **Preferred Format**: **WebP** (modern standard).
*   **Color Profile**: sRGB.

### Resolution Recommendations
*   **Desktop Hero**: `1920 x 600 px` (Aspect Ratio: ~3:1)
*   **Mobile Hero**: `750 x 1000 px` (Aspect Ratio: 3:4)
*   **Thumbnail**: `150 x 150 px` (Aspect Ratio: 1:1)
*   **Lifestyle**: `1200 x 800 px` (Aspect Ratio: 3:2)
*   **Ingredient**: `800 x 800 px` (Aspect Ratio: 1:1)
*   **Packaging / Product**: `1000 x 1000 px` (Aspect Ratio: 1:1)

---

# Video Standards

To ensure smooth, high-quality playback across devices without impacting performance:
*   **Format**: **MP4** (or WebM for modern fallback).
*   **Codec**: **H.264** video, AAC audio.
*   **Frame Rate**: **24–30 FPS**.
*   **Resolution**: **1080p minimum** (`1920 x 1080 px` landscape, or `1080 x 1920 px` portrait reels).

---

# Best Practices

*   **Never overwrite approved assets**: If a new version of an asset is approved, name it as a new version or archive the old one.
*   **Always keep the original master asset**: Preserve the original, lossless file (PSD, TIFF, or high-res PNG) in a separate, secure, off-project archive.
*   **Generate derivatives from the master**: Create all sized, cropped, or compressed web-ready versions (e.g., WebP/MP4) from the master asset rather than re-compressing derivatives.
*   **Keep documentation clean and professional**: Keep this file updated as structural changes occur.
