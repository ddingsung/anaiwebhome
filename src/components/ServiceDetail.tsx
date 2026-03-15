"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface ServiceDetailProps {
  id: string;
  number: string;
  title: string;
  problem: string;
  solution: string;
}

export default function ServiceDetail({
  id,
  number,
  title,
  problem,
  solution,
}: ServiceDetailProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id={id} ref={ref} className="py-16 lg:py-24">
      <div className="max-w-[1512px] mx-auto px-6 md:px-12 lg:px-[144px]">
        {/* Title */}
        <motion.h2
          className="text-[22px] md:text-[28px] lg:text-[35px] font-medium text-[#111] mb-10 lg:mb-14"
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {number}. {title}
        </motion.h2>

        {/* Question bubble */}
        <motion.div
          className="mb-5 lg:mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="inline-block ml-5">
            <div className="bubble-left bg-white border border-black rounded-[10px] px-5 py-3.5">
              <span className="text-[16px] lg:text-[20px] text-black">
                어떤 불편함을 해결하나요?
              </span>
            </div>
          </div>
        </motion.div>

        {/* Problem text */}
        <motion.p
          className="text-[16px] lg:text-[18px] leading-[1.7] text-[#111] max-w-[655px] mb-14 lg:mb-20"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          {problem}
        </motion.p>

        {/* Answer bubble */}
        <motion.div
          className="flex justify-start lg:justify-end mb-5 lg:mb-6"
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="inline-block mr-5">
            <div className="bubble-right bg-white border border-black rounded-[10px] px-5 py-3.5">
              <span className="text-[16px] lg:text-[20px] text-black">
                무엇이 바뀌나요?
              </span>
            </div>
          </div>
        </motion.div>

        {/* Solution text */}
        <motion.p
          className="text-[16px] lg:text-[18px] leading-[1.7] text-[#111] max-w-[608px] lg:text-right lg:ml-auto"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.65 }}
        >
          {solution}
        </motion.p>
      </div>
    </section>
  );
}
