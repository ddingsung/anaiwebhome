import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServiceCards from "@/components/ServiceCards";
import ServiceDetail from "@/components/ServiceDetail";
import ValueCards from "@/components/ValueCards";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const serviceDetails = [
  {
    id: "service-01",
    number: "01",
    title: "비전 활용 QA 자동화",
    problem:
      "하루 종일 눈을 떼지 못했던 고단함을 덜어드립니다. 조금씩 달랐던 판정 기준을 하나로 맞추고, 아주 미세한 결함까지 놓치지 않습니다.",
    solution:
      "반복적인 육안 검사에서 오는 피로도를 없애고, 품질에 대한 데이터만 남깁니다. 이제 우리는 불량을 골라내는 대신, 왜 불량이 났는지 근본적인 원인을 살필 수 있습니다.",
  },
  {
    id: "service-02",
    number: "02",
    title: "설비 예지 보전",
    problem:
      "갑자기 기계가 서서 일이 멈춰지는 것을 방지합니다. 소음이나 진동의 아주 작은 변화를 포착해 미리 정비할 수 있습니다.",
    solution:
      "근심하는 시간은 사라지고, 계획된 정비와 안정적인 가동만 남습니다. 현장은 언제나 일정한 패턴으로 건강하게 돌아갑니다.",
  },
  {
    id: "service-03",
    number: "03",
    title: "동선 및 재고 최적화",
    problem:
      "물건을 찾거나 재고 수량을 맞추기 위해 현장을 거닐던 시간을 줄여줍니다. 들어오고 나가는 모든 흐름을 자동으로 기록하여, 구석구석 찾지 않아도 한눈에 알 수 있습니다.",
    solution:
      "작업자의 동선은 짧아지고 집중력은 높아집니다. 엉켜있던 물류의 실타래를 풀어, 현장 전체가 막힘없이 흘러가는 환경을 제공합니다.",
  },
  {
    id: "service-04",
    number: "04",
    title: "지능형 문서 자동화 (LLM)",
    problem:
      "두꺼운 매뉴얼, 흩어진 현장 일지 속에서 허비하던 시간을 아껴드립니다. 신입 사원이 올 때마다 똑같은 내용을 반복해서 가르치던 번거로움도 사라집니다.",
    solution:
      "기록은 종이 속에 묻히지 않습니다. LLM에게 묻기만 하세요. AI가 현장의 노하우를 즉시 전달하며, 누구나 숙련공처럼 일할 수 있게 지원합니다.",
  },
];

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <ServiceCards />
      <div id="fna">
        {serviceDetails.map((detail, i) => (
          <div
            key={detail.id}
            className={i % 2 === 1 ? "bg-[#FAFAFA]" : "bg-white"}
          >
            <ServiceDetail {...detail} />
          </div>
        ))}
      </div>
      <ValueCards />
      <Contact />
      <Footer />
    </main>
  );
}
