"use client";
import {
  Aaccordion,
  AaccordionContent,
  AaccordionItem,
  AaccordionTrigger,
} from "@/components/ui/accordion";

import { TimelineContent } from "@/components/ui/timeline-animation";
import { Plus } from "lucide-react";
import { useRef } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

const faqData: FAQItem[] = [
  {
    question: "INDIVIDUAL CREATORS",
    answer:
      "You can easily build customized forms using our drag-and-drop builder — no coding skills required. Collect responses instantly and manage everything from one dashboard.",
  },
  {
    question: "SMALL & MEDIUM BUSINESSES",
    answer:
      "Our platform lets you create forms for lead generation, customer feedback, order collection, or surveys. You can embed them on your website or share via a direct link.",
  },
  {
    question: "ENTERPRISE TEAMS",
    answer:
      "We offer advanced features like workflow automation, conditional logic, data analytics, and team collaboration tools for large-scale form management.",
  },
  {
    question: "DEVELOPERS",
    answer:
      "Integrate your forms with APIs, CRMs, or other tools seamlessly. Use webhooks and custom scripts for extended functionality and real-time data handling.",
  },
  {
    question: "EDUCATIONAL INSTITUTIONS",
    answer:
      "Create admission, feedback, and assessment forms in minutes. Manage responses securely and analyze trends with built-in reporting tools.",
  },
  {
    question: "SECURITY & DATA PRIVACY",
    answer:
      "All data is encrypted and stored securely. We comply with major privacy standards and offer role-based access control to protect sensitive information.",
  },
  {
    question: "CUSTOMIZATION OPTIONS",
    answer:
      "You can fully customize form design — colors, fonts, layouts, and themes — to match your brand’s identity. Support for dark and light modes is included.",
  },
  {
    question: "PRICING & PLANS",
    answer:
      "We offer flexible pricing — from free plans for individuals to premium features for businesses and enterprises. You pay only for what you use.",
  },
];


export default function Faqs() {
  const faqsRef = useRef<HTMLDivElement>(null);
  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  return (
    <div
      className="p-10 mx-auto bg-[#fdf9f6] dark:bg-[#060606] dark:text-[#fdf9f6] min-h-screen w-full shadow-sm grid md:grid-cols-12 gap-5"
      ref={faqsRef}
    >
      <div className="md:col-span-8 md:pr-16">
        <TimelineContent
          as="span"
          animationNum={0}
          timelineRef={faqsRef}
          customVariants={revealVariants}
          className="text-sm font-semibold text-black/60 dark:text-neutral-300 "
        >
          WHO WE SERVE
        </TimelineContent>

        <div className="mt-3 ">
          <Aaccordion type="single" collapsible className="w-full">
            {faqData.map((item, index) => (
              <AaccordionItem
                key={index}
                value={`item-${index}`}
                className="mb-0 rounded-none bg-transparent w-full"
              >
                <TimelineContent
                  as="div"
                  animationNum={1 + index}
                  timelineRef={faqsRef}
                  customVariants={revealVariants}
                >
                  <AaccordionTrigger
                    hideIcon
                    className="group hover:no-underline p-0 border-t border-neutral-300 dark py-2 relative text-neutral-600 sm:text-base text-sm"
                  >
                    <span className="font-medium lg:text-3xl md:text-2xl sm:text-lg dark:opacity-70">
                      {item.question}
                    </span>
                    <span className="relative border border-neutral-500 text-neutral-600 sm:p-2 p-1.5 -translate-x-1 rounded-xl transition-transform duration-300 group-data-[state=open]:rotate-45">
                      <Plus className="transition-all duration-300" />
                    </span>
                  </AaccordionTrigger>
                </TimelineContent>
                <TimelineContent
                  as="div"
                  animationNum={1 + index}
                  timelineRef={faqsRef}
                  customVariants={revealVariants}
                >
                  <AaccordionContent>
                    <p className="text-sm sm:text-base ">{item.answer}</p>
                  </AaccordionContent>
                </TimelineContent>
              </AaccordionItem>
            ))}
          </Aaccordion>
        </div>
      </div>

      <div className="md:col-span-4 w-full">
        <div className="flex flex-col space-y-4 md:w-80 ml-auto">
          <TimelineContent
            as="div"
            animationNum={6}
            timelineRef={faqsRef}
            customVariants={revealVariants}
            className="space-y-2"
          >
            <span className="text-sm font-semibold text-black/60 dark:text-[#fdf9f6]">
              OUR PURPOSE
            </span>
            <p className="text-sm sm:text-base text-black/90 dark:text-[#fdf9f6] dark:opacity-80">
              Our purpose is to make AI accessible and affordable for everyone,
              empowering businesses of all sizes to leverage the power of AI to
              drive innovation, automate processes, and unlock new
              opportunities.
            </p>
          </TimelineContent>

          <TimelineContent
            as="div"
            animationNum={7}
            timelineRef={faqsRef}
            customVariants={revealVariants}
            className="space-y-2 pt-10"
          >
            <span className="text-sm font-semibold text-black/60 dark:text-[#fdf9f6] dark:opacity-80">
              OUR MISSION
            </span>
            <p className="text-sm sm:text-base text-black/90 dark:text-[#fdf9f6] dark:opacity-80">
              Our mission is to make AI accessible and affordable for everyone,
              empowering businesses of all sizes to leverage the power of AI to
              drive innovation, automate processes, and unlock new
              opportunities.
            </p>
          </TimelineContent>
        </div>
      </div>
    </div>
  );
}
