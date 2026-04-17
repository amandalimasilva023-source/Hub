import { useState, useEffect, useRef } from "react"

// ─── SUPABASE ─────────────────────────────────────────────────────────────────
const SUPA_URL = "https://okupxlvdeglixmrxrffn.supabase.co"
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rdXB4bHZkZWdsaXhtcnhyZmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTY1NDEsImV4cCI6MjA1OTc5MjU0MX0.YSPxkORpwwHej7J0FfmbrPZqgMlFLDHy6p_3sVlkXS0"

async function supa(table, query = "") {
  try {
    const res = await fetch(`${SUPA_URL}/rest/v1/${table}${query}`, {
      headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` }
    })
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch(e) {
    return []
  }
}

async function supaUpdate(table, id, data) {
  await fetch(`${SUPA_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: "PATCH",
    headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(data)
  })
}

// ─── EVOLUTION API ────────────────────────────────────────────────────────────
const EVO_URL = "https://evolution-api-production-970c.up.railway.app"
const EVO_KEY = "hub_amanda_2024_secure"

async function evo(path) {
  const res = await fetch(`${EVO_URL}${path}`, {
    headers: { apikey: EVO_KEY }
  })
  return res.json()
}

// ─── AGENTS ───────────────────────────────────────────────────────────────────
const agents = [
  { id: "reallead", slug: "reallead", numero: 1, nome: "WHATSAPP BOT (REAL LEAD)", descricao: "Bot comercial para o Real Lead via WhatsApp", status: "ativo", cor: "#3b82f6" },
  { id: "orbitsender", slug: "orbitsender", numero: 2, nome: "WHATSAPP BOT (ORBITSENDER)", descricao: "Bot comercial OrbitSender via WhatsApp", status: "ativo", cor: "#10b981" },
]

// ─── STYLES ──────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700;900&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .hub-root {
    font-family: 'Instrument Sans', system-ui, sans-serif;
    min-height: 100vh;
    width: 100%;
    max-width: 100%;
    background: hsl(220 20% 97%);
    color: hsl(222 47% 11%);
    --primary: hsl(213 80% 48%);
    --primary-fg: #fff;
    --bg: hsl(220 20% 97%);
    --fg: hsl(222 47% 11%);
    --card: hsl(0 0% 100%);
    --border: hsl(220 13% 89%);
    --muted: hsl(220 14% 95%);
    --muted-fg: hsl(220 9% 46%);
    --success: hsl(158 56% 36%);
    --warning: hsl(38 92% 48%);
    --sidebar-bg: hsl(222 48% 6%);
    --sidebar-fg: hsl(215 20% 68%);
    --sidebar-border: hsl(222 28% 14%);
    --sidebar-accent: hsl(222 38% 11%);
    --sidebar-primary: hsl(213 80% 58%);
    --radius: 6px;
  }
  .grid-bg {
    background-image: linear-gradient(rgba(0,0,0,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.035) 1px, transparent 1px);
    background-size: 32px 32px;
  }
  .glass { background: var(--card); border: 1px solid var(--border); box-shadow: 0 1px 3px rgba(0,0,0,0.05); border-radius: var(--radius); }
  .glass-hover { background: var(--card); border: 1px solid var(--border); box-shadow: 0 1px 3px rgba(0,0,0,0.05); border-radius: var(--radius); transition: box-shadow 0.2s, border-color 0.2s; cursor: pointer; }
  .glass-hover:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.09); border-color: rgba(24,113,220,0.28); }
  .bracket { position: relative; }
  .bracket::before, .bracket::after { content: ""; position: absolute; width: 13px; height: 13px; border-style: solid; border-color: transparent; transition: border-color 0.2s; z-index: 1; }
  .bracket::before { top:-1px; left:-1px; border-width: 2px 0 0 2px; }
  .bracket::after  { bottom:-1px; right:-1px; border-width: 0 2px 2px 0; }
  .bracket:hover::before, .bracket:hover::after { border-color: rgba(24,113,220,0.45); }
  .btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: var(--radius); font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid var(--border); background: var(--card); color: var(--muted-fg); transition: background 0.15s, border-color 0.15s; font-family: inherit; }
  .btn:hover { background: var(--muted); border-color: rgba(24,113,220,0.3); }
  .btn-primary { background: var(--primary); color: #fff; border-color: var(--primary); }
  .btn-primary:hover { opacity: 0.9; }
  .tag { display: inline-flex; align-items: center; gap: 3px; font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 20px; }
  .tag-wpp { background: rgba(16,185,129,0.12); color: #0d7a55; }
  .tag-gray { background: var(--muted); color: var(--muted-fg); }
  .tag-blue { background: rgba(24,113,220,0.1); color: #1060bf; }
  .tag-amber { background: rgba(245,158,11,0.12); color: #92600a; }
  .mono { font-family: 'DM Mono', monospace; }
  .nav-link { display: flex; align-items: center; gap: 8px; padding: 7px 8px; border-radius: 5px; font-size: 11px; font-weight: 600; letter-spacing: .04em; color: var(--sidebar-fg); opacity: .65; cursor: pointer; text-decoration: none; transition: opacity 0.15s, background 0.15s; background: none; border: none; font-family: inherit; }
  .nav-link:hover { opacity: 1; background: var(--sidebar-accent); }
  .nav-link.active { opacity: 1; background: var(--sidebar-accent); color: #fff; }
  .kpi { padding: 18px 20px; border-radius: var(--radius); background: var(--card); border: 1px solid var(--border); display: flex; flex-direction: column; gap: 10px; }
  table { width: 100%; border-collapse: collapse; }
  th { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: var(--muted-fg); padding: 10px 16px; text-align: left; }
  td { padding: 12px 16px; font-size: 13px; border-top: 1px solid var(--border); }
  tr:hover td { background: rgba(0,0,0,0.015); }
  input, select, textarea { font-family: inherit; font-size: 13px; background: transparent; border: none; outline: none; color: var(--fg); width: 100%; }
  select { cursor: pointer; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
  .divider { border: none; border-top: 1px solid var(--border); margin: 4px 0; }
  @keyframes fadeIn { from { opacity:0; transform: translateY(4px); } to { opacity:1; transform: translateY(0); } }
  .fade-in { animation: fadeIn 0.18s ease; }
  .status-dot { width:7px; height:7px; border-radius:50%; display:inline-block; flex-shrink:0; }
  .dot-green { background: var(--success); }
  .dot-blue  { background: var(--primary); }
  .dot-amber { background: var(--warning); }
  .spin { animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
`

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 14, color = "currentColor", style = {} }) => {
  const paths = {
    dashboard: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    chat: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    users: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    headphones: "M3 18v-6a9 9 0 0118 0v6M3 18a1.5 1.5 0 001.5 1.5h1A1.5 1.5 0 007 18v-3a1.5 1.5 0 00-1.5-1.5H3v4.5zm18 0a1.5 1.5 0 01-1.5 1.5h-1A1.5 1.5 0 0117 18v-3a1.5 1.5 0 011.5-1.5H21v4.5z",
    phone: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    outbound: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5zM15 3h6m0 0v6m0-6l-7 7",
    logout: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
    arrow_left: "M10 19l-7-7m0 0l7-7m-7 7h18",
    bell: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
    briefcase: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    send: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8",
    trending: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    userplus: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
    search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    chevron: "M19 9l-7 7-7-7",
    clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    check: "M5 13l4 4L19 7",
    x: "M6 18L18 6M6 6l12 12",
    refresh: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, ...style }}>
      <path d={paths[name]} />
    </svg>
  )
}

// ─── AVATAR ───────────────────────────────────────────────────────────────────
const AVATAR_COLORS = ["#3b82f6","#10b981","#f59e0b","#8b5cf6","#ec4899","#f97316","#14b8a6","#6366f1","#ef4444"]
function initials(nome) { return (nome||"?").split(" ").map(n=>n[0]).slice(0,2).join("").toUpperCase() }
function Avatar({ nome, size=32, idx=0 }) {
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%", flexShrink:0,
      background: AVATAR_COLORS[idx % AVATAR_COLORS.length],
      display:"flex", alignItems:"center", justifyContent:"center",
      color:"#fff", fontSize:size*0.35, fontWeight:700,
    }}>{initials(nome)}</div>
  )
}

function fmtTime(ts) {
  if (!ts) return ""
  const d = new Date(ts), now = new Date(), diff = now - d
  if (diff < 60000) return "agora"
  if (diff < 3600000) return Math.floor(diff/60000)+"m"
  if (diff < 86400000) return d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})
  return d.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"})
}

function fmtDate(ts) {
  if (!ts) return ""
  const d = new Date(ts), now = new Date()
  if (d.toDateString()===now.toDateString()) return "Hoje"
  const y = new Date(now); y.setDate(y.getDate()-1)
  if (d.toDateString()===y.toDateString()) return "Ontem"
  return d.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"})
}

// ─── HUB PAGE ─────────────────────────────────────────────────────────────────
function HubPage({ onSelect }) {
  return (
    <div className="grid-bg" style={{ minHeight:"100vh", position:"relative" }}>
      <div style={{ position:"absolute", top:0, right:0, width:600, height:400, pointerEvents:"none", background:"radial-gradient(at 100% 0%, rgba(24,113,220,0.06), transparent 55%)" }} />
      <header style={{ position:"sticky", top:0, zIndex:30, display:"flex", alignItems:"center", gap:12, padding:"0 24px", minHeight:56, borderBottom:"1px solid var(--border)", background:"rgba(245,246,250,0.95)", backdropFilter:"blur(8px)" }}>
        <div style={{display:"flex",alignItems:"center",gap:10,flex:1}}>
          <div style={{ width:32, height:32, borderRadius:6, background:"var(--primary)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:900, fontSize:12, letterSpacing:1 }}>GF</div>
          <div>
            <div style={{fontSize:9,fontWeight:700,color:"var(--muted-fg)",letterSpacing:".12em",textTransform:"uppercase"}}>Hub de Atendimento</div>
            <div style={{fontSize:13,fontWeight:700,color:"var(--fg)"}}>Hub de Atendimento de Suporte</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,fontWeight:600,color:"var(--muted-fg)"}}>
            <span className="status-dot dot-green" /> SISTEMA ONLINE
          </div>
        </div>
      </header>
      <main style={{position:"relative",zIndex:10,padding:"40px 40px 64px",maxWidth:"100%",margin:"0 auto"}}>
        <p className="mono" style={{fontSize:10,letterSpacing:".12em",color:"var(--muted-fg)",marginBottom:8,textTransform:"uppercase"}}>01 / Automações Disponíveis</p>
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:32}}>
          <h1 style={{fontSize:44,fontWeight:900,letterSpacing:"-.02em",textTransform:"uppercase",lineHeight:1}}>Agentes de IA</h1>
          <span className="mono" style={{fontSize:11,color:"var(--muted-fg)",letterSpacing:".1em"}}>{agents.length} AGENTES</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
          {agents.map((agent) => (
            <button key={agent.id} onClick={() => onSelect(agent)} className="bracket glass-hover"
              style={{ position:"relative",display:"flex",flexDirection:"column",alignItems:"flex-start",gap:20,padding:20,border:"1px solid var(--border)",textAlign:"left",background:"var(--card)",transition:"all 0.2s" }}>
              <div className="mono" style={{position:"absolute",top:14,right:14,fontSize:10,color:"var(--muted-fg)"}}>{String(agent.numero).padStart(2,"0")}</div>
              <div style={{width:36,height:36,borderRadius:6,border:"1px solid var(--border)",background:"var(--muted)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--muted-fg)"}}>
                <Icon name="briefcase" size={15} />
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6,width:"100%"}}>
                <h2 style={{fontSize:16,fontWeight:900,letterSpacing:"-.01em",textTransform:"uppercase",lineHeight:1.2}}>{agent.nome}</h2>
                <p style={{fontSize:13,color:"var(--muted-fg)"}}>{agent.descricao}</p>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,fontWeight:700,color:"var(--success)",textTransform:"uppercase",letterSpacing:".08em"}}>
                <span className="status-dot dot-green" /> {agent.status}
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage({ agent }) {
  const [stats, setStats] = useState({ total:0, novos:0, convertidos:0, conversas:0 })
  const [recentes, setRecentes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [leads, convs] = await Promise.all([
        supa("leads", `?agente_slug=eq.${agent.slug}&select=*`),
        supa("conversas", `?agente_slug=eq.${agent.slug}&select=*&order=criado_em.desc&limit=5`)
      ])
      const total = leads?.length || 0
      const novos = leads?.filter(l=>l.status==="Novo").length || 0
      const convertidos = leads?.filter(l=>l.status==="Convertido").length || 0
      const conversas = convs?.length || 0
      setStats({ total, novos, convertidos, conversas })
      setRecentes(convs || [])
      setLoading(false)
    }
    load()
  }, [agent.slug])

  const taxa = stats.total > 0 ? Math.round(stats.convertidos/stats.total*100) : 0

  if (loading) return <div style={{padding:40,color:"var(--muted-fg)",display:"flex",alignItems:"center",gap:8}}><Icon name="refresh" size={14} style={{}} className="spin" /> Carregando...</div>

  return (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:20}}>
      <div>
        <h1 style={{fontSize:26,fontWeight:900}}>Dashboard</h1>
        <p style={{fontSize:13,color:"var(--muted-fg)",marginTop:2}}>Visão geral do bot — {agent.nome}</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
        {[
          {label:"Total de Leads",val:stats.total,sub:"Acumulado",icon:"users",color:"var(--primary)"},
          {label:"Novos Leads",val:stats.novos,sub:"Status: Novo",icon:"userplus",color:"var(--primary)"},
          {label:"Convertidos",val:stats.convertidos,sub:`Taxa: ${taxa}%`,icon:"trending",color:"var(--success)"},
        ].map(k=>(
          <div key={k.label} className="kpi">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <span style={{fontSize:13,fontWeight:600,color:"var(--muted-fg)"}}>{k.label}</span>
              <div style={{width:34,height:34,borderRadius:8,background:"rgba(24,113,220,0.08)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Icon name={k.icon} size={16} color={k.color} />
              </div>
            </div>
            <p style={{fontSize:38,fontWeight:900,lineHeight:1}}>{k.val}</p>
            <p style={{fontSize:11,color:"var(--muted-fg)"}}>{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="glass" style={{padding:24}}>
        <h2 style={{fontSize:15,fontWeight:700,marginBottom:20}}>Funil de Conversão</h2>
        {[{label:"01 Leads",val:stats.total,pct:100,color:"var(--fg)",opacity:.18},
          {label:"02 Convertidos",val:stats.convertidos,pct:taxa,color:"var(--success)",opacity:1}
        ].map(f=>(
          <div key={f.label} style={{marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span className="mono" style={{fontSize:10,letterSpacing:".1em",color:"var(--muted-fg)",textTransform:"uppercase"}}>{f.label}</span>
              <div style={{display:"flex",gap:12}}>
                <span style={{fontSize:13,fontWeight:700}}>{f.val}</span>
                <span style={{fontSize:12,color:"var(--muted-fg)"}}>{f.pct}%</span>
              </div>
            </div>
            <div style={{height:5,background:"var(--muted)",borderRadius:3,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${f.pct}%`,borderRadius:3,background:f.color,opacity:f.opacity,transition:"width .7s"}} />
            </div>
          </div>
        ))}
        <div style={{display:"flex",justifyContent:"space-between",borderTop:"1px solid var(--border)",paddingTop:14,marginTop:8}}>
          <span className="mono" style={{fontSize:10,color:"var(--muted-fg)",textTransform:"uppercase",letterSpacing:".1em"}}>Taxa de Conversão</span>
          <span style={{fontSize:22,fontWeight:900,color:"var(--success)"}}>{taxa}%</span>
        </div>
      </div>

      <div className="glass" style={{padding:24}}>
        <h2 style={{fontSize:15,fontWeight:700,marginBottom:16}}>Conversas Recentes</h2>
        {recentes.length === 0 ? (
          <p style={{fontSize:13,color:"var(--muted-fg)"}}>Nenhuma conversa ainda</p>
        ) : recentes.map((c,i)=>(
          <div key={c.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderTop:i>0?"1px solid var(--border)":undefined}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:34,height:34,borderRadius:"50%",background:"rgba(24,113,220,0.08)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Icon name="chat" size={14} color="var(--primary)" />
              </div>
              <div>
                <p style={{fontSize:13,fontWeight:600}}>{c.nome_contato||c.whatsapp}</p>
                <p style={{fontSize:11,color:"var(--muted-fg)",display:"flex",alignItems:"center",gap:4}}>
                  <Icon name="phone" size={10} color="var(--muted-fg)" /> {c.whatsapp}
                </p>
              </div>
            </div>
            <span style={{fontSize:11,color:"var(--muted-fg)"}}>{fmtTime(c.criado_em)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── CONVERSAS PAGE ───────────────────────────────────────────────────────────
function ConversasPage({ agent }) {
  const [tabAtiva, setTabAtiva] = useState("Todas")
  const [busca, setBusca] = useState("")
  const [convs, setConvs] = useState([])
  const [sel, setSel] = useState(null)
  const [msgs, setMsgs] = useState([])
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const msgsRef = useRef(null)
  const TABS = ["Todas","Ativas","Aguardando","Convertidas"]

  useEffect(() => {
    supa("conversas", `?agente_slug=eq.${agent.slug}&select=*&order=criado_em.desc`)
      .then(d => setConvs(d || []))
  }, [agent.slug])

  useEffect(() => {
    if (!sel) return
    setLoadingMsgs(true)
    supa("mensagens", `?conversa_id=eq.${sel.id}&order=criado_em.asc`)
      .then(d => { setMsgs(d || []); setLoadingMsgs(false) })
  }, [sel])

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight
  }, [msgs])

  const filtradas = convs.filter(c => {
    const mb = (c.nome_contato||c.whatsapp||"").toLowerCase().includes(busca.toLowerCase())
    if(tabAtiva==="Ativas") return mb && c.status==="ativa"
    if(tabAtiva==="Aguardando") return mb && c.status==="aguardando"
    if(tabAtiva==="Convertidas") return mb && c.status==="convertida"
    return mb
  })

  const counts = {
    Todas: convs.length,
    Ativas: convs.filter(c=>c.status==="ativa").length,
    Aguardando: convs.filter(c=>c.status==="aguardando").length,
    Convertidas: convs.filter(c=>c.status==="convertida").length,
  }

  return (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:36,height:36,borderRadius:6,background:"rgba(24,113,220,0.08)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Icon name="chat" size={17} color="var(--primary)" />
        </div>
        <div>
          <h1 style={{fontSize:22,fontWeight:900}}>Conversas</h1>
          <p style={{fontSize:12,color:"var(--muted-fg)"}}>Mensagens recebidas em tempo real</p>
        </div>
      </div>

      <div className="glass" style={{display:"flex",overflow:"hidden",height:"calc(100vh - 200px)"}}>
        {/* Lista */}
        <div style={{width:270,flexShrink:0,borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column"}}>
          <div style={{padding:"10px 12px",borderBottom:"1px solid var(--border)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:6,background:"var(--muted)",color:"var(--muted-fg)"}}>
              <Icon name="search" size={13} />
              <input placeholder="Buscar..." value={busca} onChange={e=>setBusca(e.target.value)} />
            </div>
          </div>
          <div style={{display:"flex",gap:4,padding:"8px 12px 4px",flexWrap:"wrap"}}>
            {TABS.map(tab=>(
              <button key={tab} onClick={()=>setTabAtiva(tab)}
                style={{fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:20,border:"none",cursor:"pointer",fontFamily:"inherit",
                  background:tabAtiva===tab?"var(--primary)":"var(--muted)",
                  color:tabAtiva===tab?"#fff":"var(--muted-fg)"}}>
                {tab} {counts[tab]>0&&`(${counts[tab]})`}
              </button>
            ))}
          </div>
          <p style={{fontSize:10,color:"var(--muted-fg)",padding:"4px 12px 6px"}}>{filtradas.length} conversas</p>
          <div style={{flex:1,overflowY:"auto"}}>
            {filtradas.map((c,i)=>(
              <div key={c.id} onClick={()=>setSel(c)}
                style={{padding:"10px 12px",cursor:"pointer",borderBottom:"1px solid var(--border)",
                  background:sel?.id===c.id?"rgba(24,113,220,0.04)":undefined,
                  borderLeft:sel?.id===c.id?"2px solid var(--primary)":"2px solid transparent",
                  transition:"background .15s"}}>
                <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                  <Avatar nome={c.nome_contato||c.whatsapp||"?"} size={34} idx={i} />
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <p style={{fontSize:12,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:130}}>{c.nome_contato||c.whatsapp||"Desconhecido"}</p>
                      <span style={{fontSize:10,color:"var(--muted-fg)",flexShrink:0,marginLeft:4}}>{fmtTime(c.criado_em)}</span>
                    </div>
                    <p style={{fontSize:11,color:"var(--muted-fg)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginTop:2,fontStyle:"italic"}}>{c.resumo||c.whatsapp||""}</p>
                    <div style={{display:"flex",gap:4,marginTop:5}}>
                      <span className="tag tag-wpp"><Icon name="phone" size={9} /> WhatsApp</span>
                      <span className="tag tag-gray">{c.status||"ativa"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div style={{flex:1,display:"flex",flexDirection:"column"}}>
          {sel ? (
            <>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 18px",borderBottom:"1px solid var(--border)"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <Avatar nome={sel.nome_contato||sel.whatsapp||"?"} size={34} idx={filtradas.findIndex(c=>c.id===sel.id)} />
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <p style={{fontSize:13,fontWeight:700}}>{sel.nome_contato||sel.whatsapp}</p>
                      <span className="tag tag-wpp"><Icon name="phone" size={9} /> WhatsApp</span>
                    </div>
                    <p style={{fontSize:11,color:"var(--muted-fg)"}}>{sel.whatsapp}</p>
                  </div>
                </div>
                <button className="btn" onClick={()=>window.open(`https://wa.me/${sel.whatsapp}`,"_blank")}>
                  <Icon name="outbound" size={13} /> Abrir WhatsApp
                </button>
              </div>
              <div ref={msgsRef} style={{flex:1,overflowY:"auto",padding:"16px 18px",display:"flex",flexDirection:"column",gap:10}}>
                {loadingMsgs ? (
                  <div style={{textAlign:"center",color:"var(--muted-fg)",fontSize:12,marginTop:40}}>Carregando mensagens...</div>
                ) : msgs.length===0 ? (
                  <div style={{textAlign:"center",color:"var(--muted-fg)",fontSize:12,marginTop:40}}>Nenhuma mensagem ainda</div>
                ) : msgs.map(msg=>(
                  <div key={msg.id} style={{display:"flex",flexDirection:"column",alignItems:msg.bot?"flex-end":"flex-start"}}>
                    {msg.bot ? (
                      <div style={{maxWidth:"70%",background:"var(--primary)",color:"#fff",borderRadius:"14px 14px 4px 14px",padding:"8px 14px",fontSize:13}}>
                        <p style={{whiteSpace:"pre-wrap"}}>{msg.texto}</p>
                        <p style={{fontSize:10,opacity:.6,marginTop:4,textAlign:"right"}}>{new Date(msg.criado_em).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</p>
                      </div>
                    ) : (
                      <div style={{maxWidth:"70%"}}>
                        <div style={{background:"var(--muted)",borderRadius:"14px 14px 14px 4px",padding:"8px 14px",fontSize:13}}>
                          <p style={{whiteSpace:"pre-wrap"}}>{msg.texto==="[mídia]"?"📎 Mídia recebida":msg.texto}</p>
                        </div>
                        <p style={{fontSize:10,color:"var(--muted-fg)",marginTop:3,marginLeft:4}}>{new Date(msg.criado_em).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,color:"var(--muted-fg)"}}>
              <Icon name="chat" size={36} color="var(--muted-fg)" />
              <p style={{fontSize:15,fontWeight:700,color:"var(--fg)"}}>Selecione uma conversa</p>
              <p style={{fontSize:13}}>Escolha uma conversa à esquerda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── LEADS PAGE ───────────────────────────────────────────────────────────────
function LeadsPage({ agent }) {
  const [filtro, setFiltro] = useState("Todos")
  const [leads, setLeads] = useState([])
  const [openStatus, setOpenStatus] = useState(null)
  const STATUS_OPTIONS = ["Novo","Contato feito","Qualificado","Convertido","Perdido"]

  useEffect(() => {
    supa("leads", `?agente_slug=eq.${agent.slug}&select=*&order=criado_em.desc`)
      .then(d => setLeads(d || []))
  }, [agent.slug])

  const filtrados = filtro==="Todos" ? leads : filtro==="outbound" ? leads.filter(l=>l.origem==="outbound") : leads.filter(l=>l.origem==="WhatsApp")

  const setStatus = async (id, status) => {
    setLeads(prev=>prev.map(l=>l.id===id?{...l,status}:l))
    await supaUpdate("leads", id, { status })
    setOpenStatus(null)
  }

  const statusColor = s => {
    if(s==="Convertido") return "#0d7a55"
    if(s==="Perdido") return "#b91c1c"
    if(s==="Qualificado") return "#92600a"
    return "var(--muted-fg)"
  }

  const fmtData = ts => ts ? new Date(ts).toLocaleDateString("pt-BR") : "—"

  return (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:36,height:36,borderRadius:6,background:"rgba(24,113,220,0.08)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Icon name="users" size={17} color="var(--primary)" />
          </div>
          <div>
            <h1 style={{fontSize:22,fontWeight:900}}>Leads</h1>
            <p style={{fontSize:12,color:"var(--muted-fg)"}}>{filtrados.length} leads encontrados</p>
          </div>
        </div>
        <div style={{position:"relative"}}>
          <select value={filtro} onChange={e=>setFiltro(e.target.value)}
            style={{appearance:"none",WebkitAppearance:"none",padding:"7px 32px 7px 12px",border:"1px solid var(--border)",borderRadius:6,background:"var(--card)",fontSize:12,fontWeight:600,color:"var(--fg)",cursor:"pointer"}}>
            <option>Todos</option><option>outbound</option><option>WhatsApp</option>
          </select>
          <Icon name="chevron" size={12} color="var(--muted-fg)" style={{position:"absolute",right:8,top:9,pointerEvents:"none"}} />
        </div>
      </div>

      <div className="glass" style={{overflow:"hidden"}}>
        <table>
          <thead style={{background:"rgba(0,0,0,0.02)"}}>
            <tr><th>Nome</th><th>Origem</th><th>WhatsApp</th><th>Data</th><th>Status</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {filtrados.map((lead)=>(
              <tr key={lead.id}>
                <td style={{fontWeight:600}}>{lead.nome}</td>
                <td>{lead.origem==="WhatsApp"?<span className="tag tag-wpp"><Icon name="phone" size={9} /> WhatsApp</span>:<span style={{fontSize:12,color:"var(--muted-fg)"}}>{lead.origem}</span>}</td>
                <td style={{color:"var(--muted-fg)",display:"flex",alignItems:"center",gap:6}}><Icon name="phone" size={11} color="var(--muted-fg)" />{lead.whatsapp}</td>
                <td style={{color:"var(--muted-fg)"}}>{fmtData(lead.criado_em)}</td>
                <td style={{color:statusColor(lead.status),fontWeight:600,fontSize:12}}>{lead.status}</td>
                <td>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <button className="btn" style={{padding:"4px 8px"}} onClick={()=>window.open(`https://wa.me/${lead.whatsapp}`,"_blank")}><Icon name="chat" size={13} /></button>
                    <div style={{position:"relative"}}>
                      <button className="btn" style={{padding:"4px 10px",fontSize:11}} onClick={()=>setOpenStatus(openStatus===lead.id?null:lead.id)}>Editar <Icon name="chevron" size={11} /></button>
                      {openStatus===lead.id&&(
                        <div style={{position:"absolute",right:0,top:36,zIndex:50,background:"var(--card)",border:"1px solid var(--border)",borderRadius:6,boxShadow:"0 8px 24px rgba(0,0,0,0.1)",minWidth:140,padding:"4px 0"}}>
                          {STATUS_OPTIONS.map(s=>(
                            <button key={s} onClick={()=>setStatus(lead.id,s)}
                              style={{display:"block",width:"100%",textAlign:"left",padding:"7px 14px",fontSize:12,background:"none",border:"none",cursor:"pointer",color:statusColor(s),fontWeight:s===lead.status?700:400,fontFamily:"inherit"}}>
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── ATENDIMENTOS PAGE ────────────────────────────────────────────────────────
function AtendimentosPage({ agent }) {
  const [tabAtiva, setTabAtiva] = useState("todos")
  const [atendimentos, setAtendimentos] = useState([])

  useEffect(() => {
    supa("atendimentos", `?agente_slug=eq.${agent.slug}&select=*&order=solicitado_em.desc`)
      .then(d => setAtendimentos(d || []))
  }, [agent.slug])

  const aguardando = atendimentos.filter(a=>a.status==="aguardando")
  const emAt = atendimentos.filter(a=>a.status==="em_atendimento")
  const filtrados = tabAtiva==="aguardando" ? aguardando : tabAtiva==="em_atendimento" ? emAt : atendimentos

  const assumir = async (id) => {
    await supaUpdate("atendimentos", id, { status:"em_atendimento", assumido_em: new Date().toISOString() })
    setAtendimentos(prev=>prev.map(a=>a.id===id?{...a,status:"em_atendimento"}:a))
  }

  const fmtTs = ts => ts ? new Date(ts).toLocaleString("pt-BR").slice(0,16) : "—"

  return (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <Icon name="headphones" size={18} color="var(--muted-fg)" />
        <p style={{fontSize:13,color:"var(--muted-fg)"}}>Leads que solicitaram atendimento humano</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {[
          {label:"Aguardando atendimento",val:aguardando.length,icon:"clock",color:"#2563eb"},
          {label:"Em atendimento",val:emAt.length,icon:"headphones",color:"var(--primary)"},
        ].map(k=>(
          <div key={k.label} style={{borderRadius:8,padding:"18px 22px",display:"flex",alignItems:"center",gap:16,background:"hsl(222 48% 9%)"}}>
            <div style={{width:40,height:40,borderRadius:"50%",border:"2px solid rgba(59,130,246,.3)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Icon name={k.icon} size={17} color={k.color} />
            </div>
            <div>
              <p style={{fontSize:32,fontWeight:900,color:"#fff",lineHeight:1}}>{k.val}</p>
              <p style={{fontSize:12,color:"rgba(255,255,255,.5)",marginTop:4}}>{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:4}}>
        {[["todos","Todos"],["aguardando","Aguardando"],["em_atendimento","Em atendimento"]].map(([val,label])=>(
          <button key={val} onClick={()=>setTabAtiva(val)}
            style={{padding:"6px 14px",borderRadius:6,fontSize:12,fontWeight:600,border:"none",cursor:"pointer",fontFamily:"inherit",
              background:tabAtiva===val?"var(--fg)":"var(--muted)",
              color:tabAtiva===val?"var(--bg)":"var(--muted-fg)"}}>
            {label}
          </button>
        ))}
      </div>

      <div style={{borderRadius:8,overflow:"hidden",background:"hsl(222 48% 7%)"}}>
        <table style={{color:"rgba(255,255,255,.7)"}}>
          <thead>
            <tr style={{borderBottom:"1px solid hsl(222 28% 14%)"}}>
              {["Cliente","Solicitado em","Atendente","Assumido em","Status","Ações"].map(c=>(
                <th key={c} style={{color:"hsl(215 20% 45%)",padding:"12px 16px"}}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map(a=>(
              <tr key={a.id} style={{borderBottom:"1px solid hsl(222 28% 11%)"}}>
                <td style={{color:"#fff",fontWeight:700,borderTop:"none"}}>{a.cliente}</td>
                <td style={{borderTop:"none"}}>{fmtTs(a.solicitado_em)}</td>
                <td style={{fontSize:11,borderTop:"none"}}>{a.atendente||"—"}</td>
                <td style={{borderTop:"none"}}>{fmtTs(a.assumido_em)}</td>
                <td style={{borderTop:"none"}}>
                  {a.status==="em_atendimento"
                    ? <span className="tag tag-blue"><span className="status-dot dot-blue" style={{width:5,height:5}} /> Em atendimento</span>
                    : <span className="tag tag-amber"><span className="status-dot dot-amber" style={{width:5,height:5}} /> Aguardando</span>}
                </td>
                <td style={{borderTop:"none"}}>
                  {a.status==="aguardando"&&<button className="btn btn-primary" style={{fontSize:11,padding:"4px 10px"}} onClick={()=>assumir(a.id)}>Assumir</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── OUTBOUND PAGE ────────────────────────────────────────────────────────────
function OutboundPage({ agent }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({nome:"",whatsapp:"",mensagem:""})
  const [leads, setLeads] = useState([])
  const [sent, setSent] = useState(false)

  useEffect(() => {
    supa("outbound", `?agente_slug=eq.${agent.slug}&select=*&order=enviado_em.desc`)
      .then(d => setLeads(d || []))
  }, [agent.slug])

  const statusColor = s => s==="Entregue"?"var(--success)":s==="Falhou"?"#b91c1c":"var(--muted-fg)"
  const statusBg = s => s==="Entregue"?"rgba(16,185,129,.1)":s==="Falhou"?"rgba(185,28,28,.08)":"var(--muted)"

  const handleEnviar = () => {
    if(!form.nome||!form.whatsapp) return
    setLeads(prev=>[{id:Date.now(),nome:form.nome,whatsapp:form.whatsapp,enviado_em:new Date().toISOString(),status:"Pendente",resposta:"—"},...prev])
    setForm({nome:"",whatsapp:"",mensagem:""})
    setSent(true)
    setTimeout(()=>setSent(false),3000)
    setShowForm(false)
  }

  const fmtTs = ts => ts ? new Date(ts).toLocaleString("pt-BR").slice(0,16) : "—"

  return (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:36,height:36,borderRadius:6,background:"rgba(24,113,220,0.08)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Icon name="outbound" size={17} color="var(--primary)" />
          </div>
          <div>
            <h1 style={{fontSize:22,fontWeight:900}}>Iniciar Conversa</h1>
            <p style={{fontSize:12,color:"var(--muted-fg)"}}>Disparo manual via WhatsApp</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={()=>setShowForm(!showForm)}>
          <Icon name="send" size={13} color="#fff" /> Nova Conversa
        </button>
      </div>

      {sent&&<div style={{padding:"10px 16px",borderRadius:6,background:"rgba(16,185,129,.1)",border:"1px solid rgba(16,185,129,.2)",color:"var(--success)",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:8}}><Icon name="check" size={14} color="var(--success)" /> Mensagem enviada!</div>}

      {showForm&&(
        <div className="glass" style={{padding:20}}>
          <h3 style={{fontSize:14,fontWeight:700,marginBottom:16}}>Nova Conversa Outbound</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            {[["Nome","nome","text","João Silva"],["WhatsApp","whatsapp","tel","5527999999999"]].map(([label,key,type,ph])=>(
              <div key={key}>
                <label style={{fontSize:11,fontWeight:600,color:"var(--muted-fg)",display:"block",marginBottom:4}}>{label}</label>
                <input type={type} placeholder={ph} value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}
                  style={{width:"100%",padding:"8px 12px",border:"1px solid var(--border)",borderRadius:6,fontSize:13,fontFamily:"inherit",color:"var(--fg)",background:"var(--card)"}} />
              </div>
            ))}
          </div>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:11,fontWeight:600,color:"var(--muted-fg)",display:"block",marginBottom:4}}>Mensagem</label>
            <textarea rows={3} placeholder="Olá! Gostaria de apresentar nossa solução..." value={form.mensagem} onChange={e=>setForm(f=>({...f,mensagem:e.target.value}))}
              style={{width:"100%",padding:"8px 12px",border:"1px solid var(--border)",borderRadius:6,fontSize:13,fontFamily:"inherit",color:"var(--fg)",background:"var(--card)",resize:"none"}} />
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-primary" onClick={handleEnviar}><Icon name="send" size={13} color="#fff" /> Enviar</button>
            <button className="btn" onClick={()=>setShowForm(false)}><Icon name="x" size={13} /> Cancelar</button>
          </div>
        </div>
      )}

      <div className="glass" style={{overflow:"hidden"}}>
        <table>
          <thead style={{background:"rgba(0,0,0,0.02)"}}>
            <tr><th>Nome</th><th>WhatsApp</th><th>Enviado em</th><th>Status</th><th>Resposta</th></tr>
          </thead>
          <tbody>
            {leads.map(l=>(
              <tr key={l.id}>
                <td style={{fontWeight:600}}>{l.nome}</td>
                <td style={{color:"var(--muted-fg)",display:"flex",alignItems:"center",gap:6}}><Icon name="phone" size={11} color="var(--muted-fg)" />{l.whatsapp}</td>
                <td style={{color:"var(--muted-fg)"}}>{fmtTs(l.enviado_em)}</td>
                <td><span style={{display:"inline-block",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:statusBg(l.status),color:statusColor(l.status)}}>{l.status}</span></td>
                <td>
                  {l.resposta==="Sim"&&<span className="tag tag-wpp"><Icon name="check" size={9} /> Sim</span>}
                  {l.resposta==="Não"&&<span className="tag tag-gray"><Icon name="x" size={9} /> Não</span>}
                  {(l.resposta==="—"||!l.resposta)&&<span style={{color:"var(--muted-fg)",fontSize:12}}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── GRUPOS PAGE ─────────────────────────────────────────────────────────────
function GruposPage({ agent }) {
  const [grupos, setGrupos] = useState([])
  const [loading, setLoading] = useState(true)
  const [sel, setSel] = useState(null)
  const [msgs, setMsgs] = useState([])
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [busca, setBusca] = useState("")
  const msgsRef = useRef(null)

  useEffect(() => {
    async function loadGrupos() {
      setLoading(true)
      try {
        // Busca grupos da Evolution API
        const data = await evo(`/group/fetchAllGroups/${agent.slug}?getParticipants=false`)
        const lista = Array.isArray(data) ? data : []

        // Para cada grupo busca última mensagem no Supabase
        const gruposComMsg = await Promise.all(lista.map(async g => {
          const jid = g.id || g.remoteJid || ""
          const convs = await supa("conversas", `?whatsapp=eq.${jid}&agente_slug=eq.${agent.slug}&select=*`)
          const conv = convs?.[0] || null
          let ultimaMsg = null
          if (conv) {
            const msgs = await supa("mensagens", `?conversa_id=eq.${conv.id}&order=criado_em.desc&limit=1`)
            ultimaMsg = msgs?.[0] || null
          }
          return { ...g, jid, conv, ultimaMsg }
        }))

        setGrupos(gruposComMsg)
      } catch(e) {
        console.error(e)
      }
      setLoading(false)
    }
    loadGrupos()
  }, [agent.slug])

  useEffect(() => {
    if (!sel?.conv) { setMsgs([]); return }
    setLoadingMsgs(true)
    supa("mensagens", `?conversa_id=eq.${sel.conv.id}&order=criado_em.asc`)
      .then(d => { setMsgs(d || []); setLoadingMsgs(false) })
  }, [sel])

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight
  }, [msgs])

  const filtrados = grupos.filter(g =>
    (g.subject || g.name || "").toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:36,height:36,borderRadius:6,background:"rgba(16,185,129,0.1)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Icon name="users" size={17} color="var(--success)" />
        </div>
        <div>
          <h1 style={{fontSize:22,fontWeight:900}}>Grupos</h1>
          <p style={{fontSize:12,color:"var(--muted-fg)"}}>Grupos de WhatsApp conectados à instância</p>
        </div>
      </div>

      <div className="glass" style={{display:"flex",overflow:"hidden",height:"calc(100vh - 200px)"}}>
        {/* Lista de grupos */}
        <div style={{width:280,flexShrink:0,borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column"}}>
          <div style={{padding:"10px 12px",borderBottom:"1px solid var(--border)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:6,background:"var(--muted)",color:"var(--muted-fg)"}}>
              <Icon name="search" size={13} />
              <input placeholder="Buscar grupo..." value={busca} onChange={e=>setBusca(e.target.value)} />
            </div>
          </div>
          <p style={{fontSize:10,color:"var(--muted-fg)",padding:"8px 12px 4px"}}>{loading ? "Carregando..." : `${filtrados.length} grupos`}</p>
          <div style={{flex:1,overflowY:"auto"}}>
            {loading ? (
              <div style={{padding:24,textAlign:"center",color:"var(--muted-fg)",fontSize:12}}>Buscando grupos...</div>
            ) : filtrados.length === 0 ? (
              <div style={{padding:24,textAlign:"center",color:"var(--muted-fg)",fontSize:12}}>Nenhum grupo encontrado</div>
            ) : filtrados.map((g, i) => {
              const nome = g.subject || g.name || g.jid || "Grupo"
              const preview = g.ultimaMsg?.texto === "[mídia]" ? "📎 Mídia" : (g.ultimaMsg?.texto || "Sem mensagens")
              const temMsgs = !!g.conv
              return (
                <div key={g.jid} onClick={()=>setSel(g)}
                  style={{padding:"10px 12px",cursor:"pointer",borderBottom:"1px solid var(--border)",
                    background:sel?.jid===g.jid?"rgba(24,113,220,0.04)":undefined,
                    borderLeft:sel?.jid===g.jid?"2px solid var(--primary)":"2px solid transparent",
                    transition:"background .15s"}}>
                  <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                    <div style={{width:34,height:34,borderRadius:"50%",background:"rgba(16,185,129,0.12)",
                      display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:14}}>
                      👥
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <p style={{fontSize:12,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:150}}>{nome}</p>
                        {temMsgs && <span style={{width:7,height:7,borderRadius:"50%",background:"var(--success)",display:"inline-block",flexShrink:0}} />}
                      </div>
                      <p style={{fontSize:11,color:"var(--muted-fg)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginTop:2}}>
                        {preview.substring(0,40)}
                      </p>
                      <div style={{display:"flex",gap:4,marginTop:4}}>
                        <span className="tag tag-wpp">grupo</span>
                        {g.participants && <span className="tag tag-gray">{g.participants} membros</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Chat do grupo */}
        <div style={{flex:1,display:"flex",flexDirection:"column"}}>
          {sel ? (
            <>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 18px",borderBottom:"1px solid var(--border)"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:34,height:34,borderRadius:"50%",background:"rgba(16,185,129,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>👥</div>
                  <div>
                    <p style={{fontSize:13,fontWeight:700}}>{sel.subject||sel.name||"Grupo"}</p>
                    <p style={{fontSize:11,color:"var(--muted-fg)"}}>{sel.jid}</p>
                  </div>
                </div>
                <span className="tag tag-wpp">grupo WhatsApp</span>
              </div>
              <div ref={msgsRef} style={{flex:1,overflowY:"auto",padding:"16px 18px",display:"flex",flexDirection:"column",gap:10}}>
                {loadingMsgs ? (
                  <div style={{textAlign:"center",color:"var(--muted-fg)",fontSize:12,marginTop:40}}>Carregando mensagens...</div>
                ) : !sel.conv ? (
                  <div style={{textAlign:"center",color:"var(--muted-fg)",fontSize:13,marginTop:40}}>
                    <p style={{fontSize:32,marginBottom:8}}>💬</p>
                    <p style={{fontWeight:700,color:"var(--fg)"}}>Nenhuma mensagem ainda</p>
                    <p style={{fontSize:12,marginTop:4}}>As mensagens deste grupo aparecerão aqui quando chegarem</p>
                  </div>
                ) : msgs.length === 0 ? (
                  <div style={{textAlign:"center",color:"var(--muted-fg)",fontSize:12,marginTop:40}}>Nenhuma mensagem registrada</div>
                ) : msgs.map(msg=>(
                  <div key={msg.id} style={{display:"flex",flexDirection:"column",alignItems:msg.bot?"flex-end":"flex-start"}}>
                    {!msg.bot && (
                      <p style={{fontSize:10,fontWeight:700,color:"var(--primary)",marginBottom:2,marginLeft:4}}>{msg.nome_contato||msg.telefone||"Membro"}</p>
                    )}
                    <div style={{
                      maxWidth:"70%",
                      background:msg.bot?"var(--primary)":"var(--muted)",
                      color:msg.bot?"#fff":"var(--fg)",
                      borderRadius:msg.bot?"14px 14px 4px 14px":"14px 14px 14px 4px",
                      padding:"8px 14px",fontSize:13
                    }}>
                      <p style={{whiteSpace:"pre-wrap"}}>{msg.texto==="[mídia]"?"📎 Mídia recebida":msg.texto}</p>
                      <p style={{fontSize:10,opacity:.6,marginTop:4,textAlign:"right"}}>{new Date(msg.criado_em).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,color:"var(--muted-fg)"}}>
              <span style={{fontSize:48}}>👥</span>
              <p style={{fontSize:15,fontWeight:700,color:"var(--fg)"}}>Selecione um grupo</p>
              <p style={{fontSize:13}}>Escolha um grupo à esquerda para ver as mensagens</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── LAYOUT ───────────────────────────────────────────────────────────────────
const MENU = [
  {label:"DASHBOARD",       icon:"dashboard",  path:"dashboard"},
  {label:"CONVERSAS",       icon:"chat",       path:"conversations"},
  {label:"GRUPOS",          icon:"users",      path:"grupos"},
  {label:"LEADS",           icon:"users",      path:"leads"},
  {label:"ATENDIMENTOS",    icon:"headphones", path:"atendimentos"},
  {label:"INICIAR CONVERSA",icon:"outbound",   path:"outbound"},
]

function AgentLayout({ agent, onBack }) {
  const [page, setPage] = useState("dashboard")
  const currentLabel = MENU.find(m=>m.path===page)?.label || "DASHBOARD"
  const PageComponent = { dashboard:DashboardPage, conversations:ConversasPage, grupos:GruposPage, leads:LeadsPage, atendimentos:AtendimentosPage, outbound:OutboundPage }[page] || DashboardPage

  return (
    <div style={{display:"flex",height:"100vh",overflow:"hidden"}}>
      <aside style={{width:216,flexShrink:0,display:"flex",flexDirection:"column",background:"var(--sidebar-bg)",borderRight:"1px solid var(--sidebar-border)"}}>
        <div style={{padding:"14px 12px 10px",borderBottom:"1px solid var(--sidebar-border)"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
            <div style={{width:28,height:28,borderRadius:5,background:"var(--primary)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:900}}>GF</div>
            <div>
              <p style={{fontSize:8,fontWeight:700,color:"var(--sidebar-fg)",opacity:.45,letterSpacing:".12em",textTransform:"uppercase"}}>Hub de Suporte</p>
              <p style={{fontSize:9.5,color:"var(--sidebar-fg)",opacity:.6,lineHeight:1.3}}>Atendimento</p>
            </div>
          </div>
          <p style={{fontSize:9.5,fontWeight:700,color:"var(--sidebar-primary)",textTransform:"uppercase",letterSpacing:".05em",lineHeight:1.3}}>{agent.nome}</p>
        </div>
        <div style={{padding:"10px 10px 0"}}>
          <button onClick={onBack} className="nav-link" style={{width:"100%",opacity:.55}}><Icon name="arrow_left" size={11} color="var(--sidebar-fg)" /> VOLTAR AO HUB</button>
          <div style={{borderTop:"1px solid var(--sidebar-border)",margin:"8px 0"}} />
        </div>
        <nav style={{flex:1,padding:"0 8px",display:"flex",flexDirection:"column",gap:2}}>
          <p style={{fontSize:8.5,fontWeight:700,letterSpacing:".1em",color:"var(--sidebar-fg)",opacity:.35,textTransform:"uppercase",padding:"0 6px",marginBottom:6}}>MENU</p>
          {MENU.map((item,idx)=>(
            <button key={item.path} onClick={()=>setPage(item.path)} className={`nav-link ${page===item.path?"active":""}`}
              style={{width:"100%",textAlign:"left",border:"none",fontFamily:"inherit",cursor:"pointer"}}>
              <span className="mono" style={{fontSize:8.5,opacity:.4,minWidth:16}}>{String(idx+1).padStart(2,"0")}</span>
              <Icon name={item.icon} size={12} color={page===item.path?"#fff":"var(--sidebar-fg)"} />
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{padding:"10px 10px 14px",borderTop:"1px solid var(--sidebar-border)"}}>
          <button className="nav-link" style={{width:"100%",border:"none",fontFamily:"inherit",cursor:"pointer"}} onClick={onBack}>
            <Icon name="logout" size={12} color="var(--sidebar-fg)" /> SAIR DO SISTEMA
          </button>
        </div>
      </aside>

      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        <header style={{display:"flex",alignItems:"center",gap:12,padding:"0 24px",minHeight:56,borderBottom:"1px solid var(--border)",background:"rgba(245,246,250,0.95)",backdropFilter:"blur(8px)",flexShrink:0}}>
          <div style={{flex:1,display:"flex",alignItems:"center",gap:8,fontSize:11,fontFamily:"'DM Mono',monospace",color:"var(--muted-fg)"}}>
            <span style={{color:"var(--primary)",fontWeight:700}}>{agent.nome}</span>
            <span>›</span>
            <span style={{color:"var(--fg)",fontWeight:700,letterSpacing:".06em"}}>{currentLabel}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,fontSize:10,fontWeight:600,color:"var(--muted-fg)"}}>
            <span className="status-dot dot-green" /> ONLINE
          </div>
          <button className="btn" style={{padding:"5px 8px"}}><Icon name="bell" size={14} /></button>
        </header>
        <main className="grid-bg" style={{flex:1,overflowY:"auto",position:"relative"}}>
          <div style={{position:"absolute",top:0,right:0,width:500,height:300,pointerEvents:"none",background:"radial-gradient(at 100% 0%, rgba(24,113,220,0.04), transparent 55%)"}} />
          <div style={{position:"relative",zIndex:1,padding:"28px 32px"}}>
            <PageComponent agent={agent} />
          </div>
        </main>
      </div>
    </div>
  )
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [selectedAgent, setSelectedAgent] = useState(null)
  return (
    <div className="hub-root">
      <style>{CSS}</style>
      {selectedAgent
        ? <AgentLayout agent={selectedAgent} onBack={()=>setSelectedAgent(null)} />
        : <HubPage onSelect={setSelectedAgent} />}
    </div>
  )
}
