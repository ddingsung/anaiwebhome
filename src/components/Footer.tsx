const footerLinks = [
  { name: "회사소개", href: "#about" },
  { name: "가맹안내", href: "#" },
  { name: "개인정보이용약관", href: "#" },
  { name: "취급방침이용약관", href: "#" },
];

export default function Footer() {
  return (
    <footer className="py-12 lg:py-16" style={{ background: "#0C003F" }}>
      <div className="max-w-[1512px] mx-auto px-6 md:px-12 lg:px-[144px]">
        {/* Top — Logo + Links */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-[39px] h-[39px] bg-[rgba(51,153,51,0.6)] rounded-md flex items-center justify-center">
              <span className="text-[#7F7F7F] text-[18px] font-medium">로고</span>
            </div>
            <span className="text-white text-[25px] font-bold">아나이</span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center gap-3 lg:gap-0">
            {footerLinks.map((link, i) => (
              <span key={link.name} className="flex items-center">
                <a
                  href={link.href}
                  className="text-white text-[15px] lg:text-[18px] font-bold hover:text-[#6E7AE2] transition-colors"
                >
                  {link.name}
                </a>
                {i < footerLinks.length - 1 && (
                  <span className="text-white text-[18px] mx-3 lg:mx-4 hidden lg:inline select-none">
                    |
                  </span>
                )}
              </span>
            ))}
          </nav>
        </div>

        {/* Middle — Contact Info 3 columns */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Phone */}
          <div className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M16.5 12.69v2.25a1.5 1.5 0 01-1.64 1.5 14.84 14.84 0 01-6.47-2.3 14.62 14.62 0 01-4.5-4.5A14.84 14.84 0 011.59 3.14 1.5 1.5 0 013.08 1.5h2.25a1.5 1.5 0 011.5 1.29c.1.63.28 1.25.53 1.84a1.5 1.5 0 01-.34 1.58l-.95.95a12 12 0 004.5 4.5l.95-.95a1.5 1.5 0 011.58-.34c.59.25 1.21.43 1.84.53a1.5 1.5 0 011.06 1.30z" stroke="#51A2FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <p className="text-white text-[14px] font-medium">전화</p>
              <p className="text-[#D1D5DC] text-[14px]">02-1234-5678</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="1.5" y="3" width="15" height="12" rx="1.5" stroke="#51A2FF" strokeWidth="1.5"/>
              <path d="M1.5 5.25L9 10.5l7.5-5.25" stroke="#51A2FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <p className="text-white text-[14px] font-medium">이메일</p>
              <p className="text-[#D1D5DC] text-[14px]">info@anaiway.com</p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 1.5C6.1 1.5 3.75 3.85 3.75 6.75c0 3.94 5.25 9.75 5.25 9.75s5.25-5.81 5.25-9.75c0-2.9-2.35-5.25-5.25-5.25z" stroke="#51A2FF" strokeWidth="1.5"/>
              <circle cx="9" cy="6.75" r="1.88" stroke="#51A2FF" strokeWidth="1.5"/>
            </svg>
            <div>
              <p className="text-white text-[14px] font-medium">주소</p>
              <p className="text-[#D1D5DC] text-[14px]">서울특별시 강서구</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 h-[1px] bg-[#364153]" />

        {/* Bottom */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#99A1AF] text-[12px]">
            © 2026 anaiway.com
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-[#99A1AF] text-[12px] hover:text-white transition-colors">이용약관</a>
            <a href="#" className="text-[#99A1AF] text-[12px] hover:text-white transition-colors">개인정보처리방침</a>
            <a href="#" className="text-[#99A1AF] text-[12px] hover:text-white transition-colors">사업자정보</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
