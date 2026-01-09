import { useMemo, useState, type WheelEvent } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import OptimizedImage from "./OptimizedImage";

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const SCALE_STEP = 0.2;
const DEFAULT_SCALE = 1.2;

export default function ZoomableImage({
  src,
  alt,
  className = "",
  sizes = "100vw",
  priority = false,
}: ZoomableImageProps) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(DEFAULT_SCALE);

  const { webpSrc, pngSrc } = useMemo(() => {
    const cleanSrc = src.startsWith("/") ? src.slice(1) : src;
    const basePath = import.meta.env.BASE_URL.endsWith("/")
      ? import.meta.env.BASE_URL
      : `${import.meta.env.BASE_URL}/`;
    const fullSrc = `${basePath}${cleanSrc}`;

    return {
      webpSrc: `${fullSrc}.webp`,
      pngSrc: `${fullSrc}.png`,
    };
  }, [src]);

  const clampScale = (value: number) =>
    Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setScale(DEFAULT_SCALE);
      return;
    }
    setScale(DEFAULT_SCALE);
  };

  const handleZoomIn = () => {
    setScale((prev) => clampScale(prev + SCALE_STEP));
  };

  const handleZoomOut = () => {
    setScale((prev) => clampScale(prev - SCALE_STEP));
  };

  const handleReset = () => {
    setScale(DEFAULT_SCALE);
  };


  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const delta = event.deltaY < 0 ? SCALE_STEP : -SCALE_STEP;
    setScale((prev) => clampScale(prev + delta));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={alt}
        >
          <OptimizedImage
            src={src}
            alt={alt}
            className={cn(
              "w-full rounded-lg border border-border transition-transform duration-200 group-hover:scale-[1.01] cursor-zoom-in",
              className
            )}
            sizes={sizes}
            priority={priority}
          />
        </button>
      </DialogTrigger>

      <DialogContent className="flex h-[85vh] w-full max-w-[min(1100px,95vw)] flex-col gap-4 p-4 sm:p-6">
        <DialogTitle className="sr-only">{alt}</DialogTitle>

        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            onClick={handleZoomOut}
            disabled={scale <= MIN_SCALE}
            aria-label="Zoom out"
            title="Zoom out"
          >
            <Minus className="size-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            onClick={handleZoomIn}
            disabled={scale >= MAX_SCALE}
            aria-label="Zoom in"
            title="Zoom in"
          >
            <Plus className="size-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            onClick={handleReset}
            disabled={scale === DEFAULT_SCALE}
            aria-label="Reset zoom"
            title="Reset zoom"
            className="mr-8"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
          </Button>
        </div>

        <div
          className="flex-1 overflow-auto rounded-lg border border-border bg-muted/30"
          onWheel={handleWheel}
        >
          <div className="flex min-h-full min-w-full items-center justify-center p-4">
            <picture>
              <source srcSet={webpSrc} type="image/webp" sizes={sizes} />
              <img
                src={pngSrc}
                alt={alt}
                className="h-auto max-w-none select-none"
                style={{ width: `${scale * 100}%` }}
                loading={priority ? "eager" : "lazy"}
                decoding="async"
              />
            </picture>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
