from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
import os
import sys
import io
import json
import zipfile
import tempfile
import requests
from contextlib import redirect_stdout
from fastapi.middleware.cors import CORSMiddleware

try:
    from src.main import main as run_engine
    from src.query_engine import QueryEnginePort
    ENGINE_AVAILABLE = True
except ImportError as e:
    print(f"[CRITICAL] Backend Discovery Failed: {e}")
    ENGINE_AVAILABLE = False

app = FastAPI(
    title="IP Codemaker Agent | Ultimate Generative AI API Suite",
    description="Multi-Model Autonomous Agent & Generative Code Synthesis Engine for IP Verse",
    version="3.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class CommandRequest(BaseModel):
    command: str

class SaveFileRequest(BaseModel):
    filePath: str
    content: str

class ExportProjectRequest(BaseModel):
    projectType: str  # 'full_workspace' | 'react_vite' | 'fastapi_app' | 'jarvis_voice'

class SettingsRequest(BaseModel):
    operatorName: str = "Operator"
    openaiKey: str = ""
    anthropicKey: str = ""
    geminiKey: str = ""
    nvidiaKey: str = ""
    ollamaUrl: str = "http://localhost:11434"

class GenerateRequest(BaseModel):
    prompt: str
    model: str = "ip_agent_001_v3"
    type: str = "code"
    temperature: float = 0.4

class OpenAIChatRequest(BaseModel):
    messages: list
    model: str = "ip_agent_001"
    temperature: float = 0.5
    max_tokens: int = 1024

SETTINGS_FILE = "user_settings.json"

@app.get("/api/status")
async def get_status():
    ollama_active = False
    models = []
    try:
        r = requests.get("http://localhost:11434/api/tags", timeout=1)
        if r.status_code == 200:
            ollama_active = True
            models = [m['name'] for m in r.json().get('models', [])]
    except Exception:
        pass

    user_settings = {}
    if os.path.exists(SETTINGS_FILE):
        try:
            with open(SETTINGS_FILE, "r") as f:
                user_settings = json.load(f)
        except Exception:
            pass

    return {
        "status": "online",
        "model": "ip_agent_001_v3_Ultimate",
        "engine": "active" if ENGINE_AVAILABLE else "error",
        "health": "Synchronized",
        "api_suite": "v3.0.0 (OpenAI Compatible)",
        "settings": user_settings,
        "ollama": {
            "active": ollama_active,
            "models": models
        }
    }

@app.post("/api/save_settings")
async def save_settings(req: SettingsRequest):
    try:
        data = req.model_dump() if hasattr(req, 'model_dump') else req.dict()
        with open(SETTINGS_FILE, "w") as f:
            json.dump(data, f, indent=2)
        return {"success": True, "message": "Settings saved successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/execute")
async def execute_command(req: CommandRequest):
    if not ENGINE_AVAILABLE:
        return {"output": "Neural engine failed to load. Please check root directory.", "error": True}

    try:
        f = io.StringIO()
        with redirect_stdout(f):
            run_engine(["oneshot", req.command])
        
        output = f.getvalue().strip()
        return {"output": output, "error": False}
    except Exception as e:
        return {"output": f"Runtime error: {str(e)}", "error": True}

@app.post("/api/generate")
async def generate_ai(req: GenerateRequest):
    try:
        f = io.StringIO()
        with redirect_stdout(f):
            run_engine(["oneshot", req.prompt])
        output = f.getvalue().strip()
        return {
            "status": "success",
            "model": req.model,
            "prompt": req.prompt,
            "type": req.type,
            "result": output
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}

@app.post("/v1/chat/completions")
async def openai_compatible_chat(req: OpenAIChatRequest):
    user_prompt = ""
    for msg in req.messages:
        if msg.get("role") == "user":
            user_prompt = msg.get("content", "")

    try:
        f = io.StringIO()
        with redirect_stdout(f):
            run_engine(["oneshot", user_prompt or "hello"])
        output = f.getvalue().strip()

        return {
            "id": f"chatcmpl-{os.urandom(6).hex()}",
            "object": "chat.completion",
            "created": 1720000000,
            "model": req.model,
            "choices": [
                {
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": output
                    },
                    "finish_reason": "stop"
                }
            ],
            "usage": {
                "prompt_tokens": len(user_prompt.split()),
                "completion_tokens": len(output.split()),
                "total_tokens": len(user_prompt.split()) + len(output.split())
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/workspace_tree")
async def get_workspace_tree():
    try:
        file_tree = []
        for root, dirs, filenames in os.walk("."):
            dirs[:] = [d for d in dirs if d not in [".git", "node_modules", ".claw", "dist", "build", "__pycache__"]]
            for f in filenames:
                rel_path = os.path.relpath(os.path.join(root, f), ".")
                file_tree.append({
                    "path": rel_path.replace("\\", "/"),
                    "name": f,
                    "size": os.path.getsize(os.path.join(root, f))
                })
        return {"files": file_tree[:100]}
    except Exception as e:
        return {"error": str(e), "files": []}

@app.post("/api/save_file")
async def save_file(req: SaveFileRequest):
    try:
        target_path = os.path.abspath(req.filePath)
        os.makedirs(os.path.dirname(target_path), exist_ok=True)
        with open(target_path, "w", encoding="utf-8") as f:
            f.write(req.content)
        return {"success": True, "message": f"Successfully saved to {req.filePath}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload_file")
async def upload_file(file: UploadFile = File(...), targetDir: str = Form("uploads")):
    try:
        os.makedirs(targetDir, exist_ok=True)
        save_path = os.path.join(targetDir, file.filename)
        
        contents = await file.read()
        with open(save_path, "wb") as f:
            f.write(contents)
            
        return {
            "success": True,
            "filename": file.filename,
            "path": save_path.replace("\\", "/"),
            "size": len(contents),
            "message": f"File '{file.filename}' uploaded successfully to workspace!"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- REAL-TIME LIVE WORKSPACE ZIP EXPORTER ---
@app.post("/api/export_project")
async def export_project(req: ExportProjectRequest):
    """Zips the REAL-TIME LIVE WORKSPACE DIRECTORY or starter templates!"""
    temp_dir = tempfile.mkdtemp()
    zip_filename = f"{req.projectType}_live_export.zip"
    zip_path = os.path.join(temp_dir, zip_filename)

    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        if req.projectType in ["full_workspace", "realtime", "live_code"]:
            # Real-time recursive zip of current live disk files!
            for root, dirs, files in os.walk("."):
                dirs[:] = [d for d in dirs if d not in [".git", "node_modules", ".claw", "dist", "build", "__pycache__"]]
                for f in files:
                    full_p = os.path.join(root, f)
                    rel_p = os.path.relpath(full_p, ".")
                    if not rel_p.endswith(".zip") and not rel_p.startswith("tmp"):
                        try:
                            zipf.write(full_p, rel_p)
                        except Exception:
                            pass
        else:
            # Starter kits
            files_to_zip = {}
            if req.projectType == "react_vite":
                files_to_zip = {
                    "package.json": '{\n  "name": "react-app",\n  "private": true,\n  "version": "1.0.0",\n  "scripts": { "dev": "vite", "build": "vite build" },\n  "dependencies": { "react": "^18.3.1", "react-dom": "^18.3.1", "lucide-react": "^0.400.0" },\n  "devDependencies": { "@vitejs/plugin-react": "^4.3.1", "autoprefixer": "^10.4.19", "postcss": "^8.4.38", "tailwindcss": "^3.4.4", "vite": "^5.3.1" }\n}',
                    "src/App.jsx": 'import React from "react";\nimport { Sparkles } from "lucide-react";\n\nexport default function App() {\n  return (\n    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center font-sans">\n      <h1 className="text-4xl font-bold flex items-center gap-3 text-cyan-400">\n        <Sparkles /> IP Verse React Starter\n      </h1>\n    </div>\n  );\n}',
                    "src/main.jsx": 'import React from "react";\nimport ReactDOM from "react-dom/client";\nimport App from "./App";\n\nReactDOM.createRoot(document.getElementById("root")).render(<App />);',
                    "index.html": '<!DOCTYPE html>\n<html lang="en">\n<head><title>React App</title></head>\n<body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body>\n</html>',
                    "README.md": "# React Vite Starter Kit\n\nRun `npm install` and `npm run dev` to launch!"
                }
            elif req.projectType == "fastapi_app":
                files_to_zip = {
                    "main.py": 'from fastapi import FastAPI\nimport uvicorn\n\napp = FastAPI(title="IP Verse API")\n\n@app.get("/")\ndef read_root():\n    return {"status": "ONLINE", "message": "FastAPI Server Ready"}\n\nif __name__ == "__main__":\n    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)',
                    "requirements.txt": "fastapi>=0.111.0\nuvicorn>=0.30.0\npydantic>=2.7.0\n",
                    "README.md": "# FastAPI Starter Kit\n\nRun `pip install -r requirements.txt` and `python main.py`!"
                }
            else:  # jarvis_voice
                files_to_zip = {
                    "jarvis.py": 'import speech_recognition as sr\nimport pyttsx3\nimport datetime\n\nengine = pyttsx3.init("sapi5")\nengine.setProperty("rate", 180)\n\ndef speak(text):\n    print(f"JARVIS: {text}")\n    engine.say(text)\n    engine.runAndWait()\n\nif __name__ == "__main__":\n    speak("Jarvis Voice System Online, Boss.")',
                    "requirements.txt": "pyttsx3\nSpeechRecognition\npyaudio\n",
                    "README.md": "# Jarvis Voice Assistant Kit\n\nRun `pip install -r requirements.txt` and `python jarvis.py`!"
                }

            for filepath, content in files_to_zip.items():
                zipf.writestr(filepath, content)

    return FileResponse(zip_path, filename=zip_filename, media_type="application/zip")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
