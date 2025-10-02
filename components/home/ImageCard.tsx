import { ImageCardProps } from "@/types/types";
import React from "react";

type Props = {};

function ImageCard({ src, aspectRatio, marginTop = "" }: ImageCardProps) {
  return (
    <img
      loading="lazy"
      src={src}
      alt=""
      style={{ aspectRatio }}
      className={`object-contain w-full ${marginTop}`}
    />
  );
}

export default ImageCard;
