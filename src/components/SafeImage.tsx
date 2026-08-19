import React, { useState, useEffect } from "react";
import { ShoppingBag, UtensilsCrossed, Package, ImageOff } from "lucide-react";

export interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  fallbackSrc?: string | string[];
  fallbackIcon?: "shopping-bag" | "utensils" | "package" | "image-off" | React.ReactNode;
  iconClassName?: string;
  showIconFallback?: boolean;
  loading?: "lazy" | "eager";
}

export default function SafeImage({
  src,
  alt,
  className = "",
  containerClassName = "",
  fallbackSrc,
  fallbackIcon = "shopping-bag",
  iconClassName = "w-8 h-8 text-stone-400 stroke-[1.5]",
  loading = "lazy",
  ...props
}: SafeImageProps) {
  // Build ordered queue of image URLs to try
  const getCandidateUrls = (): string[] => {
    const urls: string[] = [];
    if (src && src.trim()) {
      urls.push(src.trim());
      // If local asset path, add Supabase storage mirror as automatic cloud fallback
      if (src.startsWith("/images/") || src.startsWith("images/")) {
        const cleanPath = src.replace(/^\/?images\//, "");
        urls.push(`https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/site-assets/${cleanPath}`);
      }
    }
    if (Array.isArray(fallbackSrc)) {
      fallbackSrc.forEach((f) => {
        if (f && f.trim() && !urls.includes(f.trim())) {
          urls.push(f.trim());
        }
      });
    } else if (fallbackSrc && fallbackSrc.trim() && !urls.includes(fallbackSrc.trim())) {
      urls.push(fallbackSrc.trim());
    }
    return urls;
  };

  const [candidateList, setCandidateList] = useState<string[]>(getCandidateUrls());
  const [candidateIndex, setCandidateIndex] = useState<number>(0);
  const [imgStatus, setImgStatus] = useState<"loading" | "loaded" | "error">(
    getCandidateUrls().length > 0 ? "loading" : "error"
  );

  useEffect(() => {
    const candidates = getCandidateUrls();
    setCandidateList(candidates);
    setCandidateIndex(0);
    setImgStatus(candidates.length > 0 ? "loading" : "error");
  }, [src, Array.isArray(fallbackSrc) ? fallbackSrc.join("|") : fallbackSrc]);

  const currentSrc = candidateList[candidateIndex] || "";

  const handleError = () => {
    if (candidateIndex + 1 < candidateList.length) {
      setCandidateIndex((prev) => prev + 1);
      setImgStatus("loading");
    } else {
      setImgStatus("error");
    }
  };

  const handleLoad = () => {
    setImgStatus("loaded");
  };

  // Render Default Icon Component
  const renderDefaultIcon = () => {
    if (React.isValidElement(fallbackIcon)) {
      return fallbackIcon;
    }

    switch (fallbackIcon) {
      case "utensils":
        return <UtensilsCrossed className={iconClassName} />;
      case "package":
        return <Package className={iconClassName} />;
      case "image-off":
        return <ImageOff className={iconClassName} />;
      case "shopping-bag":
      default:
        return <ShoppingBag className={iconClassName} />;
    }
  };

  // If permanently in error state, display styled container with default icon
  if (imgStatus === "error" || !currentSrc) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-stone-100 text-stone-400 select-none ${containerClassName || className}`}
        role="img"
        aria-label={alt || "Product placeholder"}
      >
        <div className="flex flex-col items-center justify-center p-3 text-center">
          {renderDefaultIcon()}
          {alt && (
            <span className="text-[10px] text-stone-500 font-medium mt-1 line-clamp-1 max-w-[90%] opacity-75">
              {alt}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Loading shimmer overlay */}
      {imgStatus === "loading" && (
        <div className="absolute inset-0 bg-stone-100 animate-pulse flex items-center justify-center z-10">
          <ShoppingBag className="w-6 h-6 text-stone-300 animate-pulse stroke-[1.5]" />
        </div>
      )}

      <img
        {...props}
        src={currentSrc}
        alt={alt}
        loading={loading}
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} transition-opacity duration-300 ${
          imgStatus === "loaded" ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
