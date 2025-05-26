"use client";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  className,
  fallbackSrc = "/images/noImage.png",
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      className={cn("object-cover", className)}
      src={imgSrc}
      alt={alt}
      fill
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}
