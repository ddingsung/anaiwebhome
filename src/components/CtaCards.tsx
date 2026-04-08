"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ctaItems = [
  {
    question: "우리 공장에서 버려지는 시간이 얼마나 될까요?",
    title: "공정 효율 진단",
    cta: "무료 진단을 신청하세요",
  },
  {
    question: "현장에 딱 맞는 해결책을 설계해 드립니다.",
    title: "맞춤 솔루션 제안",
    cta: "지금 확인해보세요.",
  },
];

export default function CtaCards() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-16 lg:py-24" ref={ref}>
      <div className="max-w-[1512px] mx-auto px-6 md:px-12 lg:px-[144px]">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 justify-center">
          {ctaItems.map((item, i) => (
            <motion.div
              key={i}
              className="flex-1 max-w-[392px] rounded-[42px] bg-white p-8 lg:p-10 cursor-pointer group hover:shadow-lg transition-shadow"
              style={{
                border: "0.2px solid #B8BFFF",
                boxShadow: "1px 1px 10px 1px rgba(21, 93, 252, 0.1)",
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <p className="text-[18px] lg:text-[21px] font-normal text-[#333] leading-[1.25] mb-6">
                {item.question}
              </p>
              <h3 className="text-[24px] lg:text-[29px] font-semibold text-[#333] mb-3">
                {item.title}
              </h3>
              <p className="text-[18px] lg:text-[21px] font-normal text-[#333]">
                {item.cta}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
