import type { CSSProperties } from "react";
import Image from "next/image";

// Official EzyHotels.com pin mark (pin + clock + bed), cropped from the brand
// logo to a transparent PNG in /public. Intrinsic ratio 428×628.
const MARK_W = 428;
const MARK_H = 628;

/**
 * EzyHotels.com brand mark. `size` is the rendered WIDTH; height follows the
 * mark's aspect ratio. Pass `dark` on dark backgrounds to use the white-bed
 * variant (the default mark's bed/hands are dark and vanish on dark surfaces).
 */
export function EzyMark({
  size = 34,
  dark = false,
  className,
  style,
}: {
  size?: number;
  dark?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Image
      src={dark ? "/ezyhotels-mark-dark.png" : "/ezyhotels-mark.png"}
      alt="EzyHotels.com"
      width={size}
      height={Math.round((size * MARK_H) / MARK_W)}
      className={className}
      style={style}
      priority
    />
  );
}

/**
 * Full lockup: mark + "EzyHotels.com" wordmark. Used in the header.
 * Ezy = orange, Hotels = navy, .com = orange (matches the brand logo).
 */
export function EzyLogo({ markSize = 34 }: { markSize?: number }) {
  return (
    <span className="flex items-center gap-2">
      <EzyMark size={markSize} />
      <span className="text-2xl font-black tracking-tight leading-none">
        <span className="text-orange-600">Ezy</span>
        <span className="text-brand-black">Hotels</span>
        <span className="text-orange-600 text-[0.62em] align-baseline">.com</span>
      </span>
    </span>
  );
}
