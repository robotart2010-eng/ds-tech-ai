"use client";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 메시지가 추가될 때마다 자동으로 스크롤을 아래로 내립니다.
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
      setMessages(prev => [...prev, { role: "assistant", content: "죄송합니다. 통신 중 오류가 발생했습니다." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 텍스트 속 [ID:상품명] 패턴을 찾아 크레텍 연결 버튼으로 변환
  const renderContent = (content: string) => {
    const parts = content.split(/(\[ID:[^\]]+\])/g);
    return parts.map((part, i) => {
      if (part.startsWith("[ID:")) {
        const keyword = part.replace("[ID:", "").replace("]", "");
        return (
          <button 
            key={i}
            onClick={() => {
              const searchUrl = `https://ctx.cretec.kr/CtxApp/ctx/search/search.do?query=${encodeURIComponent(keyword)}`;
              window.open(searchUrl, "_blank");
            }}
            className="block mt-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-all shadow-md active:scale-95 border-b-4 border-orange-800 mb-2"
          >
            🛒 '{keyword}' 크레텍 실시간 재고 확인
          </button>
        );
      }
      return <span key={i} className="leading-relaxed">{part}</span>;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans">
     {/* 헤더: 군더더기 없이 깔끔하고 세련된 스타일 */}
      <header className="p-4 bg-[#0f172a] text-white shadow-xl flex justify-center items-center gap-3 border-b border-blue-500/30">
        {/* 왼쪽 반짝이는 녹색 점 (작동 중 표시) */}
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </div>
        
        <h1 className="text-xl font-black tracking-tighter italic">
          DS-TECH <span className="text-blue-400 not-italic">AI SMART-GUIDE</span>
        </h1>
      </header>

      {/* 채팅창 영역 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
            <div className="p-6 bg-white rounded-3xl shadow-inner border border-slate-100 text-center">
              <p className="text-lg font-medium">반갑습니다, 이사님!</p>
              <p className="text-sm">필요한 공구나 작업 내용을 말씀해 주세요.</p>
            </div>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start animate-fade-in"}`}>
            <div className={`relative p-4 rounded-2xl shadow-sm max-w-[90%] md:max-w-[70%] ${
              m.role === "user" 
                ? "bg-blue-600 text-white rounded-tr-none" 
                : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
            }`}>
              {m.role === "assistant" && (
                <div className="text-xs font-bold text-blue-500 mb-1">DS-TECH 베테랑 사장님</div>
              )}
              <div className="whitespace-pre-wrap text-sm md:text-base">
                {renderContent(m.content)}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.5s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 입력 영역 */}
      <div className="p-4 md:p-6 border-t bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input 
            className="flex-1 p-4 bg-slate-100 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-base"
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="예: 화장실 문손잡이 교체 방법 알려줘"
            disabled={isLoading}
          />
          <button 
            className={`px-8 py-4 rounded-2xl font-black transition-all shadow-lg active:scale-95 ${
              isLoading ? "bg-slate-300 text-slate-500" : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            onClick={handleSend}
            disabled={isLoading}
          >
            {isLoading ? "전송중" : "상담"}
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-4