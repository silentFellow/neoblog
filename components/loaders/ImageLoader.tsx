"use client";

import { Skeleton } from "@/components/ui/skeleton";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

const ImageLoader = ({ ...imageProps }: ImageProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <>
      {isLoading && <Skeleton className="full" />}
      <Image
        {...imageProps}
        alt={imageProps.alt}
        onLoad={() => setIsLoading(false)}
      />
    </>
  );
};

export default ImageLoader;
