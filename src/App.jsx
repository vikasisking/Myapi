import { useState } from "react";

const API_BASE = "https://api-production-a4c9.up.railway.app";
const API_KEY_DEMO = "h2ihub";
const ENDPOINTS = [
  {
    id: "get_sms",
    method: "GET",
    path: "/api/sms",
    title: "Get SMS Messages",
    description: "Real-time SMS data — saare sources ka merged, deduplicated data ek hi call me.",
    params: [
      { name: "key", type: "string", required: true, desc: "Aapka API key (admin se lo)" },
      { name: "num", type: "string", required: false, desc: "Phone number se filter karo (partial match supported)" },
      { name: "limit", type: "integer", required: false, desc: "Max records return karo (default: 500)" },
    ],
    example_url: `${API_BASE}/api/sms?key=${API_KEY_DEMO}&limit=10`,
    example_response: `{
  "status": "success",
  "count": 2,
  "ts": "2025-06-26 14:30:00",
  "data": [
    {
      "dt": "2025-06-26 14:29:55",
      "num": "919876543210",
      "cli": "AMAZON",
      "message": "Your OTP is 482910"
    },
    {
      "dt": "2025-06-26 14:29:48",
      "num": "628123456789",
      "cli": "SHOPPE",
      "message": "Kode OTP kamu: 773421"
    }
  ]
}`,
    example_python: `import requests

url = "${API_BASE}/api/sms"
params = {
    "key": "${API_KEY_DEMO}",
    "limit": 50
}

resp = requests.get(url, params=params, timeout=10)
data = resp.json()

if data["status"] == "success":
    for sms in data["data"]:
        print(f"{sms['num']} — {sms['message']}")`,
    example_node: `const axios = require('axios');

const res = await axios.get('${API_BASE}/api/sms', {
  params: {
    key: '${API_KEY_DEMO}',
    limit: 50
  }
});

const { data } = res.data;
data.forEach(sms => {
  console.log(\`\${sms.num} — \${sms.message}\`);
});`,
    example_curl: `curl "${API_BASE}/api/sms?key=${API_KEY_DEMO}&limit=10"`,
  },
  {
    id: "filter_number",
    method: "GET",
    path: "/api/sms?num=9198",
    title: "Filter by Phone Number",
    description: "Specific number ka SMS dhundo — partial match bhi kaam karta hai.",
    params: [
      { name: "key", type: "string", required: true, desc: "API key" },
      { name: "num", type: "string", required: true, desc: "Number ya partial number (e.g. 9198 se sab 9198xxxxxxx milenge)" },
    ],
    example_url: `${API_BASE}/api/sms?key=${API_KEY_DEMO}&num=919876543210`,
    example_response: `{
  "status": "success",
  "count": 1,
  "ts": "2025-06-26 14:30:00",
  "data": [
    {
      "dt": "2025-06-26 14:29:55",
      "num": "919876543210",
      "cli": "AMAZON",
      "message": "Your OTP is 482910. Do not share."
    }
  ]
}`,
    example_python: `import requests

number = "919876543210"
resp = requests.get("${API_BASE}/api/sms", params={
    "key": "${API_KEY_DEMO}",
    "num": number
})
data = resp.json()
if data["count"] > 0:
    print("SMS mila:", data["data"][0]["message"])
else:
    print("Koi SMS nahi")`,
    example_node: `const res = await axios.get('${API_BASE}/api/sms', {
  params: { key: '${API_KEY_DEMO}', num: '919876543210' }
});
if (res.data.count > 0) {
  console.log('SMS:', res.data.data[0].message);
}`,
    example_curl: `curl "${API_BASE}/api/sms?key=${API_KEY_DEMO}&num=919876543210"`,
  },
  {
    id: "status",
    method: "GET",
    path: "/api/status",
    title: "API Status",
    description: "API server ka live status — uptime aur total records check karo.",
    params: [
      { name: "key", type: "string", required: true, desc: "API key" },
    ],
    example_url: `${API_BASE}/api/status?key=${API_KEY_DEMO}`,
    example_response: `{
  "status": "ok",
  "uptime": "running",
  "ts": "2025-06-26 14:30:00"
}`,
    example_python: `import requests

resp = requests.get("${API_BASE}/api/status", params={"key": "${API_KEY_DEMO}"})
print(resp.json())`,
    example_node: `const res = await axios.get('${API_BASE}/api/status', {
  params: { key: '${API_KEY_DEMO}' }
});
console.log(res.data);`,
    example_curl: `curl "${API_BASE}/api/status?key=${API_KEY_DEMO}"`,
  },
];

const LANG_TABS = ["curl", "python", "node"];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} style={{
      position:"absolute", top:10, right:10,
      background: copied ? "#22c55e22" : "#ffffff14",
      border: `1px solid ${copied ? "#22c55e55" : "#ffffff22"}`,
      color: copied ? "#22c55e" : "#94a3b8",
      borderRadius:6, padding:"3px 10px", fontSize:11,
      cursor:"pointer", fontFamily:"monospace", transition:"all 0.2s"
    }}>
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

function CodeBlock({ code }) {
  return (
    <div style={{ position:"relative", marginTop:8 }}>
      <pre style={{
        background:"#0d1117", border:"1px solid #ffffff12",
        borderRadius:8, padding:"14px 16px", margin:0,
        fontSize:12.5, lineHeight:1.7, color:"#e2e8f0",
        overflowX:"auto", fontFamily:"'JetBrains Mono','Fira Code',monospace"
      }}><code>{code}</code></pre>
      <CopyButton text={code} />
    </div>
  );
}

function ParamTable({ params }) {
  if (!params.length) return <p style={{color:"#64748b",fontSize:13}}>No parameters required.</p>;
  return (
    <table style={{width:"100%", borderCollapse:"collapse", fontSize:13, marginTop:8}}>
      <thead>
        <tr>
          {["Param","Type","Required","Description"].map(h => (
            <th key={h} style={{textAlign:"left", padding:"7px 10px", color:"#64748b",
              borderBottom:"1px solid #ffffff10", fontWeight:500, fontSize:11, letterSpacing:"0.05em"}}>
              {h.toUpperCase()}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {params.map(p => (
          <tr key={p.name} style={{borderBottom:"1px solid #ffffff08"}}>
            <td style={{padding:"8px 10px"}}>
              <code style={{color:"#7dd3fc", background:"#7dd3fc11", padding:"2px 7px", borderRadius:4, fontSize:12}}>
                {p.name}
              </code>
            </td>
            <td style={{padding:"8px 10px", color:"#a78bfa"}}>{p.type}</td>
            <td style={{padding:"8px 10px"}}>
              <span style={{
                background: p.required ? "#ef444420" : "#64748b20",
                color: p.required ? "#f87171" : "#64748b",
                borderRadius:4, padding:"1px 7px", fontSize:11
              }}>
                {p.required ? "required" : "optional"}
              </span>
            </td>
            <td style={{padding:"8px 10px", color:"#94a3b8"}}>{p.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function EndpointCard({ ep }) {
  const [lang, setLang] = useState("curl");
  const [open, setOpen] = useState(false);

  const codeMap = {
    curl: ep.example_curl,
    python: ep.example_python,
    node: ep.example_node,
  };

  return (
    <div style={{
      background:"#111827", border:"1px solid #ffffff10",
      borderRadius:12, marginBottom:16, overflow:"hidden"
    }}>
      <div onClick={() => setOpen(!open)} style={{
        display:"flex", alignItems:"center", gap:12,
        padding:"14px 20px", cursor:"pointer",
        background: open ? "#1f2937" : "transparent",
        transition:"background 0.2s"
      }}>
        <span style={{
          background:"#22c55e20", color:"#22c55e",
          border:"1px solid #22c55e44",
          borderRadius:5, padding:"2px 9px", fontSize:11,
          fontWeight:700, fontFamily:"monospace", flexShrink:0
        }}>GET</span>
        <code style={{color:"#7dd3fc", fontSize:13, flexGrow:1}}>{ep.path}</code>
        <span style={{color:"#e2e8f0", fontWeight:600, fontSize:14, flexGrow:2}}>{ep.title}</span>
        <span style={{color:"#475569", fontSize:18}}>{open ? "▾" : "▸"}</span>
      </div>

      {open && (
        <div style={{padding:"0 20px 20px"}}>
          <p style={{color:"#94a3b8", margin:"12px 0 16px", fontSize:14}}>{ep.description}</p>

          <div style={{marginBottom:16}}>
            <label style={{color:"#64748b", fontSize:11, letterSpacing:"0.08em", fontWeight:600}}>EXAMPLE URL</label>
            <div style={{position:"relative", marginTop:6}}>
              <div style={{
                background:"#0d1117", border:"1px solid #ffffff12",
                borderRadius:8, padding:"10px 16px",
                fontFamily:"monospace", fontSize:12, color:"#7dd3fc",
                wordBreak:"break-all"
              }}>{ep.example_url}</div>
              <CopyButton text={ep.example_url} />
            </div>
          </div>

          <div style={{marginBottom:16}}>
            <label style={{color:"#64748b", fontSize:11, letterSpacing:"0.08em", fontWeight:600}}>PARAMETERS</label>
            <ParamTable params={ep.params} />
          </div>

          <div style={{marginBottom:16}}>
            <label style={{color:"#64748b", fontSize:11, letterSpacing:"0.08em", fontWeight:600}}>CODE EXAMPLE</label>
            <div style={{display:"flex", gap:4, marginTop:8, marginBottom:4}}>
              {LANG_TABS.map(l => (
                <button key={l} onClick={() => setLang(l)} style={{
                  background: lang===l ? "#3b82f620" : "transparent",
                  color: lang===l ? "#60a5fa" : "#475569",
                  border: `1px solid ${lang===l ? "#3b82f644" : "#ffffff10"}`,
                  borderRadius:6, padding:"4px 14px", fontSize:12,
                  cursor:"pointer", fontFamily:"monospace", transition:"all 0.15s"
                }}>{l}</button>
              ))}
            </div>
            <CodeBlock code={codeMap[lang]} />
          </div>

          <div>
            <label style={{color:"#64748b", fontSize:11, letterSpacing:"0.08em", fontWeight:600}}>EXAMPLE RESPONSE</label>
            <CodeBlock code={ep.example_response} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("overview");
  const [apiKey, setApiKey] = useState(API_KEY_DEMO);
  const [baseUrl, setBaseUrl] = useState(API_BASE);

  return (
    <div style={{
      minHeight:"100vh", background:"#0a0f1a",
      fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color:"#e2e8f0"
    }}>
      {/* Top bar */}
      <div style={{
        background:"#0d1424", borderBottom:"1px solid #ffffff0d",
        padding:"0 32px", display:"flex", alignItems:"center",
        justifyContent:"space-between", height:56, position:"sticky", top:0, zIndex:50
      }}>
        <div style={{display:"flex", alignItems:"center", gap:10}}>
          <div style={{
            width:28, height:28, borderRadius:6,
            background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:14, fontWeight:800
          }}>H</div>
          <span style={{fontWeight:700, fontSize:15, letterSpacing:"-0.01em"}}>HxOTP</span>
          <span style={{
            background:"#3b82f615", color:"#60a5fa",
            border:"1px solid #3b82f630", borderRadius:4,
            padding:"1px 8px", fontSize:11, fontWeight:600
          }}>API v1</span>
        </div>
        <div style={{display:"flex", alignItems:"center", gap:8}}>
          <div style={{width:7, height:7, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 6px #22c55e"}}/>
          <span style={{color:"#64748b", fontSize:12}}>Live</span>
        </div>
      </div>

      <div style={{display:"flex", maxWidth:1100, margin:"0 auto", padding:"0 16px"}}>
        {/* Sidebar */}
        <div style={{
          width:200, flexShrink:0, paddingTop:28,
          position:"sticky", top:56, height:"calc(100vh - 56px)", overflowY:"auto"
        }}>
          {[
            {id:"overview", label:"Overview"},
            {id:"auth", label:"Authentication"},
            {id:"endpoints", label:"Endpoints"},
            {id:"errors", label:"Errors"},
            {id:"quickstart", label:"Quick Start"},
          ].map(s => (
            <button key={s.id} onClick={() => {
              setActiveSection(s.id);
              document.getElementById(s.id)?.scrollIntoView({behavior:"smooth"});
            }} style={{
              display:"block", width:"100%", textAlign:"left",
              background:"transparent", border:"none",
              color: activeSection===s.id ? "#60a5fa" : "#64748b",
              padding:"7px 12px", borderRadius:6, cursor:"pointer",
              fontSize:13, fontWeight: activeSection===s.id ? 600 : 400,
              borderLeft: activeSection===s.id ? "2px solid #3b82f6" : "2px solid transparent",
              transition:"all 0.15s"
            }}>{s.label}</button>
          ))}
        </div>

        {/* Main content */}
        <div style={{flex:1, padding:"28px 0 28px 32px", minWidth:0}}>

          {/* OVERVIEW */}
          <section id="overview" style={{marginBottom:48}}>
            <h1 style={{fontSize:28, fontWeight:800, margin:"0 0 8px", letterSpacing:"-0.02em"}}>
              HxOTP SMS API
            </h1>
            <p style={{color:"#94a3b8", fontSize:15, lineHeight:1.7, margin:"0 0 20px"}}>
              Single REST API endpoint se real-time SMS data lo.
              Ek call me sab kuch — fast, reliable, deduplicated.
            </p>

            <div style={{
              background:"#111827", border:"1px solid #ffffff10",
              borderRadius:12, padding:20, marginBottom:24
            }}>
              <h3 style={{margin:"0 0 14px", fontSize:13, color:"#64748b", letterSpacing:"0.05em"}}>YOUR CONFIGURATION</h3>
              <div style={{display:"flex", flexDirection:"column", gap:10}}>
                <div style={{display:"flex", alignItems:"center", gap:10}}>
                  <label style={{color:"#64748b", fontSize:12, width:80, flexShrink:0}}>Base URL</label>
                  <input value={baseUrl} onChange={e => setBaseUrl(e.target.value)} style={{
                    flex:1, background:"#0d1117", border:"1px solid #ffffff14",
                    borderRadius:6, padding:"6px 12px", color:"#7dd3fc",
                    fontSize:12, fontFamily:"monospace", outline:"none"
                  }}/>
                </div>
                <div style={{display:"flex", alignItems:"center", gap:10}}>
                  <label style={{color:"#64748b", fontSize:12, width:80, flexShrink:0}}>API Key</label>
                  <input value={apiKey} onChange={e => setApiKey(e.target.value)} style={{
                    flex:1, background:"#0d1117", border:"1px solid #ffffff14",
                    borderRadius:6, padding:"6px 12px", color:"#a78bfa",
                    fontSize:12, fontFamily:"monospace", outline:"none"
                  }}/>
                </div>
              </div>
              <p style={{color:"#475569", fontSize:11, margin:"10px 0 0"}}>
                Apna API URL aur key yahan set karo — niche ke examples automatically update honge.
              </p>
            </div>

            <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12}}>
              {[
                {label:"Base URL", value:baseUrl, mono:true},
                {label:"Format", value:"JSON"},
                {label:"Auth", value:"API Key (query param)"},
              ].map(s => (
                <div key={s.label} style={{
                  background:"#111827", border:"1px solid #ffffff10",
                  borderRadius:10, padding:"14px 16px"
                }}>
                  <div style={{color:"#64748b", fontSize:11, marginBottom:5}}>{s.label}</div>
                  <div style={{
                    color: s.mono ? "#7dd3fc" : "#e2e8f0",
                    fontFamily: s.mono ? "monospace" : "inherit",
                    fontSize: s.mono ? 11 : 13, fontWeight:600,
                    wordBreak:"break-all"
                  }}>{s.value}</div>
                </div>
              ))}
            </div>
          </section>

          {/* AUTH */}
          <section id="auth" style={{marginBottom:48}}>
            <h2 style={{fontSize:20, fontWeight:700, margin:"0 0 12px", letterSpacing:"-0.01em"}}>Authentication</h2>
            <p style={{color:"#94a3b8", fontSize:14, lineHeight:1.7}}>
              Har request me{" "}
              <code style={{color:"#7dd3fc", background:"#7dd3fc11", padding:"1px 6px", borderRadius:4}}>key</code>
              {" "}query parameter required hai. Invalid key pe{" "}
              <code style={{color:"#f87171"}}>401</code> error milega.
            </p>
            <CodeBlock code={`# Correct
GET ${baseUrl}/api/sms?key=${apiKey}

# Wrong — 401 milega
GET ${baseUrl}/api/sms`} />
          </section>

          {/* ENDPOINTS */}
          <section id="endpoints" style={{marginBottom:48}}>
            <h2 style={{fontSize:20, fontWeight:700, margin:"0 0 4px", letterSpacing:"-0.01em"}}>Endpoints</h2>
            <p style={{color:"#64748b", fontSize:13, margin:"0 0 16px"}}>Click karo details ke liye</p>
            {ENDPOINTS.map(ep => <EndpointCard key={ep.id} ep={ep} />)}
          </section>

          {/* ERRORS */}
          <section id="errors" style={{marginBottom:48}}>
            <h2 style={{fontSize:20, fontWeight:700, margin:"0 0 12px", letterSpacing:"-0.01em"}}>Error Codes</h2>
            <div style={{background:"#111827", border:"1px solid #ffffff10", borderRadius:12, overflow:"hidden"}}>
              {[
                {code:"200", color:"#22c55e", msg:"success", desc:"Request successful, data milega"},
                {code:"401", color:"#f87171", msg:"error: Invalid API key", desc:"key param missing ya galat hai"},
                {code:"404", color:"#f59e0b", msg:"error: Endpoint not found", desc:"URL galat hai"},
                {code:"5xx", color:"#f87171", msg:"server error", desc:"API server down — /api/status check karo"},
              ].map((e, i) => (
                <div key={e.code} style={{
                  display:"flex", alignItems:"flex-start", gap:16,
                  padding:"13px 18px",
                  borderBottom: i < 3 ? "1px solid #ffffff08" : "none"
                }}>
                  <span style={{
                    background: e.color+"20", color:e.color,
                    border:`1px solid ${e.color}44`,
                    borderRadius:5, padding:"2px 10px", fontSize:12,
                    fontFamily:"monospace", flexShrink:0, fontWeight:700
                  }}>{e.code}</span>
                  <div>
                    <div style={{fontFamily:"monospace", fontSize:12, color:"#94a3b8", marginBottom:2}}>{e.msg}</div>
                    <div style={{fontSize:13, color:"#64748b"}}>{e.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* QUICK START */}
          <section id="quickstart" style={{marginBottom:48}}>
            <h2 style={{fontSize:20, fontWeight:700, margin:"0 0 12px", letterSpacing:"-0.01em"}}>Quick Start — Telegram Bot</h2>
            <p style={{color:"#94a3b8", fontSize:14, margin:"0 0 14px"}}>
              Minimal Python bot jo is API se real-time SMS fetch karke Telegram pe bhejta hai:
            </p>
            <CodeBlock code={`import requests, telebot, time

BOT_TOKEN  = "YOUR_BOT_TOKEN"
CHAT_ID    = 123456789
API_URL    = "${baseUrl}/api/sms"
API_KEY    = "${apiKey}"

bot  = telebot.TeleBot(BOT_TOKEN)
seen = set()

def poll():
    while True:
        try:
            r = requests.get(API_URL, params={"key": API_KEY, "limit": 100}, timeout=10)
            for sms in r.json().get("data", []):
                uid = f"{sms['dt']}_{sms['num']}_{sms['message'][:30]}"
                if uid in seen:
                    continue
                seen.add(uid)
                text = (
                    f"📩 *New SMS*\\n"
                    f"📱 \`{sms['num']}\`\\n"
                    f"📨 {sms['cli']}\\n"
                    f"💬 {sms['message']}"
                )
                bot.send_message(CHAT_ID, text, parse_mode="Markdown")
        except Exception as e:
            print(f"Error: {e}")
        time.sleep(5)

poll()`} />
          </section>

          <div style={{
            borderTop:"1px solid #ffffff08", paddingTop:20,
            color:"#334155", fontSize:12, textAlign:"center"
          }}>
            HxOTP API Docs • Internal Use Only
          </div>
        </div>
      </div>
    </div>
  );
}
