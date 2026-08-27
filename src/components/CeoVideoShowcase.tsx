import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Play, Pause, Volume2, VolumeX, Sparkles, Award, 
  ShoppingBag, MessageCircle, CheckCircle2, ShieldCheck, 
  ExternalLink, Video, ChevronRight, Maximize2
} from "lucide-react";
import { CeoVideoConfig, Product } from "../types";
import { getDbCeoVideo, getProductImageUrl } from "../lib/supabase";
import { DEFAULT_CEO_VIDEO_CONFIG } from "../data";
import SafeImage from "./SafeImage";

interface CeoVideoShowcaseProps {
  products: Product[];
  onAddToCart: (product: Product, quantity?: number) => void;
  onInstantBuy?: (product: Product) => void;
  onOpenProductDetail?: (product: Product) => void;
}

export default function CeoVideoShowcase({
  products,
  onAddToCart,
  onInstantBuy,
  onOpenProductDetail
}: CeoVideoShowcaseProps) {
  const [config, setConfig] = useState<CeoVideoConfig>(DEFAULT_CEO_VIDEO_CONFIG);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Load configuration and listen for immediate live updates
  useEffect(() => {
    async function loadVideoConfig() {
      try {
        const data = await getDbCeoVideo();
        if (data) {
          setConfig(data);
        }
      } catch (err) {
        console.warn("Failed to load CEO video config", err);
      }
    }
    loadVideoConfig();

    // Event listener for instant immediate updates when Admin saves new video link/file
    const handleVideoUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CeoVideoConfig>;
      if (customEvent.detail && customEvent.detail.videoUrl) {
        setConfig(customEvent.detail);
        setIsPlaying(false); // Reset player to display new video
      } else {
        loadVideoConfig();
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "rozay_ceo_video" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && parsed.videoUrl) {
            setConfig(parsed);
            setIsPlaying(false);
          }
        } catch (err) {}
      }
    };

    // Re-check database when tab gains focus
    const handleFocus = () => {
      loadVideoConfig();
    };

    window.addEventListener("rozay_ceo_video_updated", handleVideoUpdate);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("rozay_ceo_video_updated", handleVideoUpdate);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  if (!config.isActive) {
    return null;
  }

  // Find the featured product from catalog (or fallback to first chafing dish)
  const featuredProduct = 
    products.find((p) => p.id === config.featuredProductId) ||
    products.find((p) => p.category.toLowerCase().includes("chafing")) ||
    products[0];

  const rawUrl = (config.videoUrl || "").trim();

  // Helper to determine if video is an iframe embed or direct HTML5 video
  const isYouTube = rawUrl.includes("youtube.com") || rawUrl.includes("youtu.be");
  const isVimeo = rawUrl.includes("vimeo.com");
  const isGoogleDrive = rawUrl.includes("drive.google.com");

  // Format any video URL into an instant high-quality player embed URL
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    let clean = url.trim();

    // YouTube Shorts (e.g. https://www.youtube.com/shorts/VIDEO_ID)
    if (clean.includes("/shorts/")) {
      const parts = clean.split("/shorts/")[1];
      const videoId = parts?.split("?")[0]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    }

    // YouTube Standard Watch (e.g. https://www.youtube.com/watch?v=VIDEO_ID)
    if (clean.includes("youtube.com/watch")) {
      const match = clean.match(/[?&]v=([^&]+)/);
      const videoId = match ? match[1] : "";
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
      }
    }

    // YouTube Shortened (e.g. https://youtu.be/VIDEO_ID)
    if (clean.includes("youtu.be/")) {
      const parts = clean.split("youtu.be/")[1];
      const videoId = parts?.split("?")[0]?.split("&")[0];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
      }
    }

    // Already an embed URL
    if (clean.includes("youtube.com/embed/")) {
      return clean.includes("autoplay=1") ? clean : `${clean}${clean.includes("?") ? "&" : "?"}autoplay=1&rel=0`;
    }

    // Vimeo (e.g. https://vimeo.com/123456789)
    if (clean.includes("vimeo.com/") && !clean.includes("player.vimeo.com")) {
      const id = clean.split("vimeo.com/")[1]?.split("?")[0];
      return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }

    // Google Drive (e.g. https://drive.google.com/file/d/ID/view)
    if (clean.includes("drive.google.com/file/d/")) {
      const id = clean.split("/file/d/")[1]?.split("/")[0];
      return `https://drive.google.com/file/d/${id}/preview`;
    }

    return clean;
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Rozay Kitchen, I watched CEO Alaekwe Onyebuchi's live showcase video of the ${featuredProduct?.name || "Luxury Chafing Dish"} (₦${Number(featuredProduct?.price || 140000).toLocaleString()}). I would like to place an order or make a wholesale inquiry.`
  );

  return (
    <section id="ceo-showcase" className="py-20 lg:py-28 bg-gradient-to-b from-[#1c1917] via-[#141211] to-[#0c0a09] text-white relative overflow-hidden border-y border-amber-500/20">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-yellow-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 lg:mb-20 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider shadow-inner">
            <Video className="w-3.5 h-3.5 text-amber-400" />
            <span>EXECUTIVE VIDEO SHOWCASE</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
            {config.title}
          </h2>

          <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {config.subtitle}
          </p>
        </div>

        {/* Video & Featured Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: High-End Video Player (7 Columns) */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl overflow-hidden bg-stone-900 border-2 border-amber-500/30 shadow-2xl shadow-black/80 group">
              
              {/* Aspect Ratio Container (16:9) */}
              <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
                {isPlaying ? (
                  isYouTube || isVimeo || isGoogleDrive ? (
                    <iframe
                      src={getEmbedUrl(config.videoUrl)}
                      title={config.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0 absolute inset-0"
                    />
                  ) : (
                    <video
                      src={config.videoUrl}
                      controls
                      autoPlay
                      playsInline
                      muted={isMuted}
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  /* Custom Video Poster & Big Play Button */
                  <div className="relative w-full h-full group/poster">
                    <img
                      src={config.posterUrl || "https://i.ibb.co/gbjcKSgb/Whats-App-Image-2026-08-13-at-17-09-03.jpg"}
                      alt="Alaekwe Onyebuchi CEO Product Walkthrough"
                      className="w-full h-full object-cover opacity-80 group-hover/poster:scale-105 transition-transform duration-700"
                    />

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                    {/* CEO Badge on Poster */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/80 backdrop-blur-md border border-amber-500/40 text-amber-300 px-3 py-1.5 rounded-full text-xs font-mono font-bold">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{config.ceoName} • {config.ceoTitle}</span>
                    </div>

                    {/* Central Play Button */}
                    <button
                      type="button"
                      onClick={() => setIsPlaying(true)}
                      className="absolute inset-0 m-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 text-stone-950 flex items-center justify-center shadow-2xl shadow-amber-500/50 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer group/btn"
                      aria-label="Play CEO Video Showcase"
                    >
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1 group-hover/btn:scale-110 transition-transform" />
                    </button>

                    {/* Bottom Video Info Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-stone-300 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
                      <span className="font-semibold text-white truncate max-w-[70%]">
                        Live Demonstration: {featuredProduct?.name || "Luxury Chafing Dish"}
                      </span>
                      <span className="font-mono text-amber-400 font-bold shrink-0">Click to Watch</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Player Bottom Status Bar */}
              <div className="p-4 bg-stone-950 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-stone-300 font-medium">Verified Showroom Demonstration • Ebute-Ero Market</span>
                </div>

                <div className="flex items-center gap-2">
                  {isPlaying && !isYouTube && (
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-colors cursor-pointer"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  )}
                  <span className="text-stone-500 font-mono text-[11px]">1080p Ultra-HD</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Featured Chafing Dish & Talking Points (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* CEO Talking Points Box */}
            <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 sm:p-7 backdrop-blur-md shadow-xl relative">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-mono font-bold tracking-wider text-amber-400 uppercase">
                  KEY HIGHLIGHTS IN THIS VIDEO
                </h3>
              </div>

              <p className="text-sm text-stone-300 mb-5 leading-relaxed">
                {config.description}
              </p>

              <div className="space-y-3">
                {config.talkingPoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-3 text-xs sm:text-sm text-stone-200">
                    <div className="p-1 rounded-full bg-amber-500/20 text-amber-400 shrink-0 mt-0.5 border border-amber-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="leading-snug">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Product Spotlight Card */}
            {featuredProduct && (
              <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950/40 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-yellow-400 text-stone-950 font-mono text-[10px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider shadow">
                  FEATURED IN VIDEO
                </div>

                <div className="flex items-center gap-4 sm:gap-5 mb-5">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-stone-800 border border-stone-700 overflow-hidden shrink-0 shadow-md">
                    <SafeImage
                      src={getProductImageUrl(featuredProduct.image)}
                      alt={featuredProduct.name}
                      className="w-full h-full object-cover"
                      containerClassName="w-full h-full"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider block mb-1">
                      {featuredProduct.category}
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-white truncate mb-1.5">
                      {featuredProduct.name}
                    </h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl sm:text-2xl font-mono font-black text-amber-400">
                        ₦{Number(featuredProduct.discountPrice || featuredProduct.price || 0).toLocaleString()}
                      </span>
                      {featuredProduct.discountPrice && (
                        <span className="text-xs font-mono text-stone-400 line-through">
                          ₦{Number(featuredProduct.price).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => onAddToCart(featuredProduct, 1)}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Order Now</span>
                  </button>

                  <a
                    href={`https://wa.me/2348083832047?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp CEO</span>
                  </a>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
