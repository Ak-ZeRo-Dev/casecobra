import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

import phone_dark_edges from "../../public/phone-template-dark-edges.png";
import phone_white_edges from "../../public/phone-template-white-edges.png";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  imgSrc: string;
  dark?: boolean;
}

const Phone = ({ imgSrc, dark = false, className, ...props }: Props) => {
  return (
    <div
      className={cn(
        "relative pointer-events-none z-50 overflow-hidden",
        className
      )}
      {...props}
    >
      <Image
        src={dark ? phone_dark_edges : phone_white_edges}
        alt="phone"
        className="pointer-events-none z-50 select-none"
      />
      <div className="absolute -z-10 inset-0">
        <Image
          src={imgSrc}
          alt="overlaying phone image"
          width={500}
          height={500}
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default Phone;