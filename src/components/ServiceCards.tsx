"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const cards = [
  {
    id: "service-01",
    title: "눈이 편해지는\n검수",
    subtitle: "반복되는 확인 작업에 지치지 않도록",
    bg: "#FFFCDE",
    text: "#232323",
  },
  {
    id: "service-02",
    title: "멈춤 없는\n안심",
    subtitle: "숨어있는 위험의 신호를 미리 듣고",
    bg: "#5987FD",
    text: "#FFFFFF",
  },
  {
    id: "service-03",
    title: "가벼워지는\n발걸음",
    subtitle: "동선을 깎아내고 기록을 자동화하여",
    bg: "#BCEBFF",
    text: "#111111",
  },
  {
    id: "service-04",
    title: "대화하는\n기록",
    subtitle: "두꺼운 서류 뭉치 대신 대화로",
    bg: "#6C6AD1",
    text: "#FFFFFF",
  },
];

export default function ServiceCards() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="bg-surface py-20 lg:py-28" ref={ref}>
      <div className="max-w-[1512px] mx-auto px-6 md:px-12 lg:px-[144px]">
        {/* Section Title */}
        <motion.h2
          className="text-[28px] lg:text-[35px] font-medium text-[#111] mb-10 lg:mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          서비스 소개
        </motion.h2>

        {/* Cards */}
        <div className="flex gap-4 lg:gap-[22px] overflow-x-auto lg:overflow-visible hide-scrollbar pb-4 lg:pb-0 snap-x snap-mandatory lg:snap-none">
          {cards.map((card, i) => (
            <motion.a
              key={card.id}
              href={`#${card.id}`}
              className="flex-shrink-0 w-[240px] md:w-[260px] lg:w-[280px] h-[290px] md:h-[310px] lg:h-[325px] rounded-[12px] p-6 lg:p-7 flex flex-col justify-between cursor-pointer group snap-center"
              style={{ backgroundColor: card.bg }}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
            >
              <div>
                <p
                  className="text-[11px] leading-snug"
                  style={{ color: card.text, opacity: 0.65 }}
                >
                  {card.subtitle}
                </p>
                <h3
                  className="text-[16px] font-bold leading-snug mt-2 whitespace-pre-line"
                  style={{ color: card.text }}
                >
                  {card.title}
                </h3>
              </div>
              <p
                className="text-[10px] opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                style={{ color: card.text }}
              >
                자세히 보기 &rarr;
              </p>
            </motion.a>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-8 lg:mt-10">
          <div className="h-[4px] bg-[rgba(56,56,56,0.12)] rounded-full overflow-hidden">
            <motion.div
              className="h-[6px] bg-[#3F3F3F] rounded-full -mt-[1px]"
              initial={{ width: "0%" }}
              animate={isInView ? { width: "100%" } : {}}
              transition={{ duration: 1.8, delay: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
