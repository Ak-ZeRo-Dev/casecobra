import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  className?: string;
  children: Readonly<React.ReactNode>;
};

const MaxWidthWrapper = ({ className, children }: Props) => {
  return (
    <div
      className={cn(
        "h-full w-full max-w-screen-xl px-2.5 md:px-20 mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
