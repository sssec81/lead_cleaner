import Image from "next/image";

type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className = "" }: BrandMarkProps) {
  return (
    <span className={`lc-brand-mark ${className}`.trim()} aria-hidden="true">
      <Image
        className="lc-brand-mark-image"
        src="/leadcleanr-mark.png"
        alt=""
        width={44}
        height={29}
        priority
      />
    </span>
  );
}

export function BrandWordmark({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className={`lc-brand-wordmark${inverse ? " lc-brand-wordmark-inverse" : ""}`}>
      <span>Lead</span>
      <span className="lc-brand-wordmark-accent">Cleanr</span>
    </span>
  );
}
