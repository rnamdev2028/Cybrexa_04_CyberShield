import React, { useState, useEffect } from "react";
import { GlossaryItem } from "../types";
import { BookOpen, Search, Send, Cpu, Terminal, Award, HelpCircle, Check, X, Shield, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function KnowledgeSection() {
  const [glossary, setGlossary] = useState<GlossaryItem[]>([]);
  const [searchGlossary, setSearchGlossary] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [question, setQuestion] = useState<string>("");
  const [assistantAnswer, setAssistantAnswer] = useState<string>("");
  const [loadingAnswer, setLoadingAnswer] = useState<boolean>(false);
  const [errorAns, setErrorAns] = useState<string>("");

  // Quiz Simulator state
  const [activeQuizIndex, setActiveQuizIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  const QUIZ_QUESTIONS = [
    {
      q: "Which cryptographic protocol is primarily used to secure communication over a VPN tunnel at the network layer?",
      options: [
        { code: "A", text: "IPsec (Internet Protocol Security)" },
        { code: "B", text: "TLS 1.3 (Transport Layer Security)" },
        { code: "C", text: "SSH (Secure Shell)" },
        { code: "D", text: "SFTP (Secure File Transfer)" }
      ],
      correct: "A",
      explanation: "IPsec runs at the Network Layer (Layer 3) of the OSI model, making it the bedrock tunneling standard to secure Site-to-Site and Client-to-Site VPN connections."
    },
    {
      q: "In a SQL Injection scenario, which SQL sequence represents a classic authentication bypass logic attempt?",
      options: [
        { code: "A", text: "SELECT * FROM users WHERE status = 'active'" },
        { code: "B", text: "' OR '1'='1" },
        { code: "C", text: "DROP TABLE system_configs;" },
        { code: "D", text: "GRANT ALL PRIVILEGES TO hacker;" }
      ],
      correct: "B",
      explanation: "' OR '1'='1 closes the target input block and inserts a universally true identity clause, causing web server credential evaluations to return true and bypass credentials entirely."
    },
    {
      q: "Which defense methodology relies on implementing multiple discrete security controls across administrative, physical, and technical domains?",
      options: [
        { code: "A", text: "Zero Trust Architecture" },
        { code: "B", text: "Symmetric Encryption Integration" },
        { code: "C", text: "Defense in Depth" },
        { code: "D", text: "Vulnerability Scanning Triage" }
      ],
      correct: "C",
      explanation: "Defense in Depth structures multiple overlapping security protective ring fences, ensuring that the exploit of one measure does not fully breach the organization's asset surface."
    }
  ];

  useEffect(() => {
    fetchGlossary();
  }, []);

  const fetchGlossary = async () => {
    const res = await fetch("/api/glossary");
    const data = await res.json();
    if (data.success) {
      setGlossary(data.glossary);
    }
  };

  const handleAskAssistant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      setLoadingAnswer(true);
      setErrorAns("");
      setAssistantAnswer("");

      const res = await fetch("/api/knowledge/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setAssistantAnswer(data.answer);
      } else {
        setErrorAns(data.error || "Failed loading security training vector.");
      }
    } catch (err) {
      setErrorAns("Establishment of training line failed. Check network.");
    } finally {
      setLoadingAnswer(false);
    }
  };

  const filteredGlossary = glossary.filter(item => {
    const matchesCategory = activeCategory === "ALL" || item.category === activeCategory;
    const matchesSearch = item.word.toLowerCase().includes(searchGlossary.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchGlossary.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleQuizAnswer = (code: string) => {
    if (selectedAnswer) return; // Prevent multiple clicks
    setSelectedAnswer(code);
    if (code === QUIZ_QUESTIONS[activeQuizIndex].correct) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    setSelectedAnswer(null);
    if (activeQuizIndex + 1 < QUIZ_QUESTIONS.length) {
      setActiveQuizIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setActiveQuizIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="knowledge-section-viewport">
      
      {/* 1. SEC PLUS / CISSP CHALLENGE CENTER */}
      <div className="lg:col-span-4 flex flex-col space-y-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-2 border-b border-slate-850 pb-2.5">
          <Award className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">Sec+ & CISSP Certification Coach</h2>
        </div>

        {!quizCompleted ? (
          <div className="flex flex-col flex-1 justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span>QUESTION {activeQuizIndex + 1} OF {QUIZ_QUESTIONS.length}</span>
                <span>SCORE: {quizScore} / {QUIZ_QUESTIONS.length}</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                {QUIZ_QUESTIONS[activeQuizIndex].q}
              </p>

              <div className="space-y-2 pt-2.5">
                {QUIZ_QUESTIONS[activeQuizIndex].options.map((opt) => {
                  const isSelected = selectedAnswer === opt.code;
                  const isCorrect = opt.code === QUIZ_QUESTIONS[activeQuizIndex].correct;
                  
                  let btnStyle = "bg-slate-950 border-slate-850 hover:border-slate-750 text-slate-300";
                  if (selectedAnswer) {
                    if (isCorrect) {
                      btnStyle = "bg-emerald-500/10 border-emerald-500/40 text-emerald-400";
                    } else if (isSelected) {
                      btnStyle = "bg-red-500/10 border-red-500/40 text-red-500";
                    } else {
                      btnStyle = "bg-slate-950 opacity-40 border-slate-900 text-slate-500";
                    }
                  }

                  return (
                    <button
                      key={opt.code}
                      onClick={() => handleQuizAnswer(opt.code)}
                      disabled={selectedAnswer !== null}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs font-mono transition-all flex items-center gap-2 ${btnStyle}`}
                    >
                      <span className="bg-slate-900 w-5 h-5 rounded-md flex items-center justify-center border border-slate-800 shrink-0 text-[10px] text-cyan-400 font-bold">
                        {opt.code}
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedAnswer && (
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 text-[10px] font-mono text-slate-400 leading-relaxed">
                <span className="text-cyan-400 font-bold block mb-1">EDUCATIONAL RATIONALE</span>
                {QUIZ_QUESTIONS[activeQuizIndex].explanation}
                <button
                  onClick={handleNextQuiz}
                  className="w-full mt-3 py-1.5 bg-cyan-700 hover:bg-cyan-600 text-cyan-50 font-mono text-xs rounded transition-colors flex items-center justify-center gap-1"
                >
                  <span>{activeQuizIndex + 1 === QUIZ_QUESTIONS.length ? "Finish Quiz" : "Next Question"}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 py-8 text-center space-y-4">
            <Award className="w-12 h-12 text-yellow-500/80" />
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Challenge Suite Complete</h3>
              <p className="text-xl font-bold font-mono text-cyan-400 mt-1">{Math.round((quizScore / QUIZ_QUESTIONS.length) * 100)}% Accuracy Rating</p>
              <p className="text-xs text-slate-500 mt-1">Obtained score: {quizScore} out of {QUIZ_QUESTIONS.length} correct trials.</p>
            </div>
            <button
              onClick={restartQuiz}
              className="px-4 py-1.5 border border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-500/5 text-cyan-400 font-mono text-xs rounded-lg transition-colors"
            >
              Recycle Simulator
            </button>
          </div>
        )}
      </div>

      {/* 2. CHAT ASSISTANT & SEC GLOSSARY SECTION */}
      <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800 backdrop-blur-md">
        
        {/* Interactive SecOps Assistant */}
        <div className="flex flex-col bg-slate-950/40 border border-slate-800 p-4 rounded-xl min-h-[300px]">
          <div className="border-b border-slate-900 pb-2 mb-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              White-Labeled Training Bot
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">Interrogative assistant for secure-coding, network audit guidelines, or cryptography questions.</p>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[190px] mb-3 bg-slate-950 p-2.5 border border-slate-900 rounded-lg text-[11px] font-mono pr-1 relative flex flex-col">
            {loadingAnswer ? (
              <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center space-y-2 select-none">
                <span className="w-4 h-4 border border-cyan-500 border-t-transparent rounded-full animate-spin"></span>
                <span className="text-[9px] text-slate-500 font-mono tracking-wider">Evaluating cryptographic registers...</span>
              </div>
            ) : null}

            {errorAns ? (
              <div className="text-red-400 text-xs">{errorAns}</div>
            ) : assistantAnswer ? (
              <div className="text-slate-300 leading-relaxed p-1 select-text">
                {assistantAnswer.split("\n").map((line, ix) => {
                  if (line.startsWith("#")) {
                    return <span key={ix} className="text-cyan-400 font-semibold block mt-2 border-b border-slate-900 pb-0.5">{line.replace(/#/g, "")}</span>;
                  }
                  if (line.startsWith("-") || line.startsWith("*")) {
                    return <span key={ix} className="pl-3 block text-slate-400">{line}</span>;
                  }
                  return <span key={ix} className="block text-slate-400 mb-1">{line}</span>;
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-600 h-full py-12 text-center">
                <Shield className="w-8 h-8 mb-2 opacity-25 text-cyan-400" />
                <span className="text-[10px] tracking-wide text-slate-600 block leading-normal">Ask any cybersecurity engineering design topic or framework details.</span>
              </div>
            )}
          </div>

          <form onSubmit={handleAskAssistant} className="flex gap-2">
            <input
              type="text"
              placeholder="What is salt hashing? (CEH/Sec+ questions)"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 font-mono text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-cyan-500/50"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button
              type="submit"
              disabled={loadingAnswer}
              className="bg-cyan-700 hover:bg-cyan-600 text-cyan-50 px-3 py-1.5 rounded-lg flex items-center justify-center transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Glossary Search Panel */}
        <div className="flex flex-col bg-slate-950/40 border border-slate-800 p-4 rounded-xl min-h-[300px]">
          <div className="border-b border-slate-900 pb-2 mb-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                Glossary Directory
              </h3>
              <div className="relative">
                <Search className="w-3 h-3 text-slate-500 absolute left-2 top-2" />
                <input
                  type="text"
                  placeholder="Filter glossary..."
                  className="bg-slate-950 border border-slate-850 pl-7 pr-3 py-0.5 rounded text-[10px] font-mono text-slate-300 placeholder-slate-700 focus:outline-none"
                  value={searchGlossary}
                  onChange={(e) => setSearchGlossary(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1 mt-2.5 overflow-x-auto">
              {["ALL", "Vulnerabilities", "Threat Actors", "Methodology", "Exploits"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[9px] font-mono px-2 py-0.5 border rounded transition-all ${
                    activeCategory === cat
                      ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
                      : "bg-slate-950 border-slate-850 hover:border-slate-800 text-slate-500"
                  }`}
                >
                  {cat === "ALL" ? "All categories" : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[224px] pr-1.5 space-y-2.5">
            {filteredGlossary.map((gWord, idx) => (
              <div key={idx} className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-850 leading-relaxed font-mono">
                <div className="flex justify-between items-center border-b border-slate-900/50 pb-1 mb-1">
                  <span className="text-slate-200 font-bold text-xs">{gWord.word}</span>
                  <span className="text-[9px] text-slate-500 uppercase border border-slate-850 px-1 py-0.2 rounded bg-slate-950">{gWord.category}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">{gWord.description}</p>
              </div>
            ))}
            {filteredGlossary.length === 0 && (
              <div className="text-slate-600 text-center font-mono py-16 text-[10px]">
                No glossary matches exist.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
