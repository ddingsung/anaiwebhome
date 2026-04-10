import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ANAI - Beyond Recording, Toward Decision Making",
  description:
    "기록하는 시스템에서 판단하는 시스템으로, 비즈니스의 '다음 수'를 제시합니다",
  openGraph: {
    title: "ANAI - Beyond Recording, Toward Decision Making",
    description:
      "기록하는 시스템에서 판단하는 시스템으로, 비즈니스의 '다음 수'를 제시합니다",
    type: "website",
  },
  keywords:
    "ANAI, AI CRM, Smart QA, 자동화 어노테이션, Smart Logistics, 지능형 문서 처리, K-STAGE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
