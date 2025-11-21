"use client"
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import ShimmerButton from "@/components/ui/shimmer-button";
import { cn } from "@/lib/utils";
import { ChevronsRight } from "lucide-react";
import NewItemsLoading from "@/components/ui/shimmer-button";
import WordAnimator from "@/components/ui/word-animator";
import Faqs from "./FAQ/page";
import { RandomText } from "@/components/ui/RandomText";

export default function Home() {

  /*  */

  // const [localTheme, setLocalTheme] = useState<"light" | "dark">("light");

  const [blocks, setBlocks] = useState([]);

  const activeDivs = useMemo(
    () => ({
      0: new Set([4, 1]),
      2: new Set([3]),
      4: new Set([2, 5, 8]),
      5: new Set([4]),
      6: new Set([0]),
      7: new Set([1]),
      10: new Set([3]),
      12: new Set([7]),
      13: new Set([2, 4]),
      14: new Set([1, 5]),
      15: new Set([3, 6]),
    }),
    [], // No dependencies, so `activeDivs` will only be created once
  );
  useEffect(() => {
    const updateBlocks = () => {
      const { innerWidth, innerHeight } = window;
      const blockSize = innerWidth * 0.06; // Using 6vw for the block size
      const amountOfBlocks = Math.ceil(innerHeight / blockSize);

      const newBlocks = Array.from({ length: 17 }, (_, columnIndex) => (
        <div key={columnIndex} className="w-[6vw] h-full">
          {Array.from({ length: amountOfBlocks }, (_, rowIndex) => (
            <div
              key={rowIndex}
              className={`h-[6vw] w-full border dark:border-[rgba(255,255,255,0.015)] border-gray-50 ${
                // @ts-ignore
                activeDivs[columnIndex]?.has(rowIndex)
                  ? "dark:bg-[rgba(255,255,255,0.03)] bg-gray-50"
                  : ""
                }`}
              style={{ height: `${blockSize}px` }}
            ></div>
          ))}
        </div>
      ));
      // @ts-ignore
      setBlocks(newBlocks);
    };

    updateBlocks();
    window.addEventListener("resize", updateBlocks);

    return () => window.removeEventListener("resize", updateBlocks);
  }, [activeDivs]);

  const words = ["Build ", "Deploy"];

  const redirector = () => {
    window.location.href = 'http://localhost:3000/actions/Add'
  }

  return (
    <>
      <div /* className={localTheme === "dark" ? "dark" : "light"} */>
        <section className=" h-screen  overflow-hidden  relative pb-20 dark:bg-black bg-white  ">
          <div className="absolute inset-0 z-0 h-screen w-full  dark:bg-[radial-gradient(#1d1d1d_1px,transparent_1px)] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] background-size:16px_16px"></div>
          <div className="absolute inset-0 top-0 left-0  h-screen w-full items-center px-5 py-24  bg-linear-to-t dark:from-[#050505] from-white from-0% to-transparent to-60%"></div>

          <div className="pointer-events-none absolute inset-0  flex w-screen  justify-end mask-[radial-gradient(transparent_5%,white)]">
            <svg
              width="1512"
              height="1714"
              viewBox="0 0 1512 1714"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="pointer-events-none absolute left-0 top-0 h-auto w-full lg:w-1/2 "
            >
              <g clipPath="url(#clip0_143_13)">
                <g filter="url(#filter0_f_143_13)">
                  <path
                    d="M1045.18 982.551C1129.83 903.957 204.996 477.237 -235.529 294L-339.645 584.211C59.2367 752.376 960.521 1061.15 1045.18 982.551Z"
                    fill="white"
                    fillOpacity="0.15"
                  ></path>
                </g>
              </g>
              <defs>
                <filter
                  id="filter0_f_143_13"
                  x="-595.645"
                  y="38"
                  width="1902.26"
                  height="1213.13"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood
                    floodOpacity="0"
                    result="BackgroundImageFix"
                  ></feFlood>
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  ></feBlend>
                  <feGaussianBlur
                    stdDeviation="64"
                    result="effect1_foregroundBlur_143_13"
                  ></feGaussianBlur>
                </filter>
                <clipPath id="clip0_143_13">
                  <rect width="1512" height="1714" fill="white"></rect>
                </clipPath>
              </defs>
            </svg>
          </div>

          <article className="grid 2xl:pt-52 2xl:pb-24 py-60 relative text-primary-foreground z-2 sm:px-0 px-4 ">
            <h1 className="xl:text-7xl md:text-6xl sm:text-5xl text-3xl text-black opacity-90 dark:text-white text-center font-semibold  tracking-tight">
              <span className="relative translate-x-0  flex gap-2 justify-center">
                <WordAnimator
                  words={words}
                  duration={5}
                  className=" italic w-fit pr-3 dark:bg-gray-800 bg-gray-200 dark:border-neutral-800 border-neutral-200" 
                />{" "}
                Forms in Minutes
              </span>
            </h1>
            <p className="mx-auto lg:w-[700px] sm:w-[80%] text-black opacity-90 dark:text-white text-center sm:text-lg text-sm my-10">
              Design, customize, and share powerful forms that do more. <br /> Collect responses, automate workflows, and integrate with your favorite tools — all in one place.
              Save countless hours⏳, craft eye-catching forms, and grow your business with customer response

            </p>
            <div className="flex gap-2 justify-center items-center mt-10">

              <ShimmerButton
                borderRadius={"100px"}
                className={cn(
                  "flex items-center gap-2 w-fit rounded-full  text-white  border sm:px-4 px-2  py-2 ",
                )}
                onClick={redirector}
                background={"#334cec"}
              >
                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                  Start for free
                </span>
              </ShimmerButton>
              {/* <Button variant={"outline"} ></Button> */}
            </div>
          </article>

          <div className="flex h-screen overflow-hidden top-0 left-0  inset-0  z-0 absolute">
            {blocks}
          </div>
        </section>
      </div>
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_78%,rgba(253,249,246,1))] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0)_78%,rgba(6,6,6,1))]"></div>
      <div className="flex justify-evenly bg-[#fdf9f6] dark:bg-[#060606] py-10">
        <div className="flex flex-col align-middle ">
          <RandomText text="500K+" />
          Forms Created
        </div>
        <div className="flex flex-col align-middle ">
          <RandomText text="10M+" />
          Monthly Submissions
        </div>
        <div className="flex flex-col align-middle ">
          <RandomText text="99.9%" />
          Uptime
        </div>
      </div>
      <Faqs></Faqs>

    </>
  );
}
