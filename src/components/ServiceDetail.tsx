"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

interface ServiceDetailProps {
  id: string;
  number: string;
  tag: string;
  title: string;
  problem: string;
  solution: string;
  demoHref?: string;
  demoExternal?: boolean;
  videoSrc?: string;
  align: "left" | "right";
}

export default function ServiceDetail({
  id,
  number,
  tag,
  title,
  problem,
  solution,
  demoHref,
  demoExternal,
  videoSrc,
  align,
}: ServiceDetailProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id={id} ref={ref} className="py-16 lg:py-24">
      <div className="max-w-[1512px] mx-auto px-6 md:px-12 lg:px-[144px]">
        {/* Title */}
        <motion.h2
          className={`text-[22px] md:text-[28px] lg:text-[35px] font-medium text-[#111] mb-10 lg:mb-14 ${
            align === "right" ? "text-right" : "text-left"
          }`}
          initial={{ opacity: 0, x: align === "left" ? -30 : 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {number}. [{tag}] {title}
        </motion.h2>

        {/* Overlapping cards container */}
        <motion.div
          className="relative flex flex-col"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Problem Card — left aligned, z-20 (top layer) */}
          <div
            className="relative z-20 w-full lg:w-[80%] rounded-[20px] p-8 lg:p-10 lg:pb-24 lg:pr-24"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              border: "0.5px solid rgba(0,0,0,0.06)",
              boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.08)",
            }}
          >
            {/* Emoji + Blue bubble row */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[36px] lg:text-[42px] flex-shrink-0">🤷‍♀️</span>
              <div className="relative">
                <div
                  className="rounded-[20px] px-5 py-3 lg:px-6 lg:py-3.5"
                  style={{ background: "#5C72C4" }}
                >
                  <span className="text-[14px] lg:text-[17px] text-white font-medium whitespace-nowrap">
                    어떤 불편함을 해결하나요?
                  </span>
                </div>
                {/* Bubble tail pointing left toward emoji */}
                <div
                  className="absolute -left-[6px] top-1/2 -translate-y-1/2 w-0 h-0"
                  style={{
                    borderTop: "8px solid transparent",
                    borderBottom: "8px solid transparent",
                    borderRight: "10px solid #5C72C4",
                  }}
                />
              </div>
            </div>

            {/* Problem text */}
            <p className="text-[15px] lg:text-[18px] leading-[1.7] text-[#333]">
              {problem}
            </p>
          </div>

          {/* Solution Card — right aligned, z-10 (bottom layer), overlaps behind problem card */}
          <div
            className="relative z-10 w-full lg:w-[80%] self-end -mt-6 lg:-mt-[80px] rounded-[20px] p-8 lg:p-10 lg:pt-24 lg:pl-24"
            style={{
              background: "rgba(255, 255, 255, 0.85)",
              border: "0.5px solid rgba(0,0,0,0.06)",
              boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.05)",
              backdropFilter: "blur(10px)",
            }}
          >
            {/* Purple bubble + Anai badge row (right-aligned) */}
            <div className="flex items-center justify-end gap-3 mb-6">
              <div className="relative">
                <div
                  className="rounded-[20px] px-5 py-3 lg:px-6 lg:py-3.5"
                  style={{ background: "#5D4B7A" }}
                >
                  <span className="text-[14px] lg:text-[17px] text-white font-medium whitespace-nowrap">
                    무엇이 바뀌나요?
                  </span>
                </div>
                {/* Bubble tail pointing right toward 아나이 */}
                <div
                  className="absolute -right-[6px] top-1/2 -translate-y-1/2 w-0 h-0"
                  style={{
                    borderTop: "8px solid transparent",
                    borderBottom: "8px solid transparent",
                    borderLeft: "10px solid #5D4B7A",
                  }}
                />
              </div>
              {/* Anai badge */}
              <div className="flex-shrink-0 w-[50px] h-[50px] lg:w-[60px] lg:h-[60px] bg-white border shadow-sm rounded-[12px] flex items-center justify-center">
                <span className="text-[15px] lg:text-[17px] font-bold text-[#333]">
                  아나이
                </span>
              </div>
            </div>

            {/* Solution text */}
            <p className="text-[15px] lg:text-[18px] leading-[1.7] text-[#333] text-right">
              {solution}
            </p>
          </div>
        </motion.div>

        {/* Demo section */}
        <motion.div
          className="mt-10 lg:mt-14"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <span className="block text-[22px] lg:text-[28px] font-normal text-black mb-6 text-center">
            데모영상
          </span>

          {videoSrc && (
            <div className="rounded-[16px] overflow-hidden border border-[#E0E0E0] shadow-lg">
              <video
                src={videoSrc}
                controls
                playsInline
                muted
                loop
                preload="metadata"
                className="w-full"
              />
            </div>
          )}

          {demoHref && (
            <div className="flex justify-end mt-4">
              {demoExternal ? (
                <a
                  href={demoHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-7 py-3 rounded-[10px] bg-white border border-[#333] text-[16px] lg:text-[18px] text-[#333] hover:bg-gray-50 transition-colors"
                >
                  데모 시연하기
                </a>
              ) : (
                <Link
                  href={demoHref}
                  className="inline-flex items-center justify-center px-7 py-3 rounded-[10px] bg-white border border-[#333] text-[16px] lg:text-[18px] text-[#333] hover:bg-gray-50 transition-colors"
                >
                  데모 시연하기
                </Link>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
