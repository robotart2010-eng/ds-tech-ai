"use client";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 메시지 추가 시 자동 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input || isLoading) return;
    
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "사장님이 잠시 자리를 비우셨어요. 잠시 후 다시 시도해주세요." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // ★ 크레텍 연동 버튼 생성 함수
  const renderContent = (content: string) => {
    // [ID:텍스트] 형태를 찾아 분리합니다.
    const parts = content.split(/(\[ID:[^\]]+\])/g);
    
    return parts.map((part, i) => {
      if (part.startsWith("[ID:")) {
        // [ID:계양드릴] -> "계양드릴"만 추출
        const keyword = part.replace("[ID:", "").replace("]", "");
        
        return (
          <button 
            key={i}
            onClick={() => {
              // 크레텍 검색 URL 생성 (한글 깨짐 방지 encodeURIComponent 포함)
              const searchUrl = `https://ctx.cretec.kr/CtxApp/ctx/search/search.do?query=${encodeURIComponent(keyword)}`;
              // 새 탭에서 열기
              window.open(searchUrl, "_blank");
            }}
            className="block mt-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-all shadow-md active:scale-95 border-b-4 border-orange-800 mb-2"
          >
            🛒 '{keyword}' 크레텍에서 바로 확인
          </button>
        );
      }
      return <span key={i} className="leading-relaxed">{part}</span>;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900">
      {/* 헤더 */}
      <header className="p-4 bg-[#0f172a] text-white shadow-xl flex justify-center items-center gap-3 border-b border-blue-500/30">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </div>
        <h1 className="text-xl font-black tracking-tighter italic">
          DS-TECH <span className="text-blue-400 not-italic">AI SMART-GUIDE</span>
        </h1>
      </header>

      {/* 대화창 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`p-4 rounded-2xl shadow-sm max-w-[85%] ${
              m.role === "user" ? "bg-blue-600 text-white" : "bg-white border border-slate-200"
            }`}>
              <div className="whitespace-pre-wrap text-sm md:text-base">
                {renderContent(m.content)}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 p-3 rounded-2xl animate-pulse text-xs text-slate-400 font-bold">
              사장님이 장부 확인 중...
            </div>
          </div>
        )}
      </div>

      {/* 입력부 */}
      <div className="p-4 bg-white border-t shadow-inner">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input 
            className="flex-1 p-4 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="상품명이나 작업 내용을 입력하세요."
            disabled={isLoading}
          />
          <button 
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg disabled:bg-slate-300"
            onClick={handleSend}
            disabled={isLoading}
          >
            상담
          </button>
        </div>
      </div>
    </div>
  );
}