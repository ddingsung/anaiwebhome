"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const demos = [
  {
    href: "/demo/autoannotation",
    title: "Auto Annotation",
    desc: "AI 자동 어노테이션 & 검수",
    color: "#3B82F6",
  },
  {
    href: "/demo/smartqa",
    title: "Smart QA",
    desc: "PCB 비전 검사 대시보드",
    color: "#10B981",
  },
  {
    href: "/demo/aicrm",
    title: "AI CRM",
    desc: "영업 우선순위 의사결정",
    color: "#8B5CF6",
  },
];

export default function DemoLinks() {
  return (
    <section className="bg-[#111] py-10">
      <div className="max-w-[1512px] mx-auto px-6 md:px-12 lg:px-[144px]">
        <p className="text-[13px] text-[#888] mb-4 tracking-wide uppercase">
          Demo
        </p>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {demos.map((demo, i) => (
            <motion.div
              key={demo.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={demo.href}
                className="flex items-center gap-4 px-5 py-3.5 rounded-xl border border-[#333] hover:border-[#555] bg-[#1a1a1a] hover:bg-[#222] transition-all group whitespace-nowrap"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: demo.color }}
                />
                <div>
                  <span className="text-white text-[14px] font-semibold group-hover:text-brand transition-colors">
                    {demo.title}
                  </span>
                  <span className="text-[#777] text-[12px] ml-3">
                    {demo.desc}
                  </span>
                </div>
                <span className="text-[#555] group-hover:text-white text-[14px] ml-2 transition-colors">
                  &rarr;
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
