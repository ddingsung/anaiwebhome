"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const values = [
  {
    title: "시간의 재배치",
    subtitle: "반복의 시간은 덜어내고",
    description:
      "숙련공조차 하루의 70% 이상을 단순 반복에 씁니다. 의미 없이 버려지던 시간을 기술이 대신 흡수합니다.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="16" stroke="white" strokeWidth="2" />
        <path
          d="M20 12V20L26 26"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "몰입 환경의 조성",
    subtitle: "본질의 가치는 더하고",
    description:
      "잡무가 사라진 자리에 생각할 여유가 생깁니다. 현장 인력은 운영 전문가로 거듭납니다.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="10" stroke="white" strokeWidth="2" />
        <circle cx="20" cy="20" r="4" fill="white" />
        <path
          d="M4 20H10M30 20H36M20 4V10M20 30V36"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "그 이상의 경험",
    subtitle: "단순한 소프트웨어가 아닙니다",
    description:
      "코드를 파는 개발사가 아니라, 현장의 문제를 해결하는 든든한 파트너입니다.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path
          d="M20 6L8 13V27L20 34L32 27V13L20 6Z"
          stroke="white"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M20 6V20M20 20L32 13M20 20L8 13" stroke="white" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "보이지 않는 인프라",
    subtitle: "기술은 배경에서 조용히",
    description:
      "사용자가 기술을 의식하지 않게 합니다. 편리한 경험만 전달합니다.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect
          x="6"
          y="10"
          width="28"
          height="20"
          rx="3"
          stroke="white"
          strokeWidth="2"
        />
        <path
          d="M12 20H28M12 25H24"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="12" cy="16" r="2" fill="white" />
      </svg>
    ),
  },
];

export default function ValueCards() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 lg:py-28 bg-white" ref={ref}>
      <div className="max-w-[1512px] mx-auto px-6 md:px-12 lg:px-[144px]">
        {/* Section Title */}
        <motion.div
          className="text-center mb-14 lg:mb-18"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block border-2 border-[#111] px-6 py-2">
            <h2 className="text-[24px] lg:text-[30px] font-semibold text-[#111]">
              우리의 접근
            </h2>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-7">
          {values.map((value, i) => (
            <motion.div
              key={i}
              className="border-2 border-[#111] rounded-[20px] p-7 lg:p-8 flex flex-col items-center text-center group hover:bg-[#111] transition-colors duration-500 cursor-default"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Icon */}
              <div className="w-[100px] h-[100px] lg:w-[120px] lg:h-[120px] rounded-full bg-[rgba(51,153,51,0.6)] flex items-center justify-center mb-6 group-hover:bg-brand transition-colors duration-500">
                {value.icon}
              </div>

              <h3 className="text-[18px] lg:text-[20px] font-semibold text-[#111] group-hover:text-white transition-colors duration-500 mb-1.5">
                {value.title}
              </h3>

              <p className="text-[13px] text-[#7F7F7F] group-hover:text-[#CACACA] transition-colors duration-500 mb-4">
                {value.subtitle}
              </p>

              <p className="text-[14px] leading-relaxed text-[#7F7F7F] group-hover:text-[#CACACA] transition-colors duration-500">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
