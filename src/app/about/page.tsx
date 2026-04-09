import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutHero from "@/components/about/AboutHero";
import AboutVision from "@/components/about/AboutVision";
import AboutFeatures from "@/components/about/AboutFeatures";
import AboutIndustries from "@/components/about/AboutIndustries";
import AboutProcess from "@/components/about/AboutProcess";
import AboutCta from "@/components/about/AboutCta";

export const metadata = {
  title: "회사소개 | ANAI",
  description:
    "100명의 업무를 단 한 명의 'AI 직원'으로. 기록을 넘어 판단하고 행동하는 맞춤형 AI 파트너, ANAI를 만나보세요.",
};

export default function AboutPage() {
  return (
    <main>
      <Header />
      <AboutHero />
      <AboutVision />
      <AboutFeatures />
      <AboutIndustries />
      <AboutProcess />
      <AboutCta />
      <Footer />
    </main>
  );
}
