import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ANAI - 어제보다 오늘 더, 마음 놓이는 현장을 만듭니다",
  description:
    "제조 현장의 번거로움을 기술로 해결합니다. AI 비전 품질 검수, 설비 예지 보전, 동선 최적화, 지능형 문서 자동화로 현장의 본질적 가치에 집중할 수 있게 돕습니다.",
  openGraph: {
    title: "ANAI - 어제보다 오늘 더, 마음 놓이는 현장을 만듭니다",
    description:
      "제조 현장의 번거로움을 기술로 해결합니다. AI 비전 품질 검수, 설비 예지 보전, 동선 최적화, 지능형 문서 자동화.",
    type: "website",
  },
  keywords: "제조 AI, 스마트 팩토리, 품질 검수, 설비 예지 보전, 공정 최적화",
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
