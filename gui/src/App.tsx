import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, 
  Shield, 
  Cpu, 
  Globe,
  Zap,
  Activity,
  Database,
  Code2,
  Settings,
  ArrowRight,
  Copy,
  Check,
  Radio,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  Sliders,
  TerminalSquare,
  FolderTree,
  Save,
  Download,
  FileCode,
  CheckCircle,
  HardDrive,
  Cpu as CpuIcon,
  Layers,
  FileText,
  CheckSquare,
  Command,
  Play,
  Share2,
  RotateCcw,
  SlidersHorizontal,
  BrainCircuit,
  Eye,
  Monitor,
  BookOpen,
  ChevronDown,
  ChevronUp,
  User,
  Key,
  Sliders as SlidersIcon,
  CheckCircle2,
  Upload,
  Paperclip,
  FileUp
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "./lib/utils";

// --- THEMES DEFINITION ---
const THEMES = {
  cyan: {
    primary: "#00f0ff",
    secondary: "#7000ff",
    rgb: "0, 240, 255",
    label: "Neural Cyan",
    accent: "from-cyan-500 to-blue-600",
    border: "border-cyan-500/30",
    bgGlow: "rgba(0, 240, 255, 0.15)"
  }
};

type ThemeKey = keyof typeof THEMES;

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  toolsUsed?: string[];
  thinkingProcess?: string;
  computerAction?: string;
  tokenUsage?: { in: number; out: number };
}

interface AgentStatus {
  id: string;
  name: string;
  role: string;
  status: "ACTIVE" | "PROCESSING" | "IDLE";
  load: number;
}

interface FileTreeItem {
  path: string;
  name: string;
  size: number;
}

interface Artifact {
  id: string;
  title: string;
  type: "plan" | "task" | "walkthrough" | "diff";
  content: string;
}

interface UserSettings {
  operatorName: string;
  openaiKey: string;
  anthropicKey: string;
  geminiKey: string;
  nvidiaKey: string;
  ollamaUrl: string;
}

const SLASH_COMMANDS = [
  { cmd: "/goal", desc: "Long-running autonomous task execution mode" },
  { cmd: "/plan", desc: "Generate multi-step architecture implementation plan" },
  { cmd: "/audit", desc: "Run AST vulnerability and security scan" },
  { cmd: "/schedule", desc: "Set recurring background automation timer" },
  { cmd: "/browser", desc: "Launch headless browser subagent session" },
  { cmd: "/grill-me", desc: "Interactive requirements alignment interview" },
  { cmd: "/learn", desc: "Persist custom workflow memory for future tasks" },
  { cmd: "/zip", desc: "Export complete project boilerplate zip" }
];

const playSciFiSound = (type: "click" | "launch" | "bleep" | "success" | "upload") => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === "click") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === "launch" || type === "upload") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === "success") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523, now);
      osc.frequency.setValueAtTime(659, now + 0.08);
      osc.frequency.setValueAtTime(783, now + 0.16);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (e) {}
};

const NeuralVortex3DCanvas = ({ themeColor, isProcessing }: { themeColor: string; isProcessing: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let rotationAngle = 0;

    const resize = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left - canvas.width / 2) * 0.001,
        y: (e.clientY - rect.top - canvas.height / 2) * 0.001
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", resize);
    resize();

    const particleCount = 180;
    const particles = Array.from({ length: particleCount }, (_, i) => {
      const u = (i / particleCount) * Math.PI * 2;
      const v = (i % 20) * (Math.PI * 2 / 20);
      return { u, v, speed: (Math.random() * 0.02 + 0.01) * (i % 2 === 0 ? 1 : -1) };
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      rotationAngle += isProcessing ? 0.04 : 0.012;
      const rx = mouseRef.current.y + rotationAngle;
      const ry = mouseRef.current.x + rotationAngle * 1.2;

      const R = Math.min(cx, cy) * 0.45;
      const r = R * 0.35;

      const projectedPoints: any[] = [];

      particles.forEach((p) => {
        p.u += p.speed * (isProcessing ? 2.5 : 1);
        
        const x3d = (R + r * Math.cos(p.v)) * Math.cos(p.u);
        const y3d = (R + r * Math.cos(p.v)) * Math.sin(p.u);
        const z3d = r * Math.sin(p.v);

        const cosX = Math.cos(rx), sinX = Math.sin(rx);
        const cosY = Math.cos(ry), sinY = Math.sin(ry);

        const x1 = x3d * cosY + z3d * sinY;
        const y1 = y3d;
        const z1 = -x3d * sinY + z3d * cosY;

        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;

        const distance = 400;
        const fov = distance / (distance + z2 + R);
        const x2d = cx + x2 * fov;
        const y2d = cy + y2 * fov;

        projectedPoints.push({
          x: x2d,
          y: y2d,
          z: z2,
          scale: fov,
          alpha: Math.max(0.1, Math.min(1, (z2 + R) / (2 * R)))
        });
      });

      projectedPoints.sort((a, b) => b.z - a.z);

      ctx.lineWidth = 0.8;
      for (let i = 0; i < projectedPoints.length; i += 2) {
        const pt1 = projectedPoints[i];
        const pt2 = projectedPoints[(i + 5) % projectedPoints.length];
        const dist = Math.hypot(pt1.x - pt2.x, pt1.y - pt2.y);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(pt1.x, pt1.y);
          ctx.lineTo(pt2.x, pt2.y);
          ctx.strokeStyle = `rgba(${themeColor}, ${0.12 * (1 - dist / 100)})`;
          ctx.stroke();
        }
      }

      projectedPoints.forEach((pt) => {
        const radius = Math.max(1, pt.scale * (isProcessing ? 3.5 : 2.5));
        
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${themeColor}, ${pt.alpha})`;
        ctx.shadowColor = `rgb(${themeColor})`;
        ctx.shadowBlur = isProcessing ? 15 : 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      const corePulse = Math.sin(rotationAngle * 3) * 10 + (isProcessing ? 45 : 30);
      const gradient = ctx.createRadialGradient(cx, cy, 2, cx, cy, corePulse);
      gradient.addColorStop(0, `rgba(${themeColor}, 0.9)`);
      gradient.addColorStop(0.5, `rgba(${themeColor}, 0.3)`);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.beginPath();
      ctx.arc(cx, cy, corePulse, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, [themeColor, isProcessing]);

  return <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />;
};

const CodeBlock = ({ inline, className, children, ...props }: any) => {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedPath, setSavedPath] = useState<string | null>(null);

  const codeText = String(children).replace(/\n$/, "");

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    playSciFiSound("click");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveFile = async () => {
    const targetPath = prompt("Enter file path to save code on disk:", "src/generated_code.tsx");
    if (!targetPath) return;

    setSaving(true);
    try {
      const resp = await fetch("http://localhost:5000/api/save_file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath: targetPath, content: codeText })
      });
      const data = await resp.json();
      if (data.success) {
        setSavedPath(targetPath);
        playSciFiSound("success");
        setTimeout(() => setSavedPath(null), 3500);
      } else {
        alert(`Save failed: ${data.detail || data.message}`);
      }
    } catch (err) {
      alert(`Error saving file: ${err}`);
    } finally {
      setSaving(false);
    }
  };

  if (inline) {
    return <code className={cn("bg-white/10 px-1.5 py-0.5 rounded text-cyan-300 font-mono text-[13px]", className)} {...props}>{children}</code>;
  }

  return (
    <div className="relative group my-4 first:mt-0 last:mb-0">
      <div className="absolute right-3 top-3 z-20 flex items-center gap-2">
        <button
          onClick={handleSaveFile}
          disabled={saving}
          className={cn(
            "px-2.5 py-1 rounded-md transition-all duration-300 backdrop-blur-md border flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider",
            savedPath ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : "bg-black/60 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20 hover:text-white"
          )}
          title="Save code directly to disk file"
        >
          {savedPath ? (
            <>
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-3 h-3" />
              <span>{saving ? "Saving..." : "Save to File"}</span>
            </>
          )}
        </button>

        <button
          onClick={handleCopy}
          className={cn(
            "px-2.5 py-1 rounded-md transition-all duration-300 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider",
            copied ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : "bg-black/40 text-white/50 hover:bg-white/10 hover:text-white"
          )}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <pre className={cn("p-5 overflow-x-auto rounded-xl bg-black/70 border border-white/10 custom-scrollbar text-[13px] leading-relaxed shadow-2xl", className)}>
        <code className="block font-mono text-cyan-300/90" {...props}>{children}</code>
      </pre>
    </div>
  );
};

const ClaudeThinkingBox = ({ thinkingText }: { thinkingText: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-3 rounded-xl bg-purple-950/20 border border-purple-500/30 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-purple-900/20 hover:bg-purple-900/30 flex items-center justify-between text-left transition-colors"
      >
        <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest flex items-center gap-1.5">
          <BrainCircuit className="w-3.5 h-3.5 text-purple-400" /> Claude Thought & Reasoning Trace
        </span>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-purple-400" /> : <ChevronDown className="w-3.5 h-3.5 text-purple-400" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-3 text-xs text-purple-200/80 font-mono leading-relaxed bg-black/40 border-t border-purple-500/20 italic"
          >
            {thinkingText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const theme = THEMES.cyan;

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"3d_hud" | "console">("3d_hud");
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [showArtifacts, setShowArtifacts] = useState(false);
  const [planningMode, setPlanningMode] = useState(false);
  
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // FIRST-TIME ONBOARDING & SETUP WIZARD STATE
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings>({
    operatorName: "Pratik",
    openaiKey: "",
    anthropicKey: "",
    geminiKey: "",
    nvidiaKey: "",
    ollamaUrl: "http://localhost:11434"
  });

  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>({
    id: "1",
    title: "implementation_plan.md",
    type: "plan",
    content: "# Claude 3.5 & Antigravity Architecture Plan\n\n- `[x]` Initialize 3D Neural Vortex Engine\n- `[x]` Claude 3.5 Sonnet Reasoning & Computer Use\n- `[x]` First-Time Onboarding & Setup Wizard\n- `[x]` Desktop File Drag-and-Drop Uploader\n- `[/]` Execute Autonomous Tool Call Stream"
  });

  const [artifactsList, setArtifactsList] = useState<Artifact[]>([
    {
      id: "1",
      title: "implementation_plan.md",
      type: "plan",
      content: "# Claude 3.5 & Antigravity Architecture Plan\n\n- `[x]` Initialize 3D Neural Vortex Engine\n- `[x]` Claude 3.5 Sonnet Reasoning & Computer Use\n- `[x]` First-Time Onboarding & Setup Wizard\n- `[x]` Desktop File Drag-and-Drop Uploader\n- `[/]` Execute Autonomous Tool Call Stream"
    },
    {
      id: "2",
      title: "task_checklist.md",
      type: "task",
      content: "# Autonomous Task Progression\n\n- [x] Workspace AST Audit\n- [x] 1-Click File Saver Pipeline\n- [x] Desktop Drag & Drop Upload Engine\n- [x] Claude 3.5 Thinking Trace & Computer Use"
    }
  ]);

  const [workspaceFiles, setWorkspaceFiles] = useState<FileTreeItem[]>([]);
  const [showFileTree, setShowFileTree] = useState(false);
  const [ollamaInfo, setOllamaInfo] = useState<{ active: boolean; models: string[] }>({ active: false, models: [] });
  const [showExporter, setShowExporter] = useState(false);

  const [agentSwarm, setAgentSwarm] = useState<AgentStatus[]>([
    { id: "1", name: "ip_agent_001", role: "Claude 3.5 Code Architect", status: "ACTIVE", load: 78 },
    { id: "2", name: "vortex_scout", role: "AST Refactor Engine", status: "IDLE", load: 12 },
    { id: "3", name: "neural_sec", role: "Vulnerability Probe", status: "ACTIVE", load: 45 },
    { id: "4", name: "vox_synth", role: "Speech Synthesis Core", status: "IDLE", load: 0 }
  ]);

  const [gauges, setGauges] = useState({ cpu: 42, mem: 64, net: 18, engine: 91 });
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const completed = localStorage.getItem("ip_agent_setup_completed");
    if (!completed) {
      setShowSetupWizard(true);
    }

    const savedName = localStorage.getItem("ip_agent_operator_name");
    if (savedName) setUserSettings(prev => ({ ...prev, operatorName: savedName }));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setGauges({
        cpu: Math.min(100, Math.max(15, 30 + Math.random() * 25)),
        mem: Math.min(100, Math.max(50, 60 + Math.random() * 8)),
        net: Math.min(100, Math.max(5, 12 + Math.random() * 35)),
        engine: Math.min(100, Math.max(80, 88 + Math.random() * 10))
      });
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const refreshWorkspaceTree = () => {
    fetch("http://localhost:5000/api/workspace_tree")
      .then(res => res.json())
      .then(data => {
        if (data.files) setWorkspaceFiles(data.files);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/status")
      .then(res => res.json())
      .then(data => {
        if (data.ollama) setOllamaInfo(data.ollama);
        if (data.settings && data.settings.operatorName) {
          setUserSettings(prev => ({ ...prev, ...data.settings }));
        }
      })
      .catch(() => {});

    refreshWorkspaceTree();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- DRAG AND DROP DESKTOP UPLOADER HANDLER ---
  const handleFileUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    playSciFiSound("upload");
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("targetDir", "uploads");

      try {
        const resp = await fetch("http://localhost:5000/api/upload_file", {
          method: "POST",
          body: formData
        });
        const data = await resp.json();
        if (data.success) {
          refreshWorkspaceTree();
          handleSend(`I uploaded '${data.filename}' to workspace. Please inspect and process this file.`);
        }
      } catch (err) {
        alert(`File upload failed: ${err}`);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    if (val.startsWith("/")) {
      setShowSlashMenu(true);
    } else {
      setShowSlashMenu(false);
    }
  };

  const handleSlashSelect = (cmd: string) => {
    setInput(cmd + " ");
    setShowSlashMenu(false);
    if (soundEnabled) playSciFiSound("click");
  };

  const handleSaveSetupWizard = async () => {
    localStorage.setItem("ip_agent_setup_completed", "true");
    localStorage.setItem("ip_agent_operator_name", userSettings.operatorName);

    try {
      await fetch("http://localhost:5000/api/save_settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userSettings)
      });
    } catch (e) {}

    setShowSetupWizard(false);
    playSciFiSound("success");
  };

  const handleSend = async (promptText?: string) => {
    const query = promptText || input;
    if (!query.trim() || isLoading) return;

    if (soundEnabled) playSciFiSound("launch");

    const mockTools = query.toLowerCase().includes("plan") 
      ? ["run_command", "view_file", "write_to_file", "ask_permission"] 
      : ["run_command", "write_to_file"];

    const mockThinking = `Analyzing request for "${query.slice(0, 30)}..." -> Operator: ${userSettings.operatorName} -> Checking AST node safety -> Formulating code output...`;
    const mockComputerAction = query.toLowerCase().includes("browser") 
      ? "CLICK (x:640, y:480) -> TYPE 'npm run dev' -> SCREENSHOT CAPTURED" 
      : undefined;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!promptText) setInput("");
    setShowSlashMenu(false);
    setIsLoading(true);
    setActiveTab("console");

    setAgentSwarm(prev => prev.map(a => a.id === "1" ? { ...a, status: "PROCESSING", load: 95 } : a));

    try {
      const resp = await fetch("http://localhost:5000/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: query })
      });

      const data = await resp.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.error ? `### ⚠️ Runtime Issue\n\n${data.output}` : data.output,
        timestamp: new Date(),
        toolsUsed: mockTools,
        thinkingProcess: mockThinking,
        computerAction: mockComputerAction,
        tokenUsage: { in: Math.floor(Math.random() * 800 + 400), out: Math.floor(Math.random() * 1200 + 600) }
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `### 🌐 Connection Failed\n\nEnsure \`python server.py\` is running on port 5000.`,
        timestamp: new Date(),
        toolsUsed: ["run_command"],
        thinkingProcess: mockThinking,
        tokenUsage: { in: 320, out: 150 }
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setAgentSwarm(prev => prev.map(a => a.id === "1" ? { ...a, status: "ACTIVE", load: 78 } : a));
    }
  };

  const handleExportZip = async (projectType: string) => {
    try {
      const resp = await fetch("http://localhost:5000/api/export_project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectType })
      });

      if (resp.ok) {
        const blob = await resp.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${projectType}_starter_kit.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        playSciFiSound("success");
      } else {
        alert("Failed to export project ZIP");
      }
    } catch (err) {
      alert(`Export error: ${err}`);
    } finally {
      setShowExporter(false);
    }
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="flex h-screen w-full overflow-hidden relative bg-[#05050d] text-gray-200 font-mono antialiased selection:bg-cyan-500/20"
    >
      
      {/* Hidden File Input Picker */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)} 
        className="hidden" 
        multiple
      />

      {/* DRAG AND DROP OVERLAY */}
      <AnimatePresence>
        {isDraggingOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-cyan-950/80 backdrop-blur-2xl border-4 border-dashed border-cyan-400 flex flex-col items-center justify-center text-center p-8 select-none"
          >
            <Upload className="w-20 h-20 text-cyan-400 animate-bounce mb-4" />
            <h2 className="text-3xl font-black text-white uppercase italic tracking-widest">
              DROP DESKTOP FILES HERE
            </h2>
            <p className="text-sm text-cyan-300 font-mono mt-2">
              Files will be uploaded directly into your workspace repository!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Cyber Grid */}
      <div className="neural-mesh pointer-events-none" />

      {/* Dynamic Background Glow */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-1000 blur-3xl opacity-20"
        style={{ background: `radial-gradient(circle at 50% 30%, ${theme.primary}, transparent 70%)` }}
      />

      {/* --- SIDEBAR / AGENT SWARM --- */}
      <aside className="w-80 bg-[#090914]/90 backdrop-blur-2xl border-r border-white/10 flex flex-col z-30 select-none">
        
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg text-black shadow-lg"
              style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
            >
              IP
            </div>
            <div>
              <h1 className="text-sm font-black tracking-wider text-white uppercase italic leading-none flex items-center gap-1.5">
                IP Codemaker
              </h1>
              <div className="flex items-center gap-1 text-[9px] font-mono mt-1 font-bold text-emerald-400">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>IP VERSE VERIFIED</span>
              </div>
              <p className="text-[9px] font-mono mt-0.5 font-semibold tracking-widest uppercase text-cyan-400">
                Operator: {userSettings.operatorName}
              </p>
            </div>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#00ff88]" />
        </div>

        {/* PROJECTS & KNOWLEDGE BASE BUTTON */}
        <div className="p-4 border-b border-white/10 bg-purple-950/10">
          <button
            onClick={() => setShowProjectModal(true)}
            className="w-full p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center justify-between transition-all"
          >
            <span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-purple-400" /> Project Knowledge Base</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-200">200K Context</span>
          </button>
        </div>

        {/* PLANNING MODE TOGGLE */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" /> Planning Mode
          </span>
          <button
            onClick={() => setPlanningMode(!planningMode)}
            className={cn(
              "px-3 py-1 rounded-lg text-[10px] font-bold transition-all border uppercase",
              planningMode ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" : "bg-white/5 text-gray-500 border-white/10"
            )}
          >
            {planningMode ? "ENABLED" : "DIRECT"}
          </button>
        </div>

        {/* Local GPU Ollama Telemetry Widget */}
        <div className="p-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <CpuIcon className="w-3.5 h-3.5 text-purple-400" /> Local GPU LLM (Ollama)
            </span>
            <span className={cn(
              "text-[8px] font-bold px-1.5 py-0.5 rounded uppercase border",
              ollamaInfo.active ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 animate-pulse" : "bg-white/5 text-gray-500 border-white/10"
            )}>
              {ollamaInfo.active ? "ACTIVE" : "STANDBY"}
            </span>
          </div>

          <div className="text-[9px] text-gray-400 font-mono">
            {ollamaInfo.active ? (
              <span className="text-emerald-300 font-bold">Loaded: {ollamaInfo.models.slice(0, 2).join(", ") || "Ollama GPU Core"}</span>
            ) : (
              <span>Run <code className="text-cyan-400">ollama run llama3</code> to enable GPU</span>
            )}
          </div>
        </div>

        {/* System Diagnostics */}
        <div className="p-5 border-b border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" style={{ color: theme.primary }} /> Neural Core Metrics
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 border border-white/10 font-bold" style={{ color: theme.primary }}>
              ONLINE
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-gray-400">GPU Tensor Load</span>
                <span className="font-bold">{gauges.engine.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full transition-all duration-700 rounded-full" style={{ width: `${gauges.engine}%`, backgroundColor: theme.primary }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-gray-400">RAM Context Pool</span>
                <span className="font-bold">{gauges.mem.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full transition-all duration-700 rounded-full" style={{ width: `${gauges.mem}%`, backgroundColor: theme.primary }} />
              </div>
            </div>
          </div>
        </div>

        {/* Agent Swarm List */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-4">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5" style={{ color: theme.primary }} /> Active IP Army Swarm
          </div>

          <div className="space-y-2.5">
            {agentSwarm.map((agent) => (
              <div 
                key={agent.id}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: agent.status === "PROCESSING" ? "#ffcc00" : agent.status === "ACTIVE" ? theme.primary : "#666" }} />
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">{agent.name}</span>
                  </div>
                  <span className={cn(
                    "text-[8px] font-bold px-1.5 py-0.5 rounded uppercase",
                    agent.status === "PROCESSING" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse" :
                    agent.status === "ACTIVE" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-white/5 text-gray-500"
                  )}>
                    {agent.status}
                  </span>
                </div>
                <div className="text-[10px] text-gray-400">{agent.role}</div>
              </div>
            ))}
          </div>
        </div>

      </aside>

      {/* --- MAIN HUD VIEWPORT --- */}
      <main className="flex-1 flex flex-col relative min-w-0 h-full z-20">
        
        {/* Top Header Bar */}
        <header className="h-16 px-6 bg-[#090914]/80 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between z-30 select-none">
          <div className="flex items-center gap-4">
            
            {/* View Mode Toggle */}
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => {
                  setActiveTab("3d_hud");
                  if (soundEnabled) playSciFiSound("click");
                }}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                  activeTab === "3d_hud" ? "bg-white/10 text-white shadow-md border border-white/20" : "text-gray-400 hover:text-white"
                )}
                style={activeTab === "3d_hud" ? { color: theme.primary } : {}}
              >
                <Sparkles className="w-3.5 h-3.5" /> 3D Neural HUD
              </button>

              <button
                onClick={() => {
                  setActiveTab("console");
                  if (soundEnabled) playSciFiSound("click");
                }}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                  activeTab === "console" ? "bg-white/10 text-white shadow-md border border-white/20" : "text-gray-400 hover:text-white"
                )}
                style={activeTab === "console" ? { color: theme.primary } : {}}
              >
                <TerminalSquare className="w-3.5 h-3.5" /> Console Execution
              </button>
            </div>

            {/* ARTIFACTS DRAWER TOGGLE */}
            <button
              onClick={() => setShowArtifacts(!showArtifacts)}
              className={cn(
                "px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2",
                showArtifacts ? "bg-purple-500/20 text-purple-300 border-purple-500/40" : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
              )}
            >
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>Artifacts ({artifactsList.length})</span>
            </button>

            {/* WORKSPACE TREE TOGGLE BUTTON */}
            <button
              onClick={() => setShowFileTree(!showFileTree)}
              className={cn(
                "px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2",
                showFileTree ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
              )}
            >
              <FolderTree className="w-3.5 h-3.5 text-cyan-400" />
              <span>Workspace Files</span>
            </button>

          </div>

          <div className="flex items-center gap-4">
            
            {/* DESKTOP FILE UPLOAD BUTTON */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 font-bold text-xs shadow-lg flex items-center gap-2 transition-all"
              title="Upload desktop files directly into workspace"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Upload Desktop File</span>
            </button>

            {/* FULL PROJECT ZIP EXPORTER DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setShowExporter(!showExporter)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold text-xs shadow-lg flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export Zip Kit</span>
              </button>

              <AnimatePresence>
                {showExporter && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-12 w-64 p-3 bg-[#0d0d1e] border border-cyan-500/30 rounded-2xl shadow-2xl z-50 space-y-2 backdrop-blur-xl"
                  >
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 py-1">Select Zip Export</div>
                    {[
                      { label: "🔥 Live Real-Time Workspace", type: "full_workspace", desc: "Zips current disk files & source code" },
                      { label: "React 18 + Vite Starter", type: "react_vite", desc: "Tailwind CSS & Lucide Icons" },
                      { label: "FastAPI Python Backend", type: "fastapi_app", desc: "Async Uvicorn CORS Server" },
                      { label: "Jarvis Voice Assistant Kit", type: "jarvis_voice", desc: "Python Voice STT & TTS Bot" }
                    ].map((proj) => (
                      <button
                        key={proj.type}
                        onClick={() => handleExportZip(proj.type)}
                        className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-400/40 border border-white/5 transition-all text-left group"
                      >
                        <div className="text-xs font-bold text-white group-hover:text-cyan-300">{proj.label}</div>
                        <div className="text-[9px] text-gray-400">{proj.desc}</div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FIRST-TIME SETUP & SETTINGS GEAR BUTTON */}
            <button
              onClick={() => setShowSetupWizard(true)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Open Setup & API Key Settings"
            >
              <Settings className="w-4 h-4 text-cyan-400" />
            </button>

            {/* Sound Toggle */}
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)} 
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Toggle Audio Feedback"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 opacity-40" />}
            </button>
          </div>
        </header>

        {/* Viewport Body */}
        <div className="flex-1 relative overflow-hidden flex">
          
          {/* WORKSPACE FILE TREE DRAWER */}
          <AnimatePresence>
            {showFileTree && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="bg-[#090914]/95 border-r border-white/10 h-full overflow-y-auto custom-scrollbar p-4 flex flex-col z-30"
              >
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5 text-cyan-400" /> Local Repository</span>
                  <span className="text-cyan-400">{workspaceFiles.length} files</span>
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-2 mb-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <FileUp className="w-3.5 h-3.5 text-cyan-400" /> Upload Desktop File
                </button>

                <div className="space-y-1">
                  {workspaceFiles.map((file, idx) => (
                    <div 
                      key={idx}
                      className="p-2 rounded-lg bg-white/[0.02] hover:bg-white/10 text-xs text-gray-300 font-mono flex items-center gap-2 cursor-pointer transition-colors truncate"
                      onClick={() => setInput(`Explain code in file: ${file.path}`)}
                    >
                      <FileCode className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span className="truncate">{file.path}</span>
                    </div>
                  ))}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* ARTIFACTS DRAWER */}
          <AnimatePresence>
            {showArtifacts && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 340, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="bg-[#0c0c1e]/95 border-r border-purple-500/20 h-full overflow-y-auto custom-scrollbar p-4 flex flex-col z-30 shadow-2xl"
              >
                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-purple-400" /> Artifacts Preview
                </div>

                <div className="flex gap-2 mb-4">
                  {artifactsList.map((art) => (
                    <button
                      key={art.id}
                      onClick={() => setActiveArtifact(art)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border truncate",
                        activeArtifact?.id === art.id ? "bg-purple-500/20 text-purple-300 border-purple-500/40" : "bg-white/5 text-gray-400 border-white/10"
                      )}
                    >
                      {art.title}
                    </button>
                  ))}
                </div>

                {activeArtifact && (
                  <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-xs leading-relaxed text-gray-300 custom-scrollbar overflow-y-auto flex-1">
                    <ReactMarkdown>{activeArtifact.content}</ReactMarkdown>
                  </div>
                )}
              </motion.aside>
            )}
          </AnimatePresence>

          <div className="flex-1 relative overflow-hidden h-full">
            {activeTab === "3d_hud" ? (
              <div className="w-full h-full relative flex flex-col justify-between p-8">
                
                {/* 3D Canvas Visualizer */}
                <div className="absolute inset-0 z-0">
                  <NeuralVortex3DCanvas themeColor={theme.rgb} isProcessing={isLoading} />
                </div>

                {/* Top Stat Overlay */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 z-10 max-w-5xl mx-auto w-full">
                  {[
                    { label: `Operator: ${userSettings.operatorName}`, val: "200K Context", sub: "Claude 3.5 Sonnet Engine" },
                    { label: "Antigravity AI", val: "Multi-Agent Swarm", sub: "Tool Calls & Slash Commands" },
                    { label: "Interactive Artifacts", val: "Live Web & Code", sub: "1-Click File Saver & Zip" },
                    { label: "Execution Sandbox", val: "Active (AES-256)", sub: "PowerShell & FastAPI" }
                  ].map((st, i) => (
                    <div 
                      key={i} 
                      className="glass-panel p-4 border border-white/10 hover:border-white/30 transition-all backdrop-blur-md group"
                      style={{ boxShadow: `0 4px 20px -2px ${theme.bgGlow}` }}
                    >
                      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{st.label}</div>
                      <div className="text-lg font-black text-white group-hover:scale-105 transition-transform" style={{ color: theme.primary }}>
                        {st.val}
                      </div>
                      <div className="text-[9px] text-gray-500 mt-1">{st.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Quick Action Matrix */}
                <div className="z-10 max-w-4xl mx-auto w-full space-y-4">
                  <div className="text-center">
                    <h2 className="text-3xl font-black uppercase tracking-wider text-white italic glow-text-blue" style={{ textShadow: `0 0 25px ${theme.primary}66` }}>
                      Claude 3.5 & Antigravity Agent Workspace
                    </h2>
                    <p className="text-xs text-gray-400 mt-1 font-mono">Drag & Drop desktop files onto screen or type / for Slash Commands</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { title: "Jarvis Voice Bot", prompt: "jarvis voice assistant", icon: Bot },
                      { title: "React Login Form", prompt: "write a login page in react", icon: Code2 },
                      { title: "Python Web Scraper", prompt: "python web scraper", icon: Zap },
                      { title: "Express REST API", prompt: "express rest api", icon: Database }
                    ].map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(action.prompt)}
                        className="p-4 rounded-xl bg-black/60 border border-white/10 hover:border-cyan-400/50 hover:bg-white/5 transition-all text-left group backdrop-blur-md"
                      >
                        <action.icon className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" style={{ color: theme.primary }} />
                        <div className="text-xs font-bold text-white group-hover:text-cyan-300">{action.title}</div>
                        <div className="text-[9px] text-gray-500 mt-1 line-clamp-1">{action.prompt}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-4" />

              </div>
            ) : (
              /* CONSOLE / CHAT EXECUTION VIEW */
              <div className="w-full h-full flex flex-col p-6 overflow-y-auto custom-scrollbar space-y-6">
                {messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                    <TerminalSquare className="w-16 h-16 mb-4" style={{ color: theme.primary }} />
                    <h3 className="text-lg font-bold text-white uppercase">Claude 3.5 & Antigravity Stream Ready</h3>
                    <p className="text-xs text-gray-400 mt-1 max-w-md">Type / to open Slash Commands menu or ask any question below.</p>
                  </div>
                ) : (
                  <div className="max-w-4xl mx-auto w-full space-y-6">
                    {messages.map((m) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn("flex flex-col gap-2", m.role === "user" ? "items-end" : "items-start")}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                            {m.role === "user" ? `Operator: ${userSettings.operatorName}` : "Claude 3.5 Sonnet Agent"}
                          </span>
                          
                          {m.computerAction && (
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono flex items-center gap-1">
                              <Monitor className="w-3 h-3 text-purple-400" /> [COMPUTER USE: {m.computerAction}]
                            </span>
                          )}

                          {m.toolsUsed && m.toolsUsed.map((tool, tIdx) => (
                            <span key={tIdx} className="text-[8px] px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono">
                              [{tool}]
                            </span>
                          ))}

                          {m.tokenUsage && (
                            <span className="text-[8px] text-gray-500 font-mono">
                              ({m.tokenUsage.in} in / {m.tokenUsage.out} out)
                            </span>
                          )}
                        </div>

                        {m.thinkingProcess && (
                          <ClaudeThinkingBox thinkingText={m.thinkingProcess} />
                        )}

                        <div className={cn(
                          "p-5 rounded-2xl backdrop-blur-xl border relative shadow-xl max-w-[85%]",
                          m.role === "user" ? "bg-white/10 border-white/20 text-white" : "bg-black/80 border-white/10 text-gray-200"
                        )}>
                          <ReactMarkdown components={{ code: CodeBlock }}>{m.content}</ReactMarkdown>
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <div className="flex items-center gap-3 p-4 bg-black/60 rounded-xl border border-white/10 w-fit">
                        <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: theme.primary }} />
                        <span className="text-xs text-gray-400 font-mono animate-pulse">Claude 3.5 is synthesizing reasoning & executing tools...</span>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Command Input Bar */}
        <div className="p-6 bg-[#090914]/90 border-t border-white/10 z-30 relative">
          
          {/* SLASH COMMAND AUTOCOMPLETE MENU */}
          <AnimatePresence>
            {showSlashMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-6 right-6 bottom-24 max-w-4xl mx-auto p-3 bg-[#0a0a1a] border border-cyan-500/40 rounded-2xl shadow-2xl z-50 grid grid-cols-2 gap-2 backdrop-blur-2xl"
              >
                <div className="col-span-2 text-[10px] font-bold text-cyan-400 uppercase tracking-widest px-2 py-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Command className="w-3.5 h-3.5" /> Antigravity Slash Commands</span>
                  <span className="text-gray-500">Press ESC to dismiss</span>
                </div>
                {SLASH_COMMANDS.map((sc) => (
                  <button
                    key={sc.cmd}
                    onClick={() => handleSlashSelect(sc.cmd)}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-400/40 border border-white/5 transition-all text-left flex flex-col group"
                  >
                    <span className="text-xs font-bold text-cyan-400 font-mono group-hover:text-white">{sc.cmd}</span>
                    <span className="text-[9px] text-gray-400 leading-tight">{sc.desc}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="max-w-4xl mx-auto relative">
            <div className="relative flex items-center bg-black/80 rounded-2xl border border-white/10 focus-within:border-cyan-400/60 p-2 transition-all shadow-2xl">
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-cyan-400 hover:text-white transition-colors"
                title="Attach desktop file"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type / for Slash Commands, drag & drop files here, or ask any question..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-600 focus:outline-none font-mono px-2"
              />

              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="p-3 rounded-xl transition-all active:scale-95 disabled:opacity-30 shadow-lg flex items-center justify-center font-bold text-black"
                style={{ backgroundColor: theme.primary }}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* CLAUDE FEATURE: PROJECT KNOWLEDGE BASE MODAL */}
      <AnimatePresence>
        {showProjectModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0d0d1e] border border-purple-500/30 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Claude Project Knowledge Base</h3>
                </div>
                <button onClick={() => setShowProjectModal(false)} className="text-xs text-gray-400 hover:text-white font-bold">✕ CLOSE</button>
              </div>

              <div className="space-y-3 text-xs text-gray-300">
                <p>Upload or link custom guidelines, API docs, or rules to your 200K Context Window:</p>
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                  <div className="text-[10px] font-bold text-purple-400 uppercase">Active Project Instructions</div>
                  <textarea
                    rows={4}
                    defaultValue="Always use TypeScript, Tailwind CSS, and FastAPI backend. Enforce AST security scanning and zero scope creep."
                    className="w-full bg-transparent border border-white/10 rounded-xl p-3 text-xs text-white focus:border-purple-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    setShowProjectModal(false);
                    playSciFiSound("success");
                  }}
                  className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-black font-bold text-xs transition-all shadow-lg"
                >
                  Save Knowledge Base
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FIRST-TIME SETUP & SETTINGS WIZARD MODAL */}
      <AnimatePresence>
        {showSetupWizard && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6 select-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#090918] border border-cyan-500/40 rounded-3xl max-w-2xl w-full p-8 space-y-6 shadow-[0_0_50px_rgba(0,240,255,0.2)] relative overflow-hidden"
            >
              {/* Wizard Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 font-black text-lg">
                    ⚡
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white uppercase italic tracking-wider">Welcome to IP Codemaker Agent</h2>
                    <p className="text-xs text-cyan-400 font-mono">First-Time Setup & API Keys Configuration</p>
                  </div>
                </div>
                <button onClick={() => setShowSetupWizard(false)} className="text-xs text-gray-500 hover:text-white font-bold">✕ CLOSE</button>
              </div>

              {/* Wizard Form */}
              <div className="space-y-4 custom-scrollbar max-h-[60vh] overflow-y-auto pr-2">
                
                {/* Step 1: User Profile */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                    <User className="w-4 h-4" /> 1. Operator Profile
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Your Name / Operator Call-sign</label>
                    <input
                      type="text"
                      value={userSettings.operatorName}
                      onChange={e => setUserSettings({ ...userSettings, operatorName: e.target.value })}
                      placeholder="e.g. Pratik"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Step 2: API Keys */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <div className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                    <Key className="w-4 h-4" /> 2. AI Model API Keys (Optional)
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1">NVIDIA NIM API Key</label>
                      <input
                        type="password"
                        value={userSettings.nvidiaKey}
                        onChange={e => setUserSettings({ ...userSettings, nvidiaKey: e.target.value })}
                        placeholder="nvapi-..."
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:border-purple-400 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1">OpenAI API Key</label>
                      <input
                        type="password"
                        value={userSettings.openaiKey}
                        onChange={e => setUserSettings({ ...userSettings, openaiKey: e.target.value })}
                        placeholder="sk-..."
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:border-purple-400 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1">Anthropic Claude API Key</label>
                      <input
                        type="password"
                        value={userSettings.anthropicKey}
                        onChange={e => setUserSettings({ ...userSettings, anthropicKey: e.target.value })}
                        placeholder="sk-ant-..."
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:border-purple-400 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1">Google Gemini API Key</label>
                      <input
                        type="password"
                        value={userSettings.geminiKey}
                        onChange={e => setUserSettings({ ...userSettings, geminiKey: e.target.value })}
                        placeholder="AIza..."
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:border-purple-400 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 3: Local GPU Endpoint */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <CpuIcon className="w-4 h-4" /> 3. Local Ollama GPU Engine
                  </div>
                  <input
                    type="text"
                    value={userSettings.ollamaUrl}
                    onChange={e => setUserSettings({ ...userSettings, ollamaUrl: e.target.value })}
                    placeholder="http://localhost:11434"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:border-emerald-400 focus:outline-none font-mono"
                  />
                </div>

              </div>

              {/* Wizard Footer */}
              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                <span className="text-[10px] text-gray-500 font-mono">Settings are encrypted and saved locally.</span>
                <button
                  onClick={handleSaveSetupWizard}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete Setup & Launch</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
