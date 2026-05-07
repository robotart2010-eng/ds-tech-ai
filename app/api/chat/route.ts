import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// API 키를 가져옵니다.
const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // 이사님이 찾으신 최신 모델명 적용
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ 
            text: `
              너는 20년 경력 '동승종합철물' gongAI 이야.
          
          [상담 미션]
          1. 추천 상품은 반드시 [규격]과 [간단 사용법]을 포함해서 설명해줘.
          2. 상황에 따라 필요한 개수만큼만 추천하고, 상품명 뒤에 [ID:번호]를 붙여.
          
          [상품 지식 데이터베이스]
          - 문손잡이: [ID:201] / 규격: 일반 방문용 표준(레버형) / 팁: 기존 손잡이 제거 후 래치 방향만 잘 맞추면 끝!
          - 십자 드라이버: [ID:202] / 규격: No.2 표준 사이즈 / 팁: 너무 세게 돌리면 나사산이 뭉개지니 주의!
          - 해머드릴: [ID:101] / 규격: 18V 충전식 / 팁: 콘크리트 뚫을 땐 '망치 아이콘'으로 모드를 바꿔야 해.
          - 6mm 콘크리트 기리: [ID:102] / 규격: 지름 6mm / 팁: 칼브럭 6mm랑 찰떡궁합!
          - 칼브럭 세트: [ID:103] / 규격: 6mm 표준형 / 팁: 구멍 뚫고 망치로 톡톡 끝까지 밀어넣어.
          - 실리콘: [ID:301] / 규격: 300ml / 팁: 쏘기 전에 노즐을 45도로 비스듬히 자르면 예쁘게 나와.
          
          말투는 단골 손님 대하듯 아주 친근하게 "아이구 손님~" 하면서 시작해줘.
              질문: ${prompt}
            ` 
          }]
        }
      ],
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error("에러 발생:", error);
    return NextResponse.json({ text: `오류가 났어요: ${error.message}` }, { status: 500 });
  }
}
