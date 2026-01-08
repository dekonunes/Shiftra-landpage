interface OptimizedImageProps {
  src: string; // Path to PNG image (without extension)
  alt: string;
  className?: string;
  sizes?: string; // Responsive sizes attribute
  priority?: boolean; // Skip lazy loading for above-fold images
}

/**
 * OptimizedImage - Responsive image component with WebP fallback
 *
 * Features:
 * - WebP format with PNG fallback for better performance
 * - Lazy loading by default (disable with priority prop)
 * - Responsive srcset for different screen sizes
 * - Semantic HTML with picture element
 *
 * @example
 * <OptimizedImage
 *   src="/assets/landing/agenda"
 *   alt="Agenda showing upcoming shifts"
 *   sizes="(max-width: 768px) 100vw, 50vw"
 * />
 */
export default function OptimizedImage({
  src,
  alt,
  className = '',
  sizes = '100vw',
  priority = false,
}: OptimizedImageProps) {
  // Generate paths for WebP and PNG versions
  const webpSrc = `${src}.webp`;
  const pngSrc = `${src}.png`;

  return (
    <picture>
      {/* WebP source for modern browsers */}
      <source srcSet={webpSrc} type="image/webp" sizes={sizes} />

      {/* PNG fallback for older browsers */}
      <img
        src={pngSrc}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </picture>
  );
}
