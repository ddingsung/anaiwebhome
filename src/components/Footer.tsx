const footerLinks = [
  { name: "회사소개", href: "#about" },
  { name: "서비스", href: "#service-01" },
  { name: "개인정보처리방침", href: "#" },
  { name: "이용약관", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-black py-12 lg:py-16">
      <div className="max-w-[1512px] mx-auto px-6 md:px-12 lg:px-[144px]">
        {/* Top */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-[39px] h-[39px] bg-[rgba(51,153,51,0.6)] rounded-md flex items-center justify-center">
              <span className="text-[#ccc] text-[18px] font-medium">A</span>
            </div>
            <span className="text-white text-[25px] font-bold">아나이</span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center gap-3 lg:gap-0">
            {footerLinks.map((link, i) => (
              <span key={link.name} className="flex items-center">
                <a
                  href={link.href}
                  className="text-white text-[15px] lg:text-[18px] font-bold hover:text-[#7F68E3] transition-colors"
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

        {/* Company Info */}
        <div className="mt-10 pt-8 border-t border-[#333]">
          <div className="border border-[#7F7F7F] rounded-lg p-5 lg:p-6 inline-block">
            <p className="text-[#7F7F7F] text-[14px] lg:text-[16px] leading-relaxed">
              주식회사 아나이 &nbsp;|&nbsp; 대표이사: OOO &nbsp;|&nbsp;
              사업자등록번호: 000-00-00000
              <br />
              주소: 대한민국 &nbsp;|&nbsp; 이메일: contact@anai.kr
            </p>
          </div>
          <p className="text-[#555] text-[13px] mt-6">
            &copy; 2026 ANAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
