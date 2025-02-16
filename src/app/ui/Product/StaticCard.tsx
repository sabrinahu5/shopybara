import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { DirectionAwareHover } from "../Home/DirectionAwareHover";

interface StaticCardProps {
  title: string;
  price: string;
  description: string;
  imageUrl: string;
  href?: string;
  className?: string;
  containerClassName?: string;
  openInNewTab?: boolean;
}

export const StaticCard = ({
  title,
  price,
  description,
  imageUrl,
  href,
  className,
  containerClassName,
  openInNewTab = false,
}: StaticCardProps) => {
  const LinkWrapper = openInNewTab ? 'a' : Link;
  const linkProps = openInNewTab ? {
    href: href || "/",
    target: "_blank",
    rel: "noopener noreferrer"
  } : {
    href: href || "/"
  };

  return (
    <LinkWrapper
      className={cn("relative z-50 block w-full max-w-sm", containerClassName)}
      {...linkProps}
    >
      <DirectionAwareHover imageUrl={imageUrl}>
        <div className="p-4 space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="text-white font-semibold text-lg line-clamp-2">
              {title}
            </h3>
            <span className="text-emerald-400 font-bold">
              {price}
            </span>
          </div>
          
          <p className="text-gray-400 text-sm line-clamp-2">
            {description}
          </p>
        </div>
      </DirectionAwareHover>
    </LinkWrapper>
  );
};