import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HashScrollHandler from "@/components/HashScrollHandler";
import ServiceCards from "@/components/ServiceCards";
import ServiceDetail from "@/components/ServiceDetail";
import CtaCards from "@/components/CtaCards";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const serviceDetails = [
  {
    id: "service-01",
    number: "01",
    tag: "영업 직원",
    title: "AI CRM",
    problem:
      "기존 CRM은 관리에는 익숙했는데, 실행의 우선순위까지 보여주지는 못했었어요.",
    solution:
      "AI CRM은 데이터를 정리해두기만 하는 도구가 아닙니다. 무엇을 먼저 보고, 어디에 집중해야 하는지 바로 알려줍니다. 거래처 우선순위, 영업 판단, 매출 흐름을 데이터로 정리해 회사에 맞는 실행 방향을 제시합니다. 사용자는 복잡한 메뉴 대신, 제안된 우선순위를 보고 바로 움직이면 됩니다.",
    demoHref: "/demo/aicrm",
    videoSrc: "/movies/1_aicrm.mp4",
    align: "left" as const,
  },
  {
    id: "service-02",
    number: "02",
    tag: "검사 직원",
    title: "Smart QA",
    problem:
      "하루 종일 제품을 눈으로 검사했더니 속도도 떨어지고, 놓치는 불량도 생겨요. 또, 검사 기준이 사람마다 달라지는 것도 문제에요.",
    solution:
      "카메라 영상에서 스크래치, 찍힘, 오염, 누락 같은 불량을 바로 찾아냅니다. 작업자가 모든 제품을 끝까지 눈으로 확인하지 않아도, 이상이 보인 순간 바로 표시하고 알립니다. 검사는 더 빠르게, 판정은 더 일정하게 바뀝니다.",
    demoHref: "/demo/smartqa",
    videoSrc: "/movies/2_smartqa.mp4",
    align: "right" as const,
  },
  {
    id: "service-03",
    number: "03",
    tag: "학습 직원",
    title: "자동화 어노테이션 (Auto-Labeling)",
    problem:
      "AI 도입의 첫걸음은 데이터 준비라지만, 수많은 이미지를 직접 표시하고 검수하는 방식만으로는 시간과 비용 부담이 저에겐 너무 커요.",
    solution:
      "이미지 속 대상과 결함 영역을 AI가 먼저 표시합니다. 사람은 처음부터 다 그리지 않고, AI가 잡아준 결과를 확인하고 수정만 하면 됩니다. 데이터 준비 시간을 크게 줄여, 현장 적용을 더 빨리 시작할 수 있습니다.",
    demoHref: "/demo/autoannotation",
    videoSrc: "/movies/3_autoannotation.mp4",
    align: "left" as const,
  },
  {
    id: "service-04",
    number: "04",
    tag: "물류 직원",
    title: "Smart Logistics",
    problem:
      "물류 현장에서는 한 구간만 늦어져도 전체 흐름이 쉽게 흔들려요. 도크의 대기, 상하차의 지연, 컨베이어의 정체가 이어지면 결국 출고 전반의 속도와 안정성이 함께 떨어지게 되는거에요.",
    solution:
      "도크, 차량, 상하차, 컨베이어 흐름을 하나로 연결해 병목과 지연 위험을 실시간으로 파악합니다. 도크 재배정, 작업 우선순위 조정, 병목 완화 방안을 함께 제안해 운영자가 더 빠르게 대응할 수 있도록 돕습니다. 기존 시스템을 모두 바꾸지 않아도, 현재 운영 데이터와 설비 정보를 바탕으로 현장에 맞게 단계적으로 적용할 수 있습니다.",
    demoHref: "/demo/smartlog",
    videoSrc: "/movies/4_smartlog.mov",
    align: "right" as const,
  },
  {
    id: "service-05",
    number: "05",
    tag: "행정 직원",
    title: "레거시 문서 지능형 처리 (IDP)",
    problem:
      "주문서나 납품서 같은 문서는 아직도 직접 읽고 다시 입력하는 일이 많아요. 시간도 들고, 무엇보다 놓치는 부분이 있다보니까 오류로 이어진 적도 있어요.",
    solution:
      "문서에서 품목, 수량, 단가, 날짜 같은 핵심 정보를 바로 뽑아냅니다. 사람이 종이를 보고 다시 타이핑하지 않아도, 필요한 데이터를 정리해 다음 업무로 넘길 수 있게 합니다. 읽고 옮겨 적는 일을 줄여, 문서 처리를 더 빠르고 정확하게 만듭니다.",
    demoHref: "/demo/idp",
    videoSrc: "/movies/5_idp.mp4",
    align: "left" as const,
  },
  {
    id: "service-06",
    number: "06",
    tag: "체육 직원",
    title: "K-STAGE",
    problem:
      "학생은 수십 명인데 선생님은 한 분뿐... 저한테 오실 때까지 제 자세가 맞는지 몰라 거울만 멍하니 봐요. 내가 맞게 하고 있는 지 잘 모르겠고 불안해요.",
    solution:
      "카메라 앞에 서기만 하면 AI가 전신 33개 관절을 실시간으로 추적합니다. 선생님이 오실 때까지 기다릴 필요 없이, 현재 내가 어떻게 하고 있는지를 화면에 즉시 수치로 보여줍니다. 틀린 자세를 그 자리에서 바로 교정해주어, 혼자서도 개인 레슨을 받는 것처럼 실력을 키울 수 있습니다.",
    demoHref: "https://kstage.anaiway.com/pose-test",
    demoExternal: true,
    videoSrc: "/movies/6.mov",
    align: "right" as const,
  },
];

export default function Home() {
  return (
    <main>
      <HashScrollHandler />
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
      <CtaCards />
      <Contact />
      <Footer />
    </main>
  );
}
