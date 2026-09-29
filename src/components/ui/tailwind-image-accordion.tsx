"use client";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  url: string;
  title: string;
  description: string;
  tags?: string[];
  category?: string;
  color?: string;
  link?: string;
}

const defaultItems: AccordionItem[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
    title: "Adrian Paul",
    description: "COO & Co-Founder",
    tags: ["Floral", "Highlands", "Wildflowers", "Colorful", "Resilience"],
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop",
    title: "Flualy Cual",
    description: "Founder & CEO",
    tags: ["Twilight", "Peaks", "Silhouette", "Evening Sky", "Peaceful"],
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop",
    title: "Naymur Rahman",
    description: "CTO & Co-Founder",
    tags: ["Rocky", "Ridges", "Contrast", "Adventure", "Clouds"],
  },
];

export interface TailwindImageAccordionProps {
  items?: AccordionItem[];
  className?: string;
}

export function TailwindImageAccordion({
  items = defaultItems,
  className,
}: TailwindImageAccordionProps) {
  return (
    <>
      <div
        className={cn(
          "group flex max-md:flex-col justify-center gap-2 w-[80%] mx-auto mb-10 mt-3",
          className
        )}
      >
        {items.map((item) => {
          const isDataUrl = item?.url?.startsWith("data:");
          return (
            <article
              key={item?.id ?? item?.url ?? item?.title}
              className="group/article relative w-full rounded-xl overflow-hidden md:not-[&:hover]:group-hover:w-[20%] md:[&:not(:focus-within):not(:hover)]:group-focus-within:w-[20%] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.15)] before:absolute before:inset-x-0 before:bottom-0 before:h-1/3 before:bg-linear-to-t before:from-black/70 before:to-transparent before:transition-opacity md:before:opacity-0 md:hover:before:opacity-100 focus-within:before:opacity-100 after:opacity-0 md:not-[&:hover]:group-hover:after:opacity-100 md:[&:not(:focus-within):not(:hover)]:group-focus-within:after:opacity-100 after:absolute after:inset-0 after:bg-white/30 after:backdrop-blur-sm after:rounded-lg after:transition-all focus-within:ring-3 focus-within:ring-indigo-300"
            >
              <a
                className="absolute inset-0 text-white z-10 p-3 flex flex-col justify-end"
                href={item?.link || "#"}
              >
                <h1 className="text-xl font-medium md:whitespace-nowrap md:truncate md:opacity-0 group-hover/article:opacity-100 group-focus-within/article:opacity-100 md:translate-y-2 group-hover/article:translate-y-0 group-focus-within/article:translate-y-0 transition duration-200 ease-[cubic-bezier(.5,.85,.25,1.8)] group-hover/article:delay-300 group-focus-within/article:delay-300">
                  {item?.title}
                </h1>
                <span className="text-3xl font-medium md:whitespace-nowrap md:truncate md:opacity-0 group-hover/article:opacity-100 group-focus-within/article:opacity-100 md:translate-y-2 group-hover/article:translate-y-0 group-focus-within/article:translate-y-0 transition duration-200 ease-[cubic-bezier(.5,.85,.25,1.8)] group-hover/article:delay-500 group-focus-within/article:delay-500">
                  {item?.description}
                </span>
              </a>
              <Image
                className="object-cover h-72 md:h-[420px] w-full"
                src={item?.url}
                width={960}
                height={480}
                alt={item?.title || "Image"}
                unoptimized={isDataUrl}
              />
            </article>
          );
        })}
      </div>
    </>
  );
}

export default TailwindImageAccordion;
