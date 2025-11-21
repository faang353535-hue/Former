import React, { type CSSProperties } from "react";

import { cn } from "@/lib/utils";

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "10px",
      background = "",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        style={
          {
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background,
          } as CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-black/10 px-6 py-3 text-black [background:var(--bg)] rounded-(--radius) dark:text-white dark:border-white/10",
          "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
          className,
        )}
        ref={ref}
        {...props}
      >
        {/* spark container */}
        <div
          className={cn(
            "-z-30 blur-[2px]",
            "absolute inset-0 overflow-visible @container-[size]",
          )}
        >
          {/* spark */}
          <div className="absolute inset-0 h-[100cqh] animate-shimmer-slide aspect-[1] rounded-none [mask:none]">
            {/* spark before */}
            <div className="absolute -inset-full w-auto rotate-0 animate-spin-around [translate:0_0]" />
          </div>
        </div>
        {children}

        {/* Highlight */}
        <div
          className={cn(
            "insert-0 absolute size-full",

            "rounded-lg px-4 py-1.5 text-sm font-medium dark:shadow-[inset_0_-3px_10px_#ffffff1f] shadow-[inset_0_-3px_10px_#E4E4E4] ",

            // transition
            "transform-gpu transition-all duration-300 ease-in-out",

            // on hover
            "dark:group-hover:shadow-[inset_0_-3px_10px_#ffffff3f] group-hover:shadow-[inset_0_-3px_10px_#C4C4C4] ",

            // on click
            "dark:group-active:shadow-[inset_0_-6px_10px_#ffffff3f] group-active:shadow-[inset_0_-6px_10px_#B4B4N4]",
          )}
        />

        {/* backdrop */}
        <div
          className={cn(
            "absolute -z-20 [background:var(--bg)] rounded-(--radius) inset-(--cut)",
          )}
        />
      </button>
    );
  },
);

ShimmerButton.displayName = "ShimmerButton";

export default ShimmerButton;
