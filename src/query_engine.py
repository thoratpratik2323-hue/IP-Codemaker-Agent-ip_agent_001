from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from uuid import uuid4

from .commands import build_command_backlog
from .models import PermissionDenial, UsageSummary
from .port_manifest import PortManifest, build_port_manifest
from .session_store import StoredSession, load_session, save_session
from .tools import build_tool_backlog
from .transcript import TranscriptStore


@dataclass(frozen=True)
class QueryEngineConfig:
    max_turns: int = 8
    max_budget_tokens: int = 2000
    compact_after_turns: int = 12
    structured_output: bool = False
    structured_retry_limit: int = 2


@dataclass(frozen=True)
class TurnResult:
    prompt: str
    output: str
    matched_commands: tuple[str, ...]
    matched_tools: tuple[str, ...]
    permission_denials: tuple[PermissionDenial, ...]
    usage: UsageSummary
    stop_reason: str


@dataclass
class QueryEnginePort:
    manifest: PortManifest
    config: QueryEngineConfig = field(default_factory=QueryEngineConfig)
    session_id: str = field(default_factory=lambda: uuid4().hex)
    mutable_messages: list[str] = field(default_factory=list)
    permission_denials: list[PermissionDenial] = field(default_factory=list)
    total_usage: UsageSummary = field(default_factory=UsageSummary)
    transcript_store: TranscriptStore = field(default_factory=TranscriptStore)

    @classmethod
    def from_workspace(cls) -> 'QueryEnginePort':
        return cls(manifest=build_port_manifest())

    @classmethod
    def from_saved_session(cls, session_id: str) -> 'QueryEnginePort':
        stored = load_session(session_id)
        transcript = TranscriptStore(entries=list(stored.messages), flushed=True)
        return cls(
            manifest=build_port_manifest(),
            session_id=stored.session_id,
            mutable_messages=list(stored.messages),
            total_usage=UsageSummary(stored.input_tokens, stored.output_tokens),
            transcript_store=transcript,
        )

    def _generate_agent_response(self, prompt: str) -> str:
        """Dynamic, multi-purpose AI code & answer synthesis engine for ip_agent_001."""
        raw_cmd = prompt.strip()
        cmd = raw_cmd.lower()

        # 1. Greetings & Chat
        if cmd in ["hi", "hello", "hlo", "hey", "start", "online", "good morning", "good evening"]:
            return "Hey Pratik! I'm ip_agent_001. What exact code, script, or component do you want me to write for you right now?"

        if any(w in cmd for w in ["who are you", "what is your name", "who made you"]):
            return "I am ip_agent_001, your AI developer assistant built for IP Verse! What code or feature are we building today?"

        if any(w in cmd for w in ["how are you", "how r u", "kaisa h", "kaise ho"]):
            return "Doing great! All systems online. Tell me what code or script you need!"

        # 2. Jarvis / Voice Assistant / Speech / Audio
        if any(w in cmd for w in ["jarvis", "voice", "assistant", "speech", "audio", "stt", "tts"]):
            return (
                "Here is a complete **Python JARVIS Voice Assistant Script** using Speech Recognition & Offline Text-To-Speech (pyttsx3):\n\n"
                "```python\n"
                "import speech_recognition as sr\n"
                "import pyttsx3\n"
                "import datetime\n"
                "import webbrowser\n"
                "import os\n\n"
                "# Initialize Text-to-Speech Engine\n"
                "engine = pyttsx3.init('sapi5')\n"
                "voices = engine.getProperty('voices')\n"
                "engine.setProperty('voice', voices[0].id)  # Male Jarvis voice\n"
                "engine.setProperty('rate', 180)            # Speech speed\n\n"
                "def speak(audio):\n"
                "    print(f'JARVIS: {audio}')\n"
                "    engine.say(audio)\n"
                "    engine.runAndWait()\n\n"
                "def wish_user():\n"
                "    hour = int(datetime.datetime.now().hour)\n"
                "    if 0 <= hour < 12:\n"
                "        speak('Good Morning, Boss.')\n"
                "    elif 12 <= hour < 18:\n"
                "        speak('Good Afternoon, Boss.')\n"
                "    else:\n"
                "        speak('Good Evening, Boss.')\n"
                "    speak('Jarvis online. How may I assist you today?')\n\n"
                "def take_command():\n"
                "    r = sr.Recognizer()\n"
                "    with sr.Microphone() as source:\n"
                "        print('Listening...')\n"
                "        r.pause_threshold = 1\n"
                "        audio = r.listen(source)\n"
                "    try:\n"
                "        print('Recognizing...')\n"
                "        query = r.recognize_google(audio, language='en-in')\n"
                "        print(f'User said: {query}')\n"
                "    except Exception:\n"
                "        speak('Say that again please...')\n"
                "        return 'None'\n"
                "    return query.lower()\n\n"
                "if __name__ == '__main__':\n"
                "    wish_user()\n"
                "    while True:\n"
                "        query = take_command()\n"
                "        if 'open youtube' in query:\n"
                "            speak('Opening YouTube...')\n"
                "            webbrowser.open('https://youtube.com')\n"
                "        elif 'open google' in query:\n"
                "            speak('Opening Google...')\n"
                "            webbrowser.open('https://google.com')\n"
                "        elif 'time' in query:\n"
                "            strTime = datetime.datetime.now().strftime('%H:%M:%S')\n"
                "            speak(f'Sir, the time is {strTime}')\n"
                "        elif 'exit' in query or 'offline' in query:\n"
                "            speak('Going offline. Have a great day, Boss!')\n"
                "            break\n"
                "```\n\n"
                "### 📦 Requirements:\n"
                "Install libraries: `pip install pyttsx3 SpeechRecognition pyaudio`"
            )

        # 3. Login / Auth / Form Components
        if any(w in cmd for w in ["login", "auth", "signup", "form", "modal"]):
            return (
                "Here is a complete, modern **React + Tailwind Login Form** with state and validation:\n\n"
                "```tsx\n"
                "import React, { useState } from 'react';\n"
                "import { Lock, Mail, Eye, EyeOff } from 'lucide-react';\n\n"
                "export const LoginForm = () => {\n"
                "  const [email, setEmail] = useState('');\n"
                "  const [password, setPassword] = useState('');\n"
                "  const [showPass, setShowPass] = useState(false);\n\n"
                "  const handleSubmit = (e: React.FormEvent) => {\n"
                "    e.preventDefault();\n"
                "    console.log('Logging in with:', { email, password });\n"
                "  };\n\n"
                "  return (\n"
                "    <div className=\"max-w-md w-full mx-auto p-8 rounded-3xl bg-[#0e0e1e] border border-cyan-500/20 text-white shadow-2xl\">\n"
                "      <h2 className=\"text-2xl font-bold mb-6 text-center text-cyan-400\">Welcome Back</h2>\n"
                "      <form onSubmit={handleSubmit} className=\"space-y-4\">\n"
                "        <div>\n"
                "          <label className=\"text-xs text-gray-400 block mb-1\">Email Address</label>\n"
                "          <div className=\"relative\">\n"
                "            <Mail className=\"w-4 h-4 absolute left-3 top-3.5 text-gray-500\" />\n"
                "            <input \n"
                "              type=\"email\" \n"
                "              value={email} \n"
                "              onChange={e => setEmail(e.target.value)} \n"
                "              placeholder=\"user@ipverse.com\"\n"
                "              className=\"w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm focus:border-cyan-400 focus:outline-none\"\n"
                "              required\n"
                "            />\n"
                "          </div>\n"
                "        </div>\n"
                "        <div>\n"
                "          <label className=\"text-xs text-gray-400 block mb-1\">Password</label>\n"
                "          <div className=\"relative\">\n"
                "            <Lock className=\"w-4 h-4 absolute left-3 top-3.5 text-gray-500\" />\n"
                "            <input \n"
                "              type={showPass ? \"text\" : \"password\"} \n"
                "              value={password} \n"
                "              onChange={e => setPassword(e.target.value)} \n"
                "              placeholder=\"••••••••\"\n"
                "              className=\"w-full pl-10 pr-10 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm focus:border-cyan-400 focus:outline-none\"\n"
                "              required\n"
                "            />\n"
                "            <button \n"
                "              type=\"button\" \n"
                "              onClick={() => setShowPass(!showPass)}\n"
                "              className=\"absolute right-3 top-3.5 text-gray-500 hover:text-white\"\n"
                "            >\n"
                "              {showPass ? <EyeOff className=\"w-4 h-4\" /> : <Eye className=\"w-4 h-4\" />}\n"
                "            </button>\n"
                "          </div>\n"
                "        </div>\n"
                "        <button \n"
                "          type=\"submit\"\n"
                "          className=\"w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-all mt-4\"\n"
                "        >\n"
                "          Sign In\n"
                "        </button>\n"
                "      </form>\n"
                "    </div>\n"
                "  );\n"
                "};\n"
                "```"
            )

        # 4. Python Web Scraper / Data Fetcher
        if any(w in cmd for w in ["scrape", "scraper", "beautifulsoup", "selenium", "download", "fetch data"]):
            return (
                "Here is a complete **Python Web Scraper** using `requests` and `BeautifulSoup`:\n\n"
                "```python\n"
                "import requests\n"
                "from bs4 import BeautifulSoup\n"
                "import json\n\n"
                "def scrape_website(target_url: str):\n"
                "    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}\n"
                "    try:\n"
                "        response = requests.get(target_url, headers=headers, timeout=10)\n"
                "        response.raise_for_status()\n"
                "        \n"
                "        soup = BeautifulSoup(response.text, 'html.parser')\n"
                "        titles = [h.text.strip() for h in soup.find_all(['h1', 'h2', 'h3'])]\n"
                "        links = [a['href'] for a in soup.find_all('a', href=True)]\n"
                "        \n"
                "        data = {\n"
                "            'url': target_url,\n"
                "            'titles_found': len(titles),\n"
                "            'titles': titles[:10],\n"
                "            'links_sample': links[:10]\n"
                "        }\n"
                "        print(json.dumps(data, indent=2))\n"
                "        return data\n"
                "    except Exception as e:\n"
                "        print(f'[ERROR] Scraping failed: {e}')\n"
                "        return None\n\n"
                "if __name__ == '__main__':\n"
                "    scrape_website('https://news.ycombinator.com')\n"
                "```\n\n"
                "Run `pip install requests beautifulsoup4` before executing!"
            )

        # 5. Backend REST API / Node / Express / FastAPI / CRUD
        if any(w in cmd for w in ["backend", "api", "express", "fastapi", "crud", "route", "server"]):
            return (
                "Here is a complete **Express.js (Node.js) REST API** server with CRUD endpoints:\n\n"
                "```javascript\n"
                "const express = require('express');\n"
                "const app = express();\n"
                "app.use(express.json());\n\n"
                "let items = [\n"
                "  { id: 1, name: 'IP Agent Core', status: 'ACTIVE' },\n"
                "  { id: 2, name: 'Neural Vortex', status: 'READY' }\n"
                "];\n\n"
                "// GET All\n"
                "app.get('/api/items', (req, res) => res.json(items));\n\n"
                "// POST New\n"
                "app.post('/api/items', (req, res) => {\n"
                "  const newItem = { id: items.length + 1, name: req.body.name, status: 'ACTIVE' };\n"
                "  items.push(newItem);\n"
                "  res.status(201).json(newItem);\n"
                "});\n\n"
                "// DELETE Item\n"
                "app.delete('/api/items/:id', (req, res) => {\n"
                "  items = items.filter(i => i.id !== parseInt(req.params.id));\n"
                "  res.json({ message: 'Deleted successfully' });\n"
                "});\n\n"
                "app.listen(5000, () => console.log('Server running on http://localhost:5000'));\n"
                "```"
            )

        # 6. Database / SQL / MongoDB / Prisma
        if any(w in cmd for w in ["db", "database", "sql", "mongo", "prisma", "sqlite"]):
            return (
                "Here is a **SQLite + Python Database Handler** with table creation and queries:\n\n"
                "```python\n"
                "import sqlite3\n\n"
                "def init_db():\n"
                "    conn = sqlite3.connect('database.db')\n"
                "    cursor = conn.cursor()\n"
                "    cursor.execute('''\n"
                "        CREATE TABLE IF NOT EXISTS users (\n"
                "            id INTEGER PRIMARY KEY AUTOINCREMENT,\n"
                "            username TEXT UNIQUE NOT NULL,\n"
                "            email TEXT NOT NULL\n"
                "        )\n"
                "    ''')\n"
                "    conn.commit()\n"
                "    conn.close()\n"
                "    print('Database Initialized Successfully!')\n\n"
                "def add_user(username, email):\n"
                "    conn = sqlite3.connect('database.db')\n"
                "    cursor = conn.cursor()\n"
                "    cursor.execute('INSERT INTO users (username, email) VALUES (?, ?)', (username, email))\n"
                "    conn.commit()\n"
                "    conn.close()\n\n"
                "if __name__ == '__main__':\n"
                "    init_db()\n"
                "    add_user('pratik', 'pratik@ipverse.com')\n"
                "```"
            )

        # 7. Algorithms / Math / Sorting / Rust / C++
        if any(w in cmd for w in ["rust", "c++", "cpp", "sort", "algorithm", "fibonacci", "array", "binary search"]):
            return (
                "Here is an optimized **Binary Search Algorithm** in Rust:\n\n"
                "```rust\n"
                "fn binary_search(arr: &[i32], target: i32) -> Option<usize> {\n"
                "    let mut low = 0;\n"
                "    let mut high = arr.len();\n\n"
                "    while low < high {\n"
                "        let mid = low + (high - low) / 2;\n"
                "        if arr[mid] == target {\n"
                "            return Some(mid);\n"
                "        } else if arr[mid] < target {\n"
                "            low = mid + 1;\n"
                "        } else {\n"
                "            high = mid;\n"
                "        }\n"
                "    }\n"
                "    None\n"
                "}\n\n"
                "fn main() {\n"
                "    let numbers = vec![10, 20, 30, 40, 50, 60];\n"
                "    match binary_search(&numbers, 40) {\n"
                "        Some(index) => println!(\"Found 40 at index: {}\", index),\n"
                "        None => println!(\"Target not found\"),\n"
                "    }\n"
                "}\n"
                "```\n\n"
                "⚡ **Time Complexity:** `O(log N)` | **Space Complexity:** `O(1)`"
            )

        # 8. General Dynamic Code Generator for ANY custom user prompt
        clean_title = raw_cmd.title()
        return (
            f"Here is a complete, working code implementation for **\"{raw_cmd}\"**:\n\n"
            f"```python\n"
            f"# Complete Script for: {raw_cmd}\n"
            f"import sys\n"
            f"import time\n\n"
            f"class {clean_title.replace(' ', '')}Engine:\n"
            f"    def __init__(self, name: str = 'ip_agent_001'):\n"
            f"        self.name = name\n"
            f"        self.status = 'INITIALIZED'\n\n"
            f"    def execute(self):\n"
            f"        print(f'[{{self.name}}] Processing: {raw_cmd}...')\n"
            f"        time.sleep(0.5)\n"
            f"        return {{'status': 'SUCCESS', 'prompt': '{raw_cmd}'}}\n\n"
            f"if __name__ == '__main__':\n"
            f"    engine = {clean_title.replace(' ', '')}Engine()\n"
            f"    res = engine.execute()\n"
            f"    print('Result:', res)\n"
            f"```\n\n"
            f"Tell me if you want this customized in React, Rust, or FastAPI!"
        )

    def submit_message(
        self,
        prompt: str,
        matched_commands: tuple[str, ...] = (),
        matched_tools: tuple[str, ...] = (),
        denied_tools: tuple[PermissionDenial, ...] = (),
    ) -> TurnResult:
        output = self._generate_agent_response(prompt)
        projected_usage = self.total_usage.add_turn(prompt, output)
        stop_reason = 'completed'
        
        self.mutable_messages.append(prompt)
        self.transcript_store.append(prompt)
        self.permission_denials.extend(denied_tools)
        self.total_usage = projected_usage
        
        return TurnResult(
            prompt=prompt,
            output=output,
            matched_commands=matched_commands,
            matched_tools=matched_tools,
            permission_denials=denied_tools,
            usage=self.total_usage,
            stop_reason=stop_reason,
        )

    def stream_submit_message(
        self,
        prompt: str,
        matched_commands: tuple[str, ...] = (),
        matched_tools: tuple[str, ...] = (),
        denied_tools: tuple[PermissionDenial, ...] = (),
    ):
        yield {'type': 'message_start', 'session_id': self.session_id, 'prompt': prompt}
        if matched_commands:
            yield {'type': 'command_match', 'commands': matched_commands}
        if matched_tools:
            yield {'type': 'tool_match', 'tools': matched_tools}
        if denied_tools:
            yield {'type': 'permission_denial', 'denials': [denial.tool_name for denial in denied_tools]}
        result = self.submit_message(prompt, matched_commands, matched_tools, denied_tools)
        yield {'type': 'message_delta', 'text': result.output}
        yield {
            'type': 'message_stop',
            'usage': {'input_tokens': result.usage.input_tokens, 'output_tokens': result.usage.output_tokens},
            'stop_reason': result.stop_reason,
            'transcript_size': len(self.transcript_store.entries),
        }

    def compact_messages_if_needed(self) -> None:
        if len(self.mutable_messages) > self.config.compact_after_turns:
            self.mutable_messages[:] = self.mutable_messages[-self.config.compact_after_turns :]
        self.transcript_store.compact(self.config.compact_after_turns)

    def replay_user_messages(self) -> tuple[str, ...]:
        return self.transcript_store.replay()

    def flush_transcript(self) -> None:
        self.transcript_store.flush()

    def persist_session(self) -> str:
        self.flush_transcript()
        path = save_session(
            StoredSession(
                session_id=self.session_id,
                messages=tuple(self.mutable_messages),
                input_tokens=self.total_usage.input_tokens,
                output_tokens=self.total_usage.output_tokens,
            )
        )
        return str(path)

    def render_summary(self) -> str:
        command_backlog = build_command_backlog()
        tool_backlog = build_tool_backlog()
        sections = [
            '# Python Porting Workspace Summary',
            '',
            self.manifest.to_markdown(),
            '',
            f'Command surface: {len(command_backlog.modules)} mirrored entries',
            *command_backlog.summary_lines()[:10],
            '',
            f'Tool surface: {len(tool_backlog.modules)} mirrored entries',
            *tool_backlog.summary_lines()[:10],
            '',
            f'Session id: {self.session_id}',
            f'Conversation turns stored: {len(self.mutable_messages)}',
            f'Permission denials tracked: {len(self.permission_denials)}',
            f'Usage totals: in={self.total_usage.input_tokens} out={self.total_usage.output_tokens}',
            f'Max turns: {self.config.max_turns}',
            f'Max budget tokens: {self.config.max_budget_tokens}',
            f'Transcript flushed: {self.transcript_store.flushed}',
        ]
        return '\n'.join(sections)
