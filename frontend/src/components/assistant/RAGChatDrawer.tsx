import React, { useState } from 'react';
import { X, Send, Bot, User, Sparkles, ShieldCheck, RefreshCw, FileText } from 'lucide-react';
import { apiService } from '../../services/api';
import { ClinicalTrial, RAGQueryResponse } from '../../types';

interface RAGChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTrial?: ClinicalTrial | null;
  trials: ClinicalTrial[];
}

export const RAGChatDrawer: React.FC<RAGChatDrawerProps> = ({
  isOpen,
  onClose,
  selectedTrial,
  trials,
}) => {
  const [targetTrialId, setTargetTrialId] = useState<string>(
    selectedTrial?.id || (trials.length > 0 ? trials[0].id : 'NCT04512345')
  );
  const [question, setQuestion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<
    Array<{ sender: 'user' | 'assistant'; text: string; sources?: string[]; disclaimer?: string }>
  >([
    {
      sender: 'assistant',
      text: 'Hello! I am your RAG Clinical Trial Assistant. Ask me anything about eligibility requirements, study sites, or investigative treatments for selected trials.',
    },
  ]);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const q = queryText || question;
    if (!q.trim()) return;

    const userMsg = { sender: 'user' as const, text: q };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);

    try {
      const res: RAGQueryResponse = await apiService.queryRAGAssistant(targetTrialId, q);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: res.answer,
          sources: res.sources,
          disclaimer: res.disclaimer,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Unable to retrieve answer from trial knowledge store. Please verify network or trial ID.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    'What are the eligibility requirements?',
    'Where is this trial available?',
    'What treatments are being investigated?',
    'Why did this trial receive a high match score?',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-lg h-full flex flex-col shadow-2xl animate-slideLeft">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">RAG Clinical Trial Assistant</h3>
              <p className="text-[11px] text-slate-400">Grounded Protocol Search & QA Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Trial Selector */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Target Protocol:</span>
          <select
            value={targetTrialId}
            onChange={(e) => setTargetTrialId(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 focus:outline-none text-xs font-mono"
          >
            {trials.map((t) => (
              <option key={t.id} value={t.id}>
                {t.id} - {t.title.slice(0, 45)}...
              </option>
            ))}
          </select>
        </div>

        {/* Quick Question Chips */}
        <div className="p-2.5 bg-slate-900 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-slate-400 shrink-0 font-medium">Quick Queries:</span>
          {quickQuestions.map((qq, i) => (
            <button
              key={i}
              onClick={() => handleSend(qq)}
              className="bg-slate-800 hover:bg-slate-700 text-cyan-300 px-2.5 py-1 rounded-full whitespace-nowrap border border-slate-700 transition-colors shrink-0"
            >
              {qq}
            </button>
          ))}
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 shadow-md ${
                  m.sender === 'user'
                    ? 'bg-cyan-600 text-white rounded-br-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none space-y-2'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>

                {m.sources && m.sources.length > 0 && (
                  <div className="border-t border-slate-800/80 pt-2 text-[10px] text-cyan-400 flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    <span>Source: {m.sources.join(', ')}</span>
                  </div>
                )}

                {m.disclaimer && (
                  <p className="text-[10px] text-amber-400/90 bg-amber-950/40 border border-amber-800/30 p-2 rounded-lg italic">
                    {m.disclaimer}
                  </p>
                )}
              </div>
              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-cyan-400 text-xs">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Retrieving clinical trial vector chunks & synthesizing answer...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask question about eligibility, site location, or drug..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white p-2 rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
