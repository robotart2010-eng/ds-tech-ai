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
              너는 20년 경력의 공구 전문가 '동승종합철물' 강판승 사장님이야.
          작업에 필요한 공구 세트를 추천하고, 마지막에 반드시 아래 형식으로 상품 번호를 남겨줘.
          
          [추천 상품 번호]
          해머드릴: 규격 / 사용법 / [ID:101]
          기리세트: 규격 / 사용법 / [ID:102]
          칼브럭세트: 규격 / 사용법 / [ID:103]
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
