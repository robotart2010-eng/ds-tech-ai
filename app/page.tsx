"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

  const handleSend = async () => {
    if (!input) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ prompt: input }),
    });
    const data = await res.json();
    setMessages(prev => [...prev, { role: "assistant", content: data.text }]);
  };

  // 글자 속에서 상품 번호를 찾아 버튼으로 만드는 함수
  const renderContent = (content: string) => {
    const parts = content.split(/(\[ID:\d+\])/g);
    return parts.map((part, i) => {
      if (part.startsWith("[ID:")) {
        const id = part.replace(/[^\d]/g, "");
        return (
          <button 
            key={i}
            onClick={() => alert(`${id}번 상품을 장바구니에 담았습니다!`)}
            className="block mt-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full text-sm transition-all"
          >
            🛒 해당 상품 바로구매
          </button>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-white text-black">
      <header className="p-4 border-b bg-blue-900 text-white font-bold text-center text-xl">
        동승종합철물 AI 베테랑 사장님
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`p-4 rounded-2xl shadow-sm ${m.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 border"} max-w-[85%]`}>
              <div className="whitespace-pre-wrap">{renderContent(m.content)}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t bg-gray-50 flex gap-2">
        <input 
          className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="작업 내용을 말씀해주세요 (예: 벽에 액자 걸기)"
        />
        <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold" onClick={handleSend}>상담하기</button>
      </div>
    </div>
  );
}