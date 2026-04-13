"use client";

import { useRef } from "react";
import Image from "next/image";
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
            className="relative z-20 w-full lg:w-[80%] rounded-[30px] p-8 lg:p-10 lg:pb-12 lg:pr-24"
            style={{
              background: "#809BF6",
              border: "0.5px solid #FFFFFF",
              boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* Emoji + bubble row */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[42px] lg:text-[50px] flex-shrink-0">🤷‍♀️</span>
              <div className="relative">
                <div
                  className="rounded-[10px] px-5 py-3.5 lg:px-7 lg:py-4 bg-white"
                >
                  <span className="text-[16px] lg:text-[20px] font-medium whitespace-nowrap" style={{ color: "#809BF6" }}>
                    어떤 불편함을 해결하나요?
                  </span>
                </div>
                {/* Bubble tail pointing left */}
                <div
                  className="absolute -left-[6px] top-1/2 -translate-y-1/2"
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: "9px solid transparent",
                    borderBottom: "9px solid transparent",
                    borderRight: "11px solid #FFFFFF",
                  }}
                />
              </div>
            </div>

            {/* Problem text */}
            <p className="text-[16px] lg:text-[20px] leading-[1.4] text-white">
              {problem}
            </p>
          </div>

          {/* Solution Card — right aligned, z-10 (bottom layer), overlaps behind problem card */}
          <div
            className="relative z-10 w-full lg:w-[80%] self-end -mt-6 lg:-mt-[80px] rounded-[30px] p-8 lg:p-10 lg:pt-24 lg:pl-24"
            style={{
              background: "#438AED",
              border: "0.5px solid #FFFFFF",
              boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* Bubble + Anai badge row (right-aligned) */}
            <div className="flex items-center justify-end gap-3 mb-6">
              <div className="relative">
                <div
                  className="rounded-[10px] px-5 py-3.5 lg:px-7 lg:py-4 bg-white"
                >
                  <span className="text-[16px] lg:text-[20px] font-medium whitespace-nowrap" style={{ color: "#438AED" }}>
                    무엇이 바뀌나요?
                  </span>
                </div>
                {/* Bubble tail pointing right */}
                <div
                  className="absolute -right-[6px] top-1/2 -translate-y-1/2"
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: "9px solid transparent",
                    borderBottom: "9px solid transparent",
                    borderLeft: "11px solid #FFFFFF",
                  }}
                />
              </div>
              {/* Anai logo */}
              <Image
                src="/logo.png"
                alt="ANAI"
                width={78}
                height={82}
                className="flex-shrink-0 w-[60px] h-[65px] lg:w-[78px] lg:h-[82px] rounded-[10px] object-contain bg-white"
                style={{ boxShadow: "4px 4px 4px 1px rgba(0, 0, 0, 0.08)" }}
              />
            </div>

            {/* Solution text */}
            <p className="text-[16px] lg:text-[20px] leading-[1.4] text-white text-right">
              {solution}
            </p>
          </div>
        </motion.div>

        {/* Demo section */}
        <motion.div
          className="mt-[70px]"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <span className="block text-[22px] lg:text-[28px] font-normal text-black mb-[30px] text-center">
            데모영상
          </span>

          {videoSrc && (
            <div
              className="rounded-[16px] overflow-hidden border border-[#E0E0E0] shadow-lg bg-black"
              style={{ aspectRatio: "16 / 9" }}
            >
              <video
                src={videoSrc}
                controls
                playsInline
                muted
                loop
                preload="metadata"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {demoHref && (
            <div className="flex justify-center mt-[60px]">
              <div className="group flex flex-col items-center gap-2.5">
                {demoExternal ? (
                  <a
                    href={demoHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-[192px] h-[60px] rounded-full bg-[#7BB5E2] border border-[#AAC5FF] text-white text-[20px] font-medium hover:bg-[#6AA4D1] transition-colors"
                  >
                    데모 시연하기
                  </a>
                ) : (
                  <Link
                    href={demoHref}
                    className="inline-flex items-center justify-center w-[192px] h-[60px] rounded-full bg-[#7BB5E2] border border-[#AAC5FF] text-white text-[20px] font-medium hover:bg-[#6AA4D1] transition-colors"
                  >
                    데모 시연하기
                  </Link>
                )}
                {/* Tooltip below */}
                <div className="flex flex-col items-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                  <div className="w-2.5 h-2.5 bg-[#3B82F6] rotate-45 rounded-[2px] -mb-[5px]" />
                  <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#6366F1] shadow-[0_4px_12px_rgba(59,130,246,0.3)]">
                    <span className="text-white text-[13px] font-medium whitespace-nowrap">
                      직접 사용해보기
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
