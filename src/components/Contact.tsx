"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);

  return (
    <section
      id="contact"
      className="relative py-20 lg:py-32 overflow-hidden"
      ref={ref}
      style={{
        background: "linear-gradient(180deg, #FDFDFD -6.28%, #F1F1F1 100%)",
      }}
    >
      <div className="relative z-10 max-w-[1512px] mx-auto px-6 md:px-12 lg:px-[144px]">
        {/* Main Contact Card */}
        <motion.div
          className="rounded-[30px] p-8 lg:p-12"
          style={{
            background: "rgba(255, 255, 255, 0.75)",
            border: "0.5px solid #FFFFFF",
            boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.05)",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
            {/* Left Column — Consultation Methods */}
            <div className="flex-1">
              <h2 className="text-[18px] lg:text-[21px] font-bold text-[#333] mb-6">
                지금 바로 상담받기
              </h2>

              {/* KakaoTalk Card */}
              <div
                className="rounded-[13px] p-6 mb-4"
                style={{
                  background: "#FFFFFF",
                  border: "0.5px solid #E2E2E2",
                  boxShadow: "0px 12px 10px rgba(0, 0, 0, 0.08)",
                }}
              >
                <div className="flex items-center gap-4">
                  {/* KakaoTalk Icon */}
                  <div
                    className="w-[49px] h-[49px] rounded-[9px] flex items-center justify-center"
                    style={{
                      background: "#FEE500",
                      boxShadow: "0px 4px 15px rgba(254, 229, 0, 0.35)",
                    }}
                  >
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                      <path
                        d="M13 4C7.477 4 3 7.463 3 11.733c0 2.759 1.866 5.177 4.684 6.544l-.955 3.49c-.084.308.266.556.537.38l4.187-2.764c.513.06 1.036.09 1.547.09 5.523 0 10-3.463 10-7.74C23 7.463 18.523 4 13 4z"
                        fill="#391B1B"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[14px] font-semibold text-[#333]">카카오톡 상담</h4>
                    <p className="text-[12px] text-[#333] opacity-80">
                      평일 09:00-18:00
                    </p>
                    <p className="text-[14px] font-medium text-[#333]">
                      1:1 실시간 채팅 상담
                    </p>
                  </div>
                  <a
                    href="https://pf.kakao.com/_JHxidX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1.5 rounded-[7px] bg-[#FEE500] text-[#391B1B] text-[12px] font-semibold text-center hover:bg-[#F5DC00] transition-colors"
                  >
                    채팅하기
                  </a>
                </div>
              </div>

              {/* Email Card */}
              <div
                className="rounded-[13px] p-6"
                style={{
                  background: "#FFFFFF",
                  border: "0.5px solid #E2E2E2",
                  boxShadow: "0px 12px 10px rgba(0, 0, 0, 0.08)",
                }}
              >
                <div className="flex items-center gap-4">
                  {/* Email Icon */}
                  <div className="w-[49px] h-[49px] rounded-[9px] flex items-center justify-center"
                    style={{ boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.08)" }}>
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
                      <rect x="2" y="4" width="20" height="16" rx="2" stroke="#333" strokeWidth="2"/>
                      <path d="M2 7l10 7 10-7" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[14px] font-semibold text-[#333]">이메일 문의</h4>
                    <p className="text-[12px] text-[#333] opacity-80">24시간 접수</p>
                    <p className="text-[14px] font-medium text-[#333]">info@packagedesign.co.kr</p>
                  </div>
                  <a
                    href="mailto:info@packagedesign.co.kr"
                    className="px-4 py-1.5 rounded-[7px] bg-[#6E7AE2] text-white text-[12px] font-medium text-center hover:bg-[#5B68CF] transition-colors"
                  >
                    메일 보내기
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column — Contact Form */}
            <div className="flex-1">
              <div
                className="rounded-[13px] bg-white p-7"
                style={{
                  boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
              >
                <h3 className="text-[18px] lg:text-[21px] font-semibold text-[#101828] mb-5">
                  빠른 문의하기
                </h3>

                {!submitted ? (
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSubmitted(true);
                    }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Company Name */}
                      <div>
                        <label className="block text-[12px] font-medium text-[#364153] mb-1.5">
                          회사명
                        </label>
                        <input
                          type="text"
                          placeholder="회사명을 입력해주세요"
                          className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[7px] text-[12px] text-[#111] placeholder:text-[#717182] focus:outline-none focus:border-[#6E7AE2] focus:ring-1 focus:ring-[#6E7AE2] transition-colors"
                        />
                      </div>
                      {/* Contact Person */}
                      <div>
                        <label className="block text-[12px] font-medium text-[#364153] mb-1.5">
                          담당자명 *
                        </label>
                        <input
                          type="text"
                          placeholder="담당자명을 입력해주세요"
                          required
                          className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[7px] text-[12px] text-[#111] placeholder:text-[#717182] focus:outline-none focus:border-[#6E7AE2] focus:ring-1 focus:ring-[#6E7AE2] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Phone */}
                      <div>
                        <label className="block text-[12px] font-medium text-[#364153] mb-1.5">
                          연락처 *
                        </label>
                        <input
                          type="tel"
                          placeholder="연락처를 입력해주세요"
                          required
                          className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[7px] text-[12px] text-[#111] placeholder:text-[#717182] focus:outline-none focus:border-[#6E7AE2] focus:ring-1 focus:ring-[#6E7AE2] transition-colors"
                        />
                      </div>
                      {/* Email */}
                      <div>
                        <label className="block text-[12px] font-medium text-[#364153] mb-1.5">
                          이메일 *
                        </label>
                        <input
                          type="email"
                          placeholder="이메일을 입력해주세요"
                          required
                          className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[7px] text-[12px] text-[#111] placeholder:text-[#717182] focus:outline-none focus:border-[#6E7AE2] focus:ring-1 focus:ring-[#6E7AE2] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-[12px] font-medium text-[#364153] mb-1.5">
                        상담 내용
                      </label>
                      <textarea
                        placeholder="문의하시고자 하는 내용을 남겨주세요."
                        rows={4}
                        className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[7px] text-[12px] text-[#111] placeholder:text-[#717182] focus:outline-none focus:border-[#6E7AE2] focus:ring-1 focus:ring-[#6E7AE2] transition-colors resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#6E7AE2] text-white text-[15px] font-medium rounded-[7px] hover:bg-[#5B68CF] transition-colors"
                    >
                      무료 상담 신청하기
                    </button>

                    <p className="text-center text-[12px] text-[#6A7282]">
                      문의 접수 후 24시간 내 연락드립니다
                    </p>
                  </form>
                ) : (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#6E7AE2] flex items-center justify-center">
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <path d="M6 14L12 20L22 8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="text-[24px] font-bold text-[#111] mb-2">접수되었습니다</h3>
                    <p className="text-[16px] text-[#7F7F7F]">빠르게 연락드리겠습니다. 감사합니다.</p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Info Bar */}
        <motion.div
          className="mt-8 rounded-[30px] p-8 lg:p-10"
          style={{
            background: "rgba(255, 255, 255, 0.75)",
            border: "0.5px solid #FFFFFF",
            boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.05)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row gap-8 md:gap-0 md:justify-between">
            {/* Location */}
            <div className="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#6E7AE2" strokeWidth="2"/>
                <circle cx="12" cy="9" r="2.5" stroke="#6E7AE2" strokeWidth="2"/>
              </svg>
              <div>
                <p className="text-[14px] lg:text-[16px] font-medium text-[#333]">오시는 길</p>
                <p className="text-[13px] lg:text-[14px] text-[#333] opacity-80">서울특별시 강서구</p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#6E7AE2" strokeWidth="2"/>
                <path d="M12 6v6l4 2" stroke="#6E7AE2" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <div>
                <p className="text-[14px] lg:text-[16px] font-medium text-[#333]">운영시간</p>
                <p className="text-[13px] lg:text-[14px] text-[#333] opacity-80">평일 09:00 - 18:00 (주말 휴무)</p>
              </div>
            </div>

            {/* Business Info */}
            <div className="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="7" width="18" height="13" rx="2" stroke="#6E7AE2" strokeWidth="2"/>
                <path d="M3 7l9 6 9-6" stroke="#6E7AE2" strokeWidth="2"/>
              </svg>
              <div>
                <p className="text-[14px] lg:text-[16px] font-medium text-[#333]">사업자 정보</p>
                <p className="text-[13px] lg:text-[14px] text-[#333] opacity-80">사업자등록번호: 123-45-67890</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
