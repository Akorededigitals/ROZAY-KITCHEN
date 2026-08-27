import { useState, useEffect, useMemo, useRef } from "react";
import { 
  Play, Pause, Volume2, VolumeX, Sparkles, Award, 
  ShoppingBag, MessageCircle, CheckCircle2, 
  Video, Maximize2, RefreshCw
} from "lucide-react";
import { CeoVideoConfig, Product } from "../types";
import { getDbCeoVideo, getProductImageUrl, subscribeDbCeoVideo } from "../lib/supabase";
import { DEFAULT_CEO_VIDEO_CONFIG } from "../data";
import { createWhatsAppUrl, getSiteUrl } from "../lib/whatsapp";
import SafeImage from "./SafeImage";

export interface CeoVideoShowcaseProps {
  products: Product[];
  /** Optional override for the video URL (if provided, takes precedence or falls back to Supabase) */
  videoUrl?: string;
  /** Optional override for poster image */
  posterUrl?: string;
  /** Optional title override */
  title?: string;
  /** Optional subtitle override */
  subtitle?: string;
  /** Optional full configuration override */
  configOverride?: Partial<CeoVideoConfig>;
  onAddToCart: (product: Product, quantity?: number) => void;
  onInstantBuy?: (product: Product) => void;
  onOpenProductDetail?: (product: Product) => void;
}

type VideoSourceType = "youtube" | "vimeo" | "googledrive" | "loom" | "direct_video" | "image_poster" | "embed";

interface ResolvedVideoSource {
  type: VideoSourceType;
  rawUrl: string;
  embedUrl: string;
  isDirectVideo: boolean;
  isIframe: boolean;
}

/**
 * Dynamically resolves any arbitrary video URL (YouTube, Vimeo, Google Drive, Loom,
 * Supabase Storage direct uploads, MP4/WebM/MOV files, or image assets) without hardcoded IDs.
 */
function resolveVideoSource(rawUrl: string, autoPlay: boolean = true): ResolvedVideoSource {
  if (!rawUrl || !rawUrl.trim()) {
    return {
      type: "image_poster",
      rawUrl: "",
      embedUrl: "",
      isDirectVideo: false,
      isIframe: false
    };
  }

  const clean = rawUrl.trim();
  const lower = clean.toLowerCase();

  // 1. Check for Direct Video Files (Supabase Storage, MP4, WebM, MOV, OGG, M4V, Base64/Blob, Cloudinary, S3)
  const isVideoExtension = /\.(mp4|webm|mov|ogg|m4v|mkv|ogv|avi|3gp|quicktime)(\?.*)?$/i.test(clean);
  const isStorageVideoPath = (lower.includes("supabase.co/storage") || lower.includes("firebasestorage") || lower.includes("cloudinary")) && !(/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(clean.split("?")[0]));
  const isDataOrBlobVideo = lower.startsWith("data:video/") || lower.startsWith("blob:");

  if (isVideoExtension || isStorageVideoPath || isDataOrBlobVideo || lower.includes("ceo-video")) {
    return {
      type: "direct_video",
      rawUrl: clean,
      embedUrl: clean,
      isDirectVideo: true,
      isIframe: false
    };
  }

  // 2. YouTube URLs (Standard watch, Shortened youtu.be, Shorts, Embeds, Live)
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) {
    let videoId = "";

    // YouTube Shorts: /shorts/{id}
    if (lower.includes("/shorts/")) {
      const parts = clean.split(/\/shorts\//i)[1];
      videoId = parts?.split("?")[0]?.split("&")[0] || "";
    }
    // YouTube Watch: ?v={id}
    else if (lower.includes("watch")) {
      const match = clean.match(/[?&]v=([^&#]+)/);
      videoId = match ? match[1] : "";
    }
    // YouTube Shortened: youtu.be/{id}
    else if (lower.includes("youtu.be/")) {
      const parts = clean.split(/youtu\.be\//i)[1];
      videoId = parts?.split("?")[0]?.split("&")[0] || "";
    }
    // YouTube Live: /live/{id}
    else if (lower.includes("/live/")) {
      const parts = clean.split(/\/live\//i)[1];
      videoId = parts?.split("?")[0]?.split("&")[0] || "";
    }
    // Already an Embed URL: /embed/{id}
    else if (lower.includes("/embed/")) {
      const parts = clean.split(/\/embed\//i)[1];
      videoId = parts?.split("?")[0]?.split("&")[0] || "";
    }

    if (videoId) {
      const autoPlayParam = autoPlay ? "1" : "0";
      const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoPlayParam}&rel=0&modestbranding=1&enablejsapi=1&playsinline=1`;
      return {
        type: "youtube",
        rawUrl: clean,
        embedUrl,
        isDirectVideo: false,
        isIframe: true
      };
    }
  }

  // 3. Vimeo URLs: vimeo.com/{id} or player.vimeo.com/video/{id}
  if (lower.includes("vimeo.com")) {
    let vimeoId = "";
    if (lower.includes("player.vimeo.com/video/")) {
      const parts = clean.split(/video\//i)[1];
      vimeoId = parts?.split("?")[0]?.split("&")[0] || "";
    } else {
      const parts = clean.split(/vimeo\.com\//i)[1];
      vimeoId = parts?.split("?")[0]?.split("&")[0] || "";
    }

    if (vimeoId) {
      const autoPlayParam = autoPlay ? "1" : "0";
      const embedUrl = `https://player.vimeo.com/video/${vimeoId}?autoplay=${autoPlayParam}&badge=0&autopause=0`;
      return {
        type: "vimeo",
        rawUrl: clean,
        embedUrl,
        isDirectVideo: false,
        isIframe: true
      };
    }
  }

  // 4. Google Drive Video Files: drive.google.com/file/d/{id} or drive.google.com/open?id={id}
  if (lower.includes("drive.google.com")) {
    let fileId = "";
    if (lower.includes("/file/d/")) {
      const parts = clean.split(/\/file\/d\//i)[1];
      fileId = parts?.split("/")[0]?.split("?")[0] || "";
    } else if (lower.includes("id=")) {
      const match = clean.match(/[?&]id=([^&#]+)/);
      fileId = match ? match[1] : "";
    }

    if (fileId) {
      return {
        type: "googledrive",
        rawUrl: clean,
        embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        isDirectVideo: false,
        isIframe: true
      };
    }
  }

  // 5. Loom Screen Recordings: loom.com/share/{id}
  if (lower.includes("loom.com")) {
    if (lower.includes("/share/")) {
      const loomId = clean.split(/\/share\//i)[1]?.split("?")[0] || "";
      if (loomId) {
        return {
          type: "loom",
          rawUrl: clean,
          embedUrl: `https://www.loom.com/embed/${loomId}?autoplay=${autoPlay ? "1" : "0"}`,
          isDirectVideo: false,
          isIframe: true
        };
      }
    }
  }

  // 6. Image URL (Hero poster fallback)
  const isImageExtension = /\.(jpg|jpeg|png|webp|gif|svg|avif)(\?.*)?$/i.test(clean);
  if (isImageExtension) {
    return {
      type: "image_poster",
      rawUrl: clean,
      embedUrl: clean,
      isDirectVideo: false,
      isIframe: false
    };
  }

  // 7. Generic HTTPS Video / Embed fallback
  return {
    type: "direct_video",
    rawUrl: clean,
    embedUrl: clean,
    isDirectVideo: true,
    isIframe: false
  };
}

export default function CeoVideoShowcase({
  products,
  videoUrl: propVideoUrl,
  posterUrl: propPosterUrl,
  title: propTitle,
  subtitle: propSubtitle,
  configOverride,
  onAddToCart,
  onInstantBuy,
  onOpenProductDetail
}: CeoVideoShowcaseProps) {
  const [dbConfig, setDbConfig] = useState<CeoVideoConfig>(DEFAULT_CEO_VIDEO_CONFIG);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 1. Fetch live dynamic configuration from Supabase and subscribe to real-time changes
  useEffect(() => {
    let isMounted = true;

    async function loadConfig() {
      try {
        const data = await getDbCeoVideo();
        if (data && isMounted) {
          setDbConfig(data);
        }
      } catch (err) {
        console.warn("Notice: could not load dynamic CEO video config from Supabase", err);
      }
    }

    loadConfig();

    // Supabase Real-Time database listener
    const unsubscribeRealtime = subscribeDbCeoVideo((updatedConfig) => {
      if (isMounted && updatedConfig) {
        setDbConfig(updatedConfig);
        setIsPlaying(false);
        setVideoError(false);
      }
    });

    // Window event listener for immediate admin saves
    const handleVideoUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CeoVideoConfig>;
      if (customEvent.detail && isMounted) {
        setDbConfig(customEvent.detail);
        setIsPlaying(false);
        setVideoError(false);
      } else {
        loadConfig();
      }
    };

    // Tab storage event listener
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "rozay_ceo_video" && e.newValue && isMounted) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed) {
            setDbConfig(parsed);
            setIsPlaying(false);
            setVideoError(false);
          }
        } catch (err) {}
      }
    };

    const handleFocus = () => {
      loadConfig();
    };

    window.addEventListener("rozay_ceo_video_updated", handleVideoUpdate);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);

    return () => {
      isMounted = false;
      unsubscribeRealtime();
      window.removeEventListener("rozay_ceo_video_updated", handleVideoUpdate);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // 2. Merge dynamic Supabase config with any explicitly passed props
  const effectiveConfig: CeoVideoConfig = useMemo(() => {
    return {
      ...dbConfig,
      ...configOverride,
      title: propTitle || configOverride?.title || dbConfig.title || DEFAULT_CEO_VIDEO_CONFIG.title,
      subtitle: propSubtitle || configOverride?.subtitle || dbConfig.subtitle || DEFAULT_CEO_VIDEO_CONFIG.subtitle,
      posterUrl: propPosterUrl || configOverride?.posterUrl || dbConfig.posterUrl || DEFAULT_CEO_VIDEO_CONFIG.posterUrl,
      videoUrl: propVideoUrl || configOverride?.videoUrl || dbConfig.videoUrl || DEFAULT_CEO_VIDEO_CONFIG.videoUrl,
      isActive: configOverride?.isActive !== undefined ? configOverride.isActive : dbConfig.isActive
    };
  }, [dbConfig, configOverride, propTitle, propSubtitle, propPosterUrl, propVideoUrl]);

  // 3. Dynamically resolve video source without hardcoding
  const resolvedSource = useMemo(() => {
    return resolveVideoSource(effectiveConfig.videoUrl, true);
  }, [effectiveConfig.videoUrl]);

  // If section is deactivated by admin, do not render
  if (!effectiveConfig.isActive) {
    return null;
  }

  // Find the featured product from catalog (or fallback to signature chafing dish)
  const featuredProduct = 
    products.find((p) => p.id === effectiveConfig.featuredProductId) ||
    products.find((p) => p.category.toLowerCase().includes("chafing")) ||
    products[0];

  const siteUrl = getSiteUrl();
  const productPriceFormatted = Number(featuredProduct?.discountPrice || featuredProduct?.price || 140000).toLocaleString();
  const rawWhatsappMessage = `Hello Rozay Kitchen! 👋\n\nI watched CEO Alaekwe Onyebuchi's executive showcase of the *${featuredProduct?.name || "Signature Chafing Dish"}* (₦${productPriceFormatted}) on your website (${siteUrl}).\n\nI would like to place an order or make a wholesale/delivery inquiry. Please assist me!`;
  const whatsappUrl = createWhatsAppUrl(rawWhatsappMessage);

  const handleToggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen?.();
      }
    }
  };

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
            {effectiveConfig.title}
          </h2>

          <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {effectiveConfig.subtitle}
          </p>
        </div>

        {/* Video & Featured Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Dynamic Video Player (7 Columns) */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl overflow-hidden bg-stone-900 border-2 border-amber-500/30 shadow-2xl shadow-black/80 group">
              
              {/* Aspect Ratio Container (16:9) */}
              <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
                {resolvedSource.isIframe ? (
                  isPlaying ? (
                    <iframe
                      src={resolvedSource.embedUrl}
                      title={effectiveConfig.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full border-0 absolute inset-0"
                    />
                  ) : (
                    /* Video Poster with Play Button for Iframe embeds */
                    <div className="relative w-full h-full group/poster">
                      <img
                        src={effectiveConfig.posterUrl || "https://i.ibb.co/gbjcKSgb/Whats-App-Image-2026-08-13-at-17-09-03.jpg"}
                        alt="CEO Product Walkthrough Poster"
                        className="w-full h-full object-cover opacity-85 group-hover/poster:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                      
                      <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/80 backdrop-blur-md border border-amber-500/40 text-amber-300 px-3 py-1.5 rounded-full text-xs font-mono font-bold">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>{effectiveConfig.ceoName || "Alaekwe Onyebuchi"} • {effectiveConfig.ceoTitle || "CEO"}</span>
                      </div>

                      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md border border-white/10 text-stone-300 px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider">
                        {resolvedSource.type.toUpperCase()}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setVideoError(false);
                          setIsPlaying(true);
                        }}
                        className="absolute inset-0 m-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 text-stone-950 flex items-center justify-center shadow-2xl shadow-amber-500/50 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer group/btn"
                        aria-label="Play CEO Video Showcase"
                      >
                        <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1 group-hover/btn:scale-110 transition-transform" />
                      </button>

                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-stone-300 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
                        <span className="font-semibold text-white truncate max-w-[70%]">
                          Live Demonstration: {featuredProduct?.name || "Luxury Chafing Dish"}
                        </span>
                        <span className="font-mono text-amber-400 font-bold shrink-0">Click to Play</span>
                      </div>
                    </div>
                  )
                ) : resolvedSource.isDirectVideo ? (
                  /* Direct HTML5 Video Player (MP4, WebM, Supabase Storage, Blob) */
                  <div className="relative w-full h-full bg-black flex items-center justify-center group/direct">
                    <video
                      ref={videoRef}
                      src={resolvedSource.rawUrl}
                      poster={effectiveConfig.posterUrl}
                      controls
                      playsInline
                      preload="auto"
                      muted={isMuted}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onError={() => {
                        console.warn("Direct video playback encountered error");
                        setVideoError(true);
                      }}
                      className="w-full h-full object-cover"
                    />

                    {/* Prominent Center Play Button Overlay when video is paused */}
                    {!isPlaying && !videoError && (
                      <div 
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.play().catch(() => {});
                          }
                          setIsPlaying(true);
                        }}
                        className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center cursor-pointer transition-opacity"
                      >
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 text-stone-950 flex items-center justify-center shadow-2xl shadow-amber-500/50 hover:scale-110 active:scale-95 transition-all duration-300">
                          <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
                        </div>
                        
                        <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/80 backdrop-blur-md border border-amber-500/40 text-amber-300 px-3 py-1.5 rounded-full text-xs font-mono font-bold">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>{effectiveConfig.ceoName || "Alaekwe Onyebuchi"} • {effectiveConfig.ceoTitle || "CEO"}</span>
                        </div>

                        <div className="absolute top-4 right-4 bg-emerald-600/90 text-white border border-emerald-400/40 px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold">
                          Live Video File
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-stone-300 bg-black/70 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
                          <span className="font-semibold text-white truncate max-w-[70%]">
                            CEO Demonstration: {featuredProduct?.name || "Luxury Chafing Dish"}
                          </span>
                          <span className="font-mono text-amber-400 font-bold shrink-0">Click to Play</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Fallback for Image/Poster media */
                  <div className="relative w-full h-full">
                    <img
                      src={resolvedSource.rawUrl || effectiveConfig.posterUrl || "https://i.ibb.co/gbjcKSgb/Whats-App-Image-2026-08-13-at-17-09-03.jpg"}
                      alt={effectiveConfig.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-6 text-center">
                      <Sparkles className="w-10 h-10 text-amber-400 mb-2" />
                      <h4 className="text-lg font-bold text-white mb-1">{effectiveConfig.title}</h4>
                      <p className="text-xs text-stone-300 max-w-md">{effectiveConfig.description}</p>
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
                  {isPlaying && resolvedSource.isDirectVideo && (
                    <>
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-colors cursor-pointer"
                        title={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                      </button>
                      <button
                        onClick={handleToggleFullscreen}
                        className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-colors cursor-pointer"
                        title="Toggle Fullscreen"
                      >
                        <Maximize2 className="w-4 h-4 text-stone-300" />
                      </button>
                    </>
                  )}
                  {isPlaying && (
                    <button
                      onClick={() => setIsPlaying(false)}
                      className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-colors cursor-pointer text-[11px] font-mono flex items-center gap-1"
                      title="Reset Player"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset</span>
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
                {effectiveConfig.description}
              </p>

              <div className="space-y-3">
                {(effectiveConfig.talkingPoints || []).map((point, index) => (
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
                  <div 
                    onClick={() => onOpenProductDetail?.(featuredProduct)}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-stone-800 border border-stone-700 overflow-hidden shrink-0 shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                  >
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
                    <h4 
                      onClick={() => onOpenProductDetail?.(featuredProduct)}
                      className="text-base sm:text-lg font-bold text-white truncate mb-1.5 hover:text-amber-400 transition-colors cursor-pointer"
                    >
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
                    onClick={() => {
                      if (onInstantBuy) {
                        onInstantBuy(featuredProduct);
                      } else {
                        onAddToCart(featuredProduct, 1);
                      }
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Order Now</span>
                  </button>

                  <a
                    href={whatsappUrl}
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
