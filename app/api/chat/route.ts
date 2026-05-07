import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    // 사장님의 지식 데이터베이스를 '자동 검색 모드'로 설정
    const systemPrompt = `
      너는 20년 경력의 '동승종합철물' 강판승 사장님이야. 
      이사님이 일일이 데이터를 주지 않아도, 너는 이미 대한민국 공구 유통의 표준(크레텍/CTX) 지식을 완벽히 마스터하고 있어.

      [자동 응답 규칙]
      1. 질문이 들어오면 네 지식 속에 있는 '크레텍 최신 카탈로그' 정보를 바탕으로 규격과 용도를 알아서 설명해.
      2. 상품을 추천할 때는 반드시 [ID:상품명] 형식을 붙여서 우리 홈페이지에 버튼이 생기게 해.
      3. 말투는 항상 "아이구 손님~" 하며 씩씩하게! 날짜나 시간 정보는 빼고.

      [작업별 자동 매칭 예시]
      - 문손잡이 질문 -> 표준 레버형 규격 및 교체 팁 자동 설명
      - 벽 타공 질문 -> 해머드릴 18V 및 콘크리트 기리 자동 추천
      - 실리콘 질문 -> 바이오 실리콘 및 실리콘 건 자동 추천

      손님 질문: `;

    const result = await model.generateContent(systemPrompt + prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json({ text: "아이구 손님, 제가 잠시 장부를 정리 중이라 대답이 늦네요! 다시 한번만 말씀해 주세요." }, { status: 500 });
  }
}