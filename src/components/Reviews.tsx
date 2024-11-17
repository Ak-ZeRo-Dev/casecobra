"use client";
import { cn } from "@/lib/utils";
import { useInView } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import QuestionPeople from "../../public/what-people-are-buying.png";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Phone from "./Phone";

type ReviewColumProps = {
  reviews: string[];
  className?: string;
  reviewClassName?: (reviewIndex: number) => string;
  msPerPixel?: number;
};

interface ReviewProps extends React.HTMLAttributes<HTMLDivElement> {
  imgSrc: string;
}

const images = (num: number): string[] => {
  const result: string[] = [];
  for (let i = 1; i <= num; i++) result.push(`/testimonials/${i}.jpg`);
  return result;
};

const PHONES = images(6);

function splitArray<T>(array: Array<T>, size: number) {
  const result: Array<Array<T>> = [];

  for (let i = 0; i < array.length; i++) {
    const index = i % size;
    if (!result[index]) {
      result[index] = [];
    }
    result[index].push(array[i]);
  }

  return result;
}

const ReviewColum = ({
  reviews,
  className,
  reviewClassName,
  msPerPixel = 0,
}: ReviewColumProps) => {
  const columnRef = useRef<HTMLDivElement>(null);
  const [columnHight, setColumnHight] = useState<number>(0);
  const duration = `${columnHight * msPerPixel}ms`;

  useEffect(() => {
    if (!columnRef.current) return;
    const resizeObserver = new ResizeObserver(() =>
      setColumnHight(columnRef.current?.offsetHeight ?? 0)
    );

    resizeObserver.observe(columnRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      ref={columnRef}
      className={cn("animate-marquee space-y-8 py-4", className)}
      style={{ "--marquee-duration": duration } as React.CSSProperties}
    >
      {reviews.concat(reviews).map((imgSrc, index) => (
        <Review
          imgSrc={imgSrc}
          key={index}
          className={reviewClassName?.(index % reviews.length)}
        />
      ))}
    </div>
  );
};
const Review = ({ imgSrc, className, ...props }: ReviewProps) => {
  const POSSIBLE_aNIMATION_DELAYS = [
    "0s",
    "0.1s",
    "0.2s",
    "0.3s",
    "0.4s",
    "0.5s",
  ];

  const animationDelay =
    POSSIBLE_aNIMATION_DELAYS[
      Math.floor(Math.random() * POSSIBLE_aNIMATION_DELAYS.length)
    ];

  return (
    <div
      className={cn(
        "animate-fade-in rounded-[2.25rem] bg-white p-6 opacity-0 shadow-xl shadow-slate-900/5",
        className
      )}
      style={{ animationDelay }}
      {...props}
    >
      <Phone imgSrc={imgSrc} />
    </div>
  );
};
const ReviewGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.4 });

  const columns = splitArray(PHONES, 3);
  const [column1, column2] = columns;
  const column3 = splitArray(PHONES, 2);

  return (
    <div
      ref={containerRef}
      className="relative -mx-4 mt-16 grid h-[49rem] max-h-[150vh] grid-cols-1 ite gap-8 overflow-hidden px-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3"
    >
      {isInView && (
        <>
          <ReviewColum
            reviews={[...column1, ...column2, ...column3.flat()]}
            reviewClassName={(index: number) =>
              cn({
                "md:hidden": index >= column1.length + column3.length,
                "lg:hidden": index >= column1.length,
              })
            }
            msPerPixel={10}
          />
          <ReviewColum
            reviews={[...column2, ...column3[1]]}
            className="hidden md:block"
            reviewClassName={(index: number) =>
              index >= column2.length ? "lg:hidden" : ""
            }
            msPerPixel={15}
          />
          <ReviewColum
            reviews={column3.flat()}
            className="hidden md:block"
            msPerPixel={10}
          />
        </>
      )}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-100"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-100"></div>
    </div>
  );
};

const Reviews = () => {
  return (
    <MaxWidthWrapper className="relative max-w-5xl">
      <Image
        aria-hidden
        src={QuestionPeople}
        alt=""
        className="absolute top-1/3 -left-32 select-none hidden xl:block"
      />
      <ReviewGrid />
    </MaxWidthWrapper>
  );
};

export default Reviews;
