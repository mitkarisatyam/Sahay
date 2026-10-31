import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, LanguageCode, Scheme } from '../types';
import { sendChatMessage, submitFeedback } from '../services/api';
import { Bot, User, Send, Copy, Check, Volume2, VolumeX, ThumbsUp, ThumbsDown, ExternalLink, ShieldCheck, Sparkles, RefreshCw, FileText } from 'lucide-react';

interface ChatPageProps {
  language: LanguageCode;
  initialQuery?: string;
  onSelectSchemeById: (schemeId: string) => void;
  onOpenChecklist: (schemeId: string) => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  language,
  initialQuery,
  onSelectSchemeById,
  onOpenChecklist
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [feedbackSent, setFeedbackSent] = useState<Record<string, number>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterPrompts: Record<LanguageCode, string[]> = {
    en: [
      "Find government schemes for farmers in Maharashtra",
      "What are the eligibility criteria and documents for Ladki Bahin Yojana?",
      "How to get 50% college tuition fee reimbursement via MahaDBT?",
      "Cashless hospital treatment rules under MJPJAY health scheme"
    ],
    mr: [
      "लाडकी बहीण योजनेसाठी कोणती कागदपत्रे लागतात आणि दरमहा किती मिळतात?",
      "महाराष्ट्रातील शेतकऱ्यांसाठी नमो शेतकरी योजनेची माहिती द्या",
      "महात्मा जोतिराव फुले जन आरोग्य योजनेअंतर्गत ५ लाख कॅशलेस उपचार कसे मिळतात?",
      "महाविद्यालयातील विद्यार्थ्यांसाठी एसटी बस प्रवास सवलत कशी मिळते?"
    ],
    hi: [
      "लाड़की बहिन योजना के तहत महिलाओं को कितनी आर्थिक सहायता मिलती है?",
      "नमो शेतकरी महासम्मान निधि योजना में पात्रता और आवेदन के नियम बताएं",
      "महात्मा फुले जन आरोग्य योजना में अस्पताल में मुफ्त इलाज के लिए क्या आवश्यक है?",
      "डॉ. बाबासाहेब आंबेडकर स्वाधार योजना क्या है और किसे लाभ मिलता है?"
    ]
  };

  // Initial welcome greeting
  useEffect(() => {
    const welcomeMessages: Record<LanguageCode, string> = {
      en: "Hello! I am SAHAY AI, your citizen services assistant for Maharashtra Government welfare schemes. I provide source-grounded answers in Marathi, Hindi, and English with official citations.\n\nHow may I help you today?",
      mr: "नमस्कार! मी सहाय्य AI, महाराष्ट्र शासनाच्या जनकल्याणकारी योजनांसाठी आपला डिजिटल मार्गदर्शक आहे. मी अधिकृत शासन निर्णयांच्या आधारे मराठी, हिंदी आणि इंग्रजीतून खात्रीशीर उत्तरे देतो.\n\nआपल्याला कोणत्या योजनेबद्दल माहिती हवी आहे?",
      hi: "नमस्ते! मैं सहाय्य AI हूँ, महाराष्ट्र सरकार की जनकल्याणकारी योजनाओं हेतु आपका डिजिटल सहायक। मैं आधिकारिक सरकारी अधिसूचनाओं के आधार पर सत्यापित मार्गदर्शन प्रदान करता हूँ।\n\nमैं आपकी क्या सहायता कर सकता हूँ?"
    };

    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: welcomeMessages[language],
          createdAt: new Date().toISOString(),
          provider: 'local-grounded'
        }
      ]);
    }
  }, [language]);

  // Handle initialQuery if passed from home search
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSendMessage(initialQuery.trim());
    }
  }, [initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      language,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendChatMessage(textToSend.trim(), language, sessionId || undefined);
      if (response.sessionId) {
        setSessionId(response.sessionId);
      }

      const assistantMsg: ChatMessage = {
        id: response.messageId || `ast-${Date.now()}`,
        role: 'assistant',
        content: response.answer,
        language: response.language,
        sources: response.sources,
        related_schemes: response.related_schemes,
        document_checklist: response.document_checklist,
        eligibility_guidance: response.eligibility_guidance,
        disclaimer: response.disclaimer,
        provider: response.provider,
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `Error: Unable to connect to the knowledge retrieval engine (${error.message}). Please check your connection and try again.`,
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string, msgLang?: LanguageCode) => {
    if ('speechSynthesis' in window) {
      if (speakingId === id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (msgLang === 'mr') utterance.lang = 'mr-IN';
      else if (msgLang === 'hi') utterance.lang = 'hi-IN';
      else utterance.lang = 'en-IN';

      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);

      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFeedback = async (msgId: string, rating: number) => {
    setFeedbackSent(prev => ({ ...prev, [msgId]: rating }));
    try {
      await submitFeedback({
        sessionId,
        messageId: msgId,
        rating
      });
    } catch (e) {
      console.warn('Feedback submit error', e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 h-[calc(100vh-140px)] flex flex-col">
      {/* Chat Header Card */}
      <div className="bg-white rounded-t-2xl border border-slate-200 px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#14263D] text-white flex items-center justify-center shadow-xs">
            <Bot className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900">
                SAHAY AI Citizen Services Assistant
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>RAG Grounded</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {language === 'mr' ? 'मराठी, हिंदी आणि इंग्रजीतून अधिकृत माहिती' : language === 'hi' ? 'मराठी, हिंदी और अंग्रेजी में सत्यापित जानकारी' : 'Strictly verified Maharashtra Government welfare intelligence'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([]);
            setSessionId('');
          }}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          title="Start fresh conversation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Session</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 bg-[#F7F8F5] border-x border-slate-200 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                  isUser
                    ? 'bg-[#167D83] text-white'
                    : 'bg-[#14263D] text-teal-400'
                }`}
              >
                {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                <div
                  className={`p-4 rounded-2xl shadow-xs text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#167D83] text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                  }`}
                >
                  {/* Message text with whitespace support */}
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {/* Document Checklist Pill badges */}
                  {msg.document_checklist && msg.document_checklist.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <span className="text-xs font-semibold text-slate-700 block mb-2">
                        Key Required Documents:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {msg.document_checklist.map((doc, i) => (
                          <div key={i} className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
                            <span className="font-semibold block">{doc.name}</span>
                            <span className="text-[11px] text-slate-500">{doc.purpose}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Related Schemes links */}
                  {msg.related_schemes && msg.related_schemes.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Matched Welfare Schemes:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {msg.related_schemes.map((s) => (
                          <div key={s.id} className="flex items-center space-x-1">
                            <button
                              onClick={() => onSelectSchemeById(s.id)}
                              className="text-xs font-medium bg-teal-50 hover:bg-teal-100 text-[#167D83] px-2.5 py-1 rounded-lg border border-teal-200 transition-colors flex items-center space-x-1 cursor-pointer"
                            >
                              <span>{s.name}</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onOpenChecklist(s.id)}
                              className="text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-lg border border-slate-200 transition-colors flex items-center space-x-1 cursor-pointer"
                              title="Generate checklist"
                            >
                              <FileText className="w-3 h-3 text-teal-600" />
                              <span className="hidden sm:inline">Checklist</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sources citation footer */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                      <div className="flex items-center space-x-1 text-slate-600 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                        <span>Official Grounded Sources:</span>
                      </div>
                      {msg.sources.map((src, idx) => (
                        <div key={idx} className="flex items-center justify-between pl-4">
                          <span>• {src.source_name} (Verified: {src.source_verified_date})</span>
                          <a
                            href={src.official_portal_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#167D83] hover:underline flex items-center space-x-0.5 ml-2"
                          >
                            <span>Portal</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Disclaimer notice */}
                  {msg.disclaimer && (
                    <div className="mt-2 text-[10px] text-slate-400 italic">
                      {msg.disclaimer}
                    </div>
                  )}
                </div>

                {/* Assistant Message Actions Toolbar */}
                {!isUser && (
                  <div className="flex items-center space-x-3 px-1 text-xs text-slate-400">
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="hover:text-slate-600 flex items-center space-x-1 transition-colors cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleSpeak(msg.id, msg.content, msg.language)}
                      className="hover:text-slate-600 flex items-center space-x-1 transition-colors cursor-pointer"
                      title="Read aloud"
                    >
                      {speakingId === msg.id ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                          <span className="text-rose-500">Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Listen</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center space-x-1 border-l border-slate-200 pl-3">
                      <button
                        onClick={() => handleFeedback(msg.id, 1)}
                        className={`p-1 rounded hover:bg-slate-200 transition-colors ${
                          feedbackSent[msg.id] === 1 ? 'text-emerald-600 font-bold' : ''
                        }`}
                        title="Helpful"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleFeedback(msg.id, -1)}
                        className={`p-1 rounded hover:bg-slate-200 transition-colors ${
                          feedbackSent[msg.id] === -1 ? 'text-rose-600 font-bold' : ''
                        }`}
                        title="Not helpful"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-[10px] text-slate-400 ml-auto">
                      Engine: {msg.provider || 'local-grounded'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#14263D] text-teal-400 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-xs border border-slate-200 shadow-xs flex items-center space-x-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]"></span>
              <span className="ml-2 font-medium">Searching verified Maharashtra Government database...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starter Prompts Pill Row */}
      {messages.length <= 2 && (
        <div className="bg-white px-4 py-2 border-x border-slate-200 flex items-center space-x-2 overflow-x-auto text-xs">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="text-slate-400 shrink-0 font-medium">Suggested:</span>
          {starterPrompts[language].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="bg-slate-100 hover:bg-teal-50 hover:text-[#167D83] hover:border-teal-300 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200 shrink-0 transition-colors cursor-pointer text-left"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Chat Input Bar */}
      <div className="bg-white rounded-b-2xl border border-slate-200 p-3 sm:p-4 shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              language === 'mr'
                ? 'शासकीय योजना, पात्रता किंवा कागदपत्रांबद्दल विचारा...'
                : language === 'hi'
                ? 'सरकारी योजनाओं, पात्रता या दस्तावेजों के बारे में पूछें...'
                : 'Ask about any Maharashtra scheme, eligibility, or documents...'
            }
            className="flex-1 px-4 py-3 bg-[#F7F8F5] border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-teal-500 transition-colors"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-[#167D83] hover:bg-[#13666b] disabled:bg-slate-300 text-white p-3 rounded-xl transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <div className="flex justify-between items-center mt-2 px-1 text-[11px] text-slate-400">
          <span>Responses are strictly verified against Maharashtra Government Resolutions (GRs).</span>
          <span className="hidden sm:inline">Protected: No personal identifiers collected.</span>
        </div>
      </div>
    </div>
  );
};

