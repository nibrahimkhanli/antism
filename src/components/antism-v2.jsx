import { useState, useEffect, useRef, useCallback } from "react";

// ══════════════════════════════════════════
// DESIGN TOKENS
// ══════════════════════════════════════════
const DARK = {
  bg:"oklch(0.15 0.018 260)",card:"oklch(0.20 0.018 260)",card2:"oklch(0.24 0.016 260)",
  pri:"oklch(0.6146 0.2372 21.37)",priFg:"oklch(0.985 0 0)",
  fg:"oklch(0.95 0 0)",mfg:"oklch(0.62 0 0)",xfg:"oklch(0.42 0 0)",
  acc:"oklch(0.88 0.08 168)",accFg:"oklch(0.14 0 0)",
  ok:"oklch(0.75 0.15 145)",okFg:"oklch(0.14 0 0)",okBg:"oklch(0.75 0.15 145 / 0.12)",
  err:"oklch(0.65 0.20 25)",errBg:"oklch(0.65 0.20 25 / 0.12)",
  border:"oklch(1 0 0 / 0.10)",border2:"oklch(1 0 0 / 0.06)",
  input:"oklch(1 0 0 / 0.06)",inputHover:"oklch(1 0 0 / 0.09)",
  p10:"oklch(0.6146 0.2372 21.37 / 0.10)",p20:"oklch(0.6146 0.2372 21.37 / 0.20)",p30:"oklch(0.6146 0.2372 21.37 / 0.30)",
  a10:"oklch(0.88 0.08 168 / 0.12)",a25:"oklch(0.88 0.08 168 / 0.28)",
  shadow:"0 4px 24px oklch(0 0 0 / 0.35)",shadow2:"0 12px 48px oklch(0 0 0 / 0.5)",
  f:"'Google Sans Flex',system-ui,sans-serif",
};
const LIGHT = {
  bg:"oklch(0.96 0.005 260)",card:"oklch(1 0 0)",card2:"oklch(0.97 0.006 260)",
  pri:"oklch(0.50 0.22 21.37)",priFg:"oklch(0.985 0 0)",
  fg:"oklch(0.14 0.02 260)",mfg:"oklch(0.46 0.01 260)",xfg:"oklch(0.62 0.01 260)",
  acc:"oklch(0.42 0.10 168)",accFg:"oklch(0.985 0 0)",
  ok:"oklch(0.48 0.14 145)",okFg:"oklch(0.985 0 0)",okBg:"oklch(0.48 0.14 145 / 0.10)",
  err:"oklch(0.50 0.20 25)",errBg:"oklch(0.50 0.20 25 / 0.10)",
  border:"oklch(0 0 0 / 0.09)",border2:"oklch(0 0 0 / 0.05)",
  input:"oklch(0 0 0 / 0.04)",inputHover:"oklch(0 0 0 / 0.07)",
  p10:"oklch(0.50 0.22 21.37 / 0.08)",p20:"oklch(0.50 0.22 21.37 / 0.16)",p30:"oklch(0.50 0.22 21.37 / 0.28)",
  a10:"oklch(0.42 0.10 168 / 0.10)",a25:"oklch(0.42 0.10 168 / 0.22)",
  shadow:"0 4px 24px oklch(0 0 0 / 0.08)",shadow2:"0 12px 48px oklch(0 0 0 / 0.14)",
  f:"'Google Sans Flex',system-ui,sans-serif",
};

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Google+Sans+Flex:ital,wdth,wght@0,75..125,100..900;1,75..125,100..900&subset=latin,latin-ext&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Google Sans Flex',system-ui,sans-serif;overflow-x:hidden;-webkit-font-smoothing:antialiased}
input,textarea,select,button{font-family:inherit}
@keyframes rise{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.r1{animation:rise .65s ease .06s both}.r2{animation:rise .65s ease .18s both}.r3{animation:rise .65s ease .30s both}.r4{animation:rise .65s ease .42s both}
.bdot{animation:blink 2s ease-in-out infinite}
.spin{animation:spin .8s linear infinite}
.fadein{animation:fadeIn .3s ease both}
.slideup{animation:slideUp .25s ease both}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:oklch(1 0 0/0.12);border-radius:3px}
@media(max-width:960px){.no-mob{display:none!important}.col1{grid-template-columns:1fr!important}.wrap{padding:0 20px!important}}
@media(max-width:600px){.auth-card{padding:24px 18px!important}.cta-inner{padding:48px 24px!important}.footer-row{flex-direction:column;align-items:flex-start!important;gap:14px!important}}
`;

// ══════════════════════════════════════════
// HOOKS
// ══════════════════════════════════════════
function useTheme() {
  const [light, setLight] = useState(false);
  return { light, toggle: () => setLight(v => !v), T: light ? LIGHT : DARK };
}

function useToast() {
  const [state, setState] = useState({ msg:"", ok:true, show:false });
  const t = useRef(null);
  const toast = useCallback((msg, ok=true) => {
    clearTimeout(t.current);
    setState({ msg, ok, show:true });
    t.current = setTimeout(() => setState(s => ({...s, show:false})), 3200);
  }, []);
  return { ...state, toast };
}

// ══════════════════════════════════════════
// VALIDATION HELPERS
// ══════════════════════════════════════════
const validate = {
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Düzgün e-poçt daxil edin",
  pw:    v => v.length >= 8 ? "" : "Şifrə minimum 8 simvol olmalıdır",
  name:  v => v.trim().length >= 2 ? "" : "Bu sahə mütləqdir",
  req:   v => v.trim().length > 0 ? "" : "Bu sahə mütləqdir",
};

// ══════════════════════════════════════════
// ICONS
// ══════════════════════════════════════════
const Ico = ({ d, size=16, ...p }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d={d}/></svg>;
const IcoMoon  = () => <Ico d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>;
const IcoSun   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const IcoEye   = ({off}) => off
  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IcoCheck = ({size=14}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoLock  = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IcoChevron = ({dir="right",size=14}) => {
  const d = { right:"M9 18l6-6-6-6", left:"M15 18l-6-6 6-6", down:"M6 9l6 6 6-6", up:"M18 15l-6-6-6 6" };
  return <Ico d={d[dir]} size={size}/>;
};
const IcoBell   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const IcoGrid   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const IcoStar   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IcoTrend  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const IcoUser   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcoMsg    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IcoDeal   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>;
const IcoCash   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
const IcoSettings=() => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 1.41 1.41"/><path d="M21.95 9H22"/><path d="M21.95 15H22"/><path d="M19.07 19.07a10 10 0 0 1-1.41 1.41"/><path d="M15 21.95V22"/><path d="M9 21.95V22"/><path d="M4.93 19.07a10 10 0 0 1-1.41-1.41"/><path d="M2.05 15H2"/><path d="M2.05 9H2"/><path d="M4.93 4.93a10 10 0 0 1 1.41-1.41"/><path d="M9 2.05V2"/><path d="M15 2.05V2"/></svg>;
const IcoLogout = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IcoSearch = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IcoPlus   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcoUpload = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>;
const IcoGoogle = () => <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>;

// ══════════════════════════════════════════
// SHARED PRIMITIVES
// ══════════════════════════════════════════
const Eyebrow = ({T,children}) => (
  <div style={{display:"flex",alignItems:"center",gap:10,color:T.pri,fontSize:11,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:16}}>
    <span style={{width:18,height:1.5,background:T.pri,flexShrink:0,display:"inline-block"}}/>
    {children}
  </div>
);

const FieldInput = ({T,label,id,type="text",placeholder,value,onChange,error,touched,autoComplete,rightEl,hint}) => {
  const hasErr = touched && error;
  const isOk   = touched && !error && value;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      {label && <label htmlFor={id} style={{fontSize:13,fontWeight:600,color:T.fg}}>{label}</label>}
      <div style={{position:"relative"}}>
        <input
          id={id} type={type} placeholder={placeholder} value={value} onChange={onChange}
          autoComplete={autoComplete}
          style={{
            width:"100%",fontSize:15,color:T.fg,
            background: hasErr ? T.errBg : T.input,
            border:`1.5px solid ${hasErr ? T.err : isOk ? T.ok : T.border}`,
            borderRadius:10,padding:`12px ${rightEl?"44px":"16px"} 12px 16px`,
            outline:"none",transition:"border-color .2s, background .2s"
          }}
        />
        {rightEl && <div style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)"}}>{rightEl}</div>}
        {isOk && !rightEl && (
          <div style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:T.ok}}>
            <IcoCheck size={15}/>
          </div>
        )}
      </div>
      {hasErr && <span className="slideup" style={{fontSize:12,color:T.err,display:"flex",alignItems:"center",gap:5}}>⚠ {error}</span>}
      {hint && !hasErr && <span style={{fontSize:12,color:T.mfg}}>{hint}</span>}
    </div>
  );
};

const PwInput = ({T,label,id,placeholder,value,onChange,error,touched,autoComplete}) => {
  const [show,setShow] = useState(false);
  return (
    <FieldInput T={T} label={label} id={id} type={show?"text":"password"}
      placeholder={placeholder} value={value} onChange={onChange}
      error={error} touched={touched} autoComplete={autoComplete}
      rightEl={
        <button type="button" onClick={()=>setShow(v=>!v)}
          style={{background:"none",border:"none",cursor:"pointer",color:T.mfg,padding:2,display:"flex",alignItems:"center"}}>
          <IcoEye off={show}/>
        </button>
      }
    />
  );
};

const FormErr = ({T,msg}) => msg ? (
  <div className="slideup" style={{background:T.errBg,border:`1px solid ${T.err}`,borderRadius:10,padding:"12px 16px",fontSize:13,color:T.err,display:"flex",alignItems:"center",gap:8}}>
    <span>⚠</span> {msg}
  </div>
) : null;

const BtnPrimary = ({T,children,onClick,loading,full,size="md",disabled}) => (
  <button onClick={onClick} disabled={loading||disabled}
    style={{fontFamily:T.f,fontWeight:700,cursor:loading||disabled?"not-allowed":"pointer",
      background:loading||disabled?T.p30:T.pri,color:T.priFg,border:"none",
      borderRadius:10,padding:size==="lg"?"15px 32px":size==="sm"?"9px 18px":"13px 24px",
      fontSize:size==="sm"?13:15,width:full?"100%":"auto",
      display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,
      transition:"filter .18s,transform .15s",opacity:disabled?.6:1}}>
    {loading && <span className="spin" style={{width:15,height:15,border:`2px solid ${T.priFg}`,borderTopColor:"transparent",borderRadius:"50%",display:"inline-block"}}/>}
    {children}
  </button>
);

const Footer = ({T,goTo}) => (
  <div style={{borderTop:`1px solid ${T.border}`}}>
    <div className="footer-row" style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:20,padding:"36px 44px",maxWidth:1120,margin:"0 auto"}}>
      <button onClick={()=>goTo("home")} style={{fontFamily:T.f,fontSize:17,fontWeight:800,letterSpacing:"-.03em",color:T.mfg,background:"none",border:"none",cursor:"pointer",padding:0}}>
        Antism<span style={{color:T.pri}}>.</span>
      </button>
      <ul style={{display:"flex",gap:24,listStyle:"none"}}>
        {[["haqqimizda","Haqqımızda"],["elaqe","Əlaqə"],["sertler","Şərtlər"],["mexfilik","Məxfilik"]].map(([id,label])=>(
          <li key={id}><button onClick={()=>goTo(id)} style={{fontFamily:T.f,fontSize:13,color:T.mfg,background:"none",border:"none",cursor:"pointer",padding:0}}>{label}</button></li>
        ))}
      </ul>
      <span style={{fontSize:12,color:T.mfg}}>© 2025 Antism.</span>
    </div>
  </div>
);

// ══════════════════════════════════════════
// NAV
// ══════════════════════════════════════════
const Nav = ({T,goTo,light,toggle,scrolled,page,user}) => {
  if (["dashboard","onboarding"].includes(page)) return null;
  const solid = scrolled || page !== "home";
  return (
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,height:62,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 44px",
      borderBottom:`1px solid ${solid?T.border:"transparent"}`,
      background:solid?(light?"oklch(0.96 0.005 260/.93)":"oklch(0.15 0.018 260/.92)"):"transparent",
      backdropFilter:solid?"blur(20px) saturate(1.6)":"none",transition:"background .4s,border-color .4s"}}>

      <button onClick={()=>goTo("home")} style={{fontFamily:T.f,fontSize:18,fontWeight:800,letterSpacing:"-.04em",color:T.fg,background:"none",border:"none",cursor:"pointer",padding:0}}>
        Antism<span style={{color:T.pri}}>.</span>
      </button>

      <div className="no-mob" style={{display:"flex",gap:28,position:"absolute",left:"50%",transform:"translateX(-50%)"}}>
        {[["kreatorlar","Kreatorlar"],["sponsorlar","Sponsorlar"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>goTo(id)} style={{fontFamily:T.f,fontSize:13,color:T.mfg,background:"none",border:"none",cursor:"pointer",padding:0,transition:"color .2s"}}>{lbl}</button>
        ))}
      </div>

      <div style={{display:"flex",alignItems:"center",gap:16}}>
        {/* theme toggle — padded away from neighbours */}
        <button onClick={toggle}
          style={{width:36,height:36,borderRadius:8,background:T.card,border:`1px solid ${T.border}`,cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",color:T.mfg,flexShrink:0,transition:"border-color .2s"}}>
          {light ? <IcoSun/> : <IcoMoon/>}
        </button>
        {/* divider */}
        <span style={{width:1,height:20,background:T.border,flexShrink:0}}/>
        {user
          ? <button onClick={()=>goTo("dashboard")} style={{fontFamily:T.f,fontSize:13,fontWeight:600,color:T.pri,background:T.p10,border:`1px solid ${T.p20}`,borderRadius:8,padding:"8px 14px",cursor:"pointer"}}>Dashboard →</button>
          : <>
              <button onClick={()=>goTo("giris")} style={{fontFamily:T.f,fontSize:13,fontWeight:500,color:T.mfg,background:"none",border:"none",cursor:"pointer",padding:"6px 2px",transition:"color .2s"}}>Daxil ol</button>
              <button onClick={()=>goTo("qeydiyyat")} style={{fontFamily:T.f,fontSize:13,fontWeight:700,color:T.priFg,background:T.pri,border:"none",borderRadius:8,padding:"9px 18px",cursor:"pointer",minHeight:38}}>Başla →</button>
            </>
        }
      </div>
    </nav>
  );
};

// ══════════════════════════════════════════
// AUTH PAGES
// ══════════════════════════════════════════
function PageGiris({T,goTo,onLogin}) {
  const [email,setEmail]   = useState("");
  const [pw,setPw]         = useState("");
  const [touched,setTouched] = useState({});
  const [formErr,setFormErr] = useState("");
  const [loading,setLoading] = useState(false);

  const errs = { email: validate.email(email), pw: validate.pw(pw) };
  const touch = f => setTouched(t=>({...t,[f]:true}));

  const submit = async () => {
    setTouched({email:true,pw:true});
    if (errs.email || errs.pw) return;
    setLoading(true); setFormErr("");
    await new Promise(r=>setTimeout(r,1100));
    // Demo: wrong password simulation
    if (pw === "wrong") { setFormErr("E-poçt və ya şifrə yanlışdır."); setLoading(false); return; }
    onLogin({ name:"Nihad Əliyev", email, role:"kreator", avatar:"NH" });
    goTo("dashboard");
  };

  return (
    <div style={{minHeight:"100svh",display:"flex",alignItems:"center",justifyContent:"center",padding:"80px 20px",background:T.bg,position:"relative"}}>
      <div style={{position:"absolute",inset:0,pointerEvents:"none",background:`radial-gradient(ellipse 45% 55% at 50% 38%,${T.p10},transparent 65%)`}}/>
      <div className="auth-card" style={{position:"relative",width:"100%",maxWidth:440,background:T.card,border:`1px solid ${T.border}`,borderRadius:24,padding:40,boxShadow:T.shadow}}>
        <button onClick={()=>goTo("home")} style={{fontFamily:T.f,fontSize:20,fontWeight:800,letterSpacing:"-.04em",color:T.fg,background:"none",border:"none",cursor:"pointer",padding:0,display:"block",margin:"0 auto 28px",textAlign:"center"}}>
          Antism<span style={{color:T.pri}}>.</span>
        </button>
        <h1 style={{fontSize:26,fontWeight:800,letterSpacing:"-.03em",color:T.fg,marginBottom:6}}>Xoş gəldiniz</h1>
        <p style={{fontSize:14,color:T.mfg,marginBottom:24}}>Hesabınıza daxil olun</p>

        <button style={{width:"100%",minHeight:46,borderRadius:10,border:`1px solid ${T.border}`,background:T.card2,display:"flex",alignItems:"center",justifyContent:"center",gap:10,fontFamily:T.f,fontSize:14,fontWeight:600,color:T.fg,cursor:"pointer",marginBottom:16,transition:"border-color .2s"}}>
          <IcoGoogle/> Google ilə daxil ol
        </button>

        <div style={{display:"flex",alignItems:"center",gap:12,margin:"0 0 16px",color:T.mfg,fontSize:12}}>
          <span style={{flex:1,height:1,background:T.border,display:"block"}}/> və ya <span style={{flex:1,height:1,background:T.border,display:"block"}}/>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <FormErr T={T} msg={formErr}/>
          <FieldInput T={T} label="E-poçt" id="gi-email" type="email" placeholder="ad@nümunə.com"
            value={email} onChange={e=>{setEmail(e.target.value);touch("email")}}
            error={errs.email} touched={touched.email} autoComplete="email"/>
          <PwInput T={T} label="Şifrə" id="gi-pw" placeholder="Şifrənizi daxil edin"
            value={pw} onChange={e=>{setPw(e.target.value);touch("pw")}}
            error={errs.pw} touched={touched.pw} autoComplete="current-password"/>
          <div style={{textAlign:"right"}}>
            <button style={{fontFamily:T.f,fontSize:13,color:T.pri,background:"none",border:"none",cursor:"pointer",padding:0}}>Şifrəni unutdum?</button>
          </div>
          <BtnPrimary T={T} full loading={loading} onClick={submit}>Daxil ol</BtnPrimary>
        </div>
        <p style={{textAlign:"center",marginTop:18,fontSize:13,color:T.mfg}}>
          Hesabınız yoxdur?{" "}
          <button onClick={()=>goTo("qeydiyyat")} style={{fontFamily:T.f,fontSize:13,color:T.pri,background:"none",border:"none",cursor:"pointer",fontWeight:600,padding:0}}>Qeydiyyat</button>
        </p>
      </div>
    </div>
  );
}

function PageQeydiyyat({T,goTo,onLogin}) {
  const [role,setRole]     = useState("kreator");
  const [ad,setAd]         = useState("");
  const [soy,setSoy]       = useState("");
  const [email,setEmail]   = useState("");
  const [pw,setPw]         = useState("");
  const [terms,setTerms]   = useState(false);
  const [touched,setTouched] = useState({});
  const [formErr,setFormErr] = useState("");
  const [loading,setLoading] = useState(false);

  const errs = {
    ad:    validate.name(ad),
    soy:   validate.name(soy),
    email: validate.email(email),
    pw:    validate.pw(pw),
    terms: terms ? "" : "Şərtləri qəbul etməlisiniz",
  };
  const touch = f => setTouched(t=>({...t,[f]:true}));
  const allOk = !Object.values(errs).some(Boolean);

  const submit = async () => {
    setTouched({ad:true,soy:true,email:true,pw:true,terms:true});
    if (!allOk) { setFormErr("Zəhmət olmasa bütün sahələri düzgün doldurun."); return; }
    setLoading(true); setFormErr("");
    await new Promise(r=>setTimeout(r,1200));
    onLogin({ name:`${ad} ${soy}`, email, role, avatar: (ad[0]||"U")+(soy[0]||"") });
    goTo("onboarding");
  };

  return (
    <div style={{minHeight:"100svh",display:"flex",alignItems:"center",justifyContent:"center",padding:"80px 20px",background:T.bg,position:"relative"}}>
      <div style={{position:"absolute",inset:0,pointerEvents:"none",background:`radial-gradient(ellipse 45% 55% at 50% 38%,${T.p10},transparent 65%)`}}/>
      <div className="auth-card" style={{position:"relative",width:"100%",maxWidth:460,background:T.card,border:`1px solid ${T.border}`,borderRadius:24,padding:40,boxShadow:T.shadow}}>
        <button onClick={()=>goTo("home")} style={{fontFamily:T.f,fontSize:20,fontWeight:800,letterSpacing:"-.04em",color:T.fg,background:"none",border:"none",cursor:"pointer",padding:0,display:"block",margin:"0 auto 28px",textAlign:"center"}}>
          Antism<span style={{color:T.pri}}>.</span>
        </button>
        <h1 style={{fontSize:26,fontWeight:800,letterSpacing:"-.03em",color:T.fg,marginBottom:6}}>Hesab yaradın</h1>
        <p style={{fontSize:14,color:T.mfg,marginBottom:20}}>Platformaya pulsuz qoşulun</p>

        {/* Role tabs */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
          {[["kreator","🎙 Kreator"],["sponsor","🏢 Sponsor"]].map(([r,lbl])=>(
            <button key={r} onClick={()=>setRole(r)}
              style={{fontFamily:T.f,fontSize:14,fontWeight:600,
                color:role===r?T.priFg:T.mfg,
                background:role===r?T.pri:T.card2,
                border:`1.5px solid ${role===r?T.pri:T.border}`,
                borderRadius:10,padding:"11px 8px",cursor:"pointer",transition:"all .18s"}}>
              {lbl}
            </button>
          ))}
        </div>

        <button style={{width:"100%",minHeight:46,borderRadius:10,border:`1px solid ${T.border}`,background:T.card2,display:"flex",alignItems:"center",justifyContent:"center",gap:10,fontFamily:T.f,fontSize:14,fontWeight:600,color:T.fg,cursor:"pointer",marginBottom:16}}>
          <IcoGoogle/> Google ilə davam et
        </button>
        <div style={{display:"flex",alignItems:"center",gap:12,margin:"0 0 16px",color:T.mfg,fontSize:12}}>
          <span style={{flex:1,height:1,background:T.border,display:"block"}}/> və ya <span style={{flex:1,height:1,background:T.border,display:"block"}}/>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <FormErr T={T} msg={formErr}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <FieldInput T={T} label="Ad" id="r-ad" placeholder="Adınız"
              value={ad} onChange={e=>{setAd(e.target.value);touch("ad")}}
              error={errs.ad} touched={touched.ad} autoComplete="given-name"/>
            <FieldInput T={T} label="Soyad" id="r-soy" placeholder="Soyadınız"
              value={soy} onChange={e=>{setSoy(e.target.value);touch("soy")}}
              error={errs.soy} touched={touched.soy} autoComplete="family-name"/>
          </div>
          <FieldInput T={T} label="E-poçt" id="r-email" type="email" placeholder="ad@nümunə.com"
            value={email} onChange={e=>{setEmail(e.target.value);touch("email")}}
            error={errs.email} touched={touched.email} autoComplete="email"/>
          <PwInput T={T} label="Şifrə" id="r-pw" placeholder="Minimum 8 simvol"
            value={pw} onChange={e=>{setPw(e.target.value);touch("pw")}}
            error={errs.pw} touched={touched.pw} autoComplete="new-password"
            hint="Minimum 8 simvol, hərf və rəqəm"/>
          <div>
            <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
              <input type="checkbox" id="terms" checked={terms} onChange={e=>{setTerms(e.target.checked);touch("terms")}}
                style={{width:17,height:17,minWidth:17,accentColor:T.pri,cursor:"pointer",marginTop:2}}/>
              <label htmlFor="terms" style={{fontSize:13,color:T.mfg,cursor:"pointer",lineHeight:1.5}}>
                <span style={{color:T.pri,cursor:"pointer"}}>Şərtlər</span> və <span style={{color:T.pri,cursor:"pointer"}}>Məxfilik Siyasəti</span> ilə razıyam
              </label>
            </div>
            {touched.terms && errs.terms && <p className="slideup" style={{fontSize:12,color:T.err,marginTop:5}}>⚠ {errs.terms}</p>}
          </div>
          <BtnPrimary T={T} full loading={loading} onClick={submit}>Hesab Yarat →</BtnPrimary>
        </div>
        <p style={{textAlign:"center",marginTop:18,fontSize:13,color:T.mfg}}>
          Artıq hesabınız var?{" "}
          <button onClick={()=>goTo("giris")} style={{fontFamily:T.f,fontSize:13,color:T.pri,background:"none",border:"none",cursor:"pointer",fontWeight:600,padding:0}}>Daxil olun</button>
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// ONBOARDING FLOW — 3 steps
// Card is defined OUTSIDE render to prevent remount on every keystroke
// ══════════════════════════════════════════
const OnboardCard = ({T, children}) => (
  <div className="fadein" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:24,padding:40,
    boxShadow:T.shadow,maxWidth:520,width:"100%"}}>
    {children}
  </div>
);

// Equal-width nav buttons for onboarding
const NavBtn = ({T, onClick, children, disabled, variant="outline"}) => (
  <button onClick={onClick} disabled={disabled}
    style={{fontFamily:T.f, fontWeight:700, cursor:disabled?"not-allowed":"pointer",
      fontSize:14, padding:"13px 0", borderRadius:10, flex:1,
      background: variant==="primary" ? (disabled ? T.p30 : T.pri) : "none",
      color:       variant==="primary" ? T.priFg : T.mfg,
      border:      variant==="primary" ? "none" : `1px solid ${T.border}`,
      opacity:     disabled ? .55 : 1, transition:"filter .18s"}}>
    {children}
  </button>
);

function PageOnboarding({T, user, goTo, onComplete, light, toggle}) {
  const [step, setStep]       = useState(0);
  const [kreType, setKreType] = useState("");
  const [company, setCompany] = useState("");
  const [sector,  setSector]  = useState("");
  const [bio,     setBio]     = useState("");
  const [link,    setLink]    = useState("");
  const [audience,setAudience]= useState("");
  const [tags,    setTags]    = useState([]);
  const [tCo,     setTCo]     = useState(false);

  const isK = user?.role === "kreator";

  const STEPS = isK
    ? ["Kreator tipi", "Profil məlumatları", "Hazırsınız!"]
    : ["Brend haqqında", "Hədəf auditoriya", "Hazırsınız!"];

  const next = () => { if(step < 2) setStep(s=>s+1); else { onComplete(); goTo("dashboard"); } };
  const back = () => { if(step > 0) setStep(s=>s-1); };

  const toggleTag = tag => setTags(ts => ts.includes(tag) ? ts.filter(t=>t!==tag) : [...ts, tag]);

  return (
    <div style={{minHeight:"100svh", background:T.bg, display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", padding:"60px 20px", position:"relative"}}>
      <div style={{position:"absolute",inset:0,pointerEvents:"none",
        background:`radial-gradient(ellipse 55% 60% at 50% 35%,${T.p10},transparent 65%)`}}/>

      {/* Header row: logo + theme toggle */}
      <div style={{position:"fixed",top:0,left:0,right:0,height:58,display:"flex",alignItems:"center",
        justifyContent:"space-between",padding:"0 32px",zIndex:100,
        background:T.bg,borderBottom:`1px solid ${T.border}`}}>
        <button onClick={()=>goTo("home")} style={{fontFamily:T.f,fontSize:17,fontWeight:800,
          letterSpacing:"-.04em",color:T.fg,background:"none",border:"none",cursor:"pointer",padding:0}}>
          Antism<span style={{color:T.pri}}>.</span>
        </button>
        <button onClick={toggle}
          style={{width:36,height:36,borderRadius:8,background:T.card,border:`1px solid ${T.border}`,
            cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:T.mfg}}>
          {light ? <IcoSun/> : <IcoMoon/>}
        </button>
      </div>

      {/* Step progress — 3 named segments */}
      <div style={{width:"100%",maxWidth:520,marginBottom:32,marginTop:20,position:"relative",zIndex:1}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:10}}>
          {STEPS.map((label,i)=>(
            <div key={i} style={{textAlign:"center"}}>
              <div style={{height:4,borderRadius:100,marginBottom:7,
                background: i < step ? T.pri : i === step ? T.pri : T.border,
                opacity: i < step ? .45 : 1,
                transition:"background .35s,opacity .35s"}}/>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".04em",textTransform:"uppercase",
                color: i === step ? T.pri : i < step ? T.mfg : T.xfg,
                transition:"color .35s"}}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── STEP 0 ── */}
      {step === 0 && (
        <OnboardCard T={T}>
          {isK ? (
            <>
              <h2 style={{fontSize:24,fontWeight:800,letterSpacing:"-.03em",color:T.fg,marginBottom:8}}>Kreator tipini seç</h2>
              <p style={{fontSize:14,color:T.mfg,marginBottom:24}}>Platforma profili bu seçimə əsasən hazırlanır.</p>
              <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:28}}>
                {[{id:"podcast",emoji:"🎙",title:"Podkastçı",desc:"Audio/video podcast yaradıram"},
                  {id:"atlet",  emoji:"🏃",title:"Atlet",    desc:"İdman, fitness, sağlam həyat"},
                  {id:"tedbird",emoji:"🎪",title:"Tədbir",   desc:"Konfrans, festival, event"},
                ].map(opt=>(
                  <button key={opt.id} onClick={()=>setKreType(opt.id)}
                    style={{display:"flex",alignItems:"center",gap:16,padding:"16px 20px",
                      background:kreType===opt.id?T.p10:T.card2,
                      border:`1.5px solid ${kreType===opt.id?T.pri:T.border}`,
                      borderRadius:14,cursor:"pointer",transition:"all .18s",textAlign:"left",width:"100%",fontFamily:T.f}}>
                    <span style={{fontSize:28}}>{opt.emoji}</span>
                    <div>
                      <div style={{fontSize:15,fontWeight:700,color:T.fg,marginBottom:2}}>{opt.title}</div>
                      <div style={{fontSize:13,color:T.mfg}}>{opt.desc}</div>
                    </div>
                    {kreType===opt.id && <div style={{marginLeft:"auto",color:T.pri}}><IcoCheck size={18}/></div>}
                  </button>
                ))}
              </div>
              <div style={{display:"flex",gap:10}}>
                <NavBtn T={T} onClick={next} variant="primary" disabled={!kreType}>Davam et →</NavBtn>
              </div>
            </>
          ) : (
            <>
              <h2 style={{fontSize:24,fontWeight:800,letterSpacing:"-.03em",color:T.fg,marginBottom:8}}>Brend haqqında</h2>
              <p style={{fontSize:14,color:T.mfg,marginBottom:24}}>Kreatorlar sizin haqqınızda bu məlumatları görəcək.</p>
              <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:28}}>
                <FieldInput T={T} label="Şirkətin adı" id="ob-co"
                  placeholder="Şirkətin adı" value={company}
                  onChange={e=>setCompany(e.target.value)}
                  error={tCo ? validate.req(company) : ""} touched={tCo}/>
                <FieldInput T={T} label="Sənaye" id="ob-sec"
                  placeholder="Texnologiya, Qida, Moda..." value={sector}
                  onChange={e=>setSector(e.target.value)}
                  error="" touched={false}/>
              </div>
              <div style={{display:"flex",gap:10}}>
                <NavBtn T={T} onClick={()=>{setTCo(true);if(company)next();}} variant="primary">Davam et →</NavBtn>
              </div>
            </>
          )}
        </OnboardCard>
      )}

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <OnboardCard T={T}>
          {isK ? (
            <>
              <h2 style={{fontSize:24,fontWeight:800,letterSpacing:"-.03em",color:T.fg,marginBottom:8}}>Profil məlumatları</h2>
              <p style={{fontSize:14,color:T.mfg,marginBottom:24}}>Sponsorlara özünü tanıt.</p>
              <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:28}}>
                <FieldInput T={T} label="Bio" id="ob-bio"
                  placeholder="Özünüzü qısaca tanıdın..."
                  value={bio} onChange={e=>setBio(e.target.value)} error="" touched={false}/>
                <FieldInput T={T} label="Sosial media linki" id="ob-lnk"
                  placeholder="instagram.com/username"
                  value={link} onChange={e=>setLink(e.target.value)} error="" touched={false}/>
                <FieldInput T={T} label="Auditoriya həcmi" id="ob-aud"
                  placeholder="10,000+ dinləyici"
                  value={audience} onChange={e=>setAudience(e.target.value)} error="" touched={false}/>
              </div>
            </>
          ) : (
            <>
              <h2 style={{fontSize:24,fontWeight:800,letterSpacing:"-.03em",color:T.fg,marginBottom:8}}>Hədəf auditoriya</h2>
              <p style={{fontSize:14,color:T.mfg,marginBottom:24}}>Hansı kreator tipləri sizi maraqlandırır?</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:28}}>
                {["Podkast","Atlet","Tədbir","Fitness","Tech","Moda","Qida","Musiqi","Oyun"].map(tag=>(
                  <button key={tag} onClick={()=>toggleTag(tag)}
                    style={{fontFamily:T.f,fontSize:13,fontWeight:600,padding:"9px 18px",borderRadius:100,cursor:"pointer",
                      border:`1.5px solid ${tags.includes(tag)?T.pri:T.border}`,
                      background:tags.includes(tag)?T.p10:T.card2,
                      color:tags.includes(tag)?T.pri:T.mfg,transition:"all .15s"}}>
                    {tag}
                  </button>
                ))}
              </div>
            </>
          )}
          <div style={{display:"flex",gap:10}}>
            <NavBtn T={T} onClick={back}>← Geri</NavBtn>
            <NavBtn T={T} onClick={next} variant="primary">Davam et →</NavBtn>
          </div>
        </OnboardCard>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <OnboardCard T={T}>
          <div style={{textAlign:"center",padding:"8px 0 4px"}}>
            <div style={{width:72,height:72,borderRadius:"50%",background:T.p10,border:`2px solid ${T.p30}`,
              display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:32}}>🎉</div>
            <h2 style={{fontSize:28,fontWeight:800,letterSpacing:"-.03em",color:T.fg,marginBottom:8}}>Hazırsınız!</h2>
            <p style={{fontSize:15,color:T.mfg,lineHeight:1.7,maxWidth:340,margin:"0 auto 28px"}}>
              Profiliniz yaradıldı. İndi dashboard-a keçin və ilk{" "}
              {isK ? "sponsorluq paketinizi yaradın" : "kreator axtarışına başlayın"}.
            </p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:28}}>
              {[["✅","Profil tamamlandı"],["🔒","Escrow aktivdir"],["🤖","AI hazırdır"]].map(([e,l])=>(
                <div key={l} style={{background:T.card2,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 10px",textAlign:"center"}}>
                  <div style={{fontSize:22,marginBottom:6}}>{e}</div>
                  <div style={{fontSize:11,color:T.mfg,fontWeight:600,lineHeight:1.3}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:10}}>
              <NavBtn T={T} onClick={back}>← Geri</NavBtn>
              <NavBtn T={T} onClick={()=>{onComplete();goTo("dashboard");}} variant="primary">Dashboarda keç →</NavBtn>
            </div>
          </div>
        </OnboardCard>
      )}
    </div>
  );
}

// ══════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════
function Dashboard({T,user,goTo,onLogout,light,toggle}) {
  const [tab,setTab] = useState("overview");
  const isK = user?.role === "kreator";

  const initials = user?.avatar || "U";

  const SIDEBAR = [
    {id:"overview",  icon:<IcoGrid/>,   label:"Ümumi baxış"},
    {id:"deals",     icon:<IcoDeal/>,   label:"Deal-lar"},
    {id:"messages",  icon:<IcoMsg/>,    label:"Mesajlar", badge:3},
    {id:"payments",  icon:<IcoCash/>,   label:"Ödənişlər"},
    {id:"profile",   icon:<IcoUser/>,   label:"Profil"},
    {id:"settings",  icon:<IcoSettings/>,label:"Parametrlər"},
  ];

  return (
    <div style={{minHeight:"100svh",display:"flex",background:T.bg,fontFamily:T.f}}>

      {/* SIDEBAR */}
      <aside style={{width:220,flexShrink:0,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",position:"sticky",top:0,height:"100svh",overflowY:"auto"}}>
        {/* Logo */}
        <div style={{padding:"20px 20px 16px",borderBottom:`1px solid ${T.border}`}}>
          <button onClick={()=>goTo("home")} style={{fontFamily:T.f,fontSize:16,fontWeight:800,letterSpacing:"-.04em",color:T.fg,background:"none",border:"none",cursor:"pointer",padding:0}}>
            Antism<span style={{color:T.pri}}>.</span>
          </button>
        </div>

        {/* User pill */}
        <div style={{padding:"14px 16px",borderBottom:`1px solid ${T.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:T.pri,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:T.priFg,flexShrink:0}}>{initials.toUpperCase()}</div>
            <div style={{overflow:"hidden"}}>
              <div style={{fontSize:13,fontWeight:700,color:T.fg,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user?.name}</div>
              <div style={{fontSize:11,color:T.pri,fontWeight:600,textTransform:"capitalize"}}>{isK?"Kreator":"Sponsor"}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{padding:"10px 10px",flex:1}}>
          {SIDEBAR.map(item=>(
            <button key={item.id} onClick={()=>setTab(item.id)}
              style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"9px 12px",borderRadius:10,marginBottom:2,
                background:tab===item.id?T.p10:"none",
                border:`1px solid ${tab===item.id?T.p20:"transparent"}`,
                color:tab===item.id?T.pri:T.mfg,cursor:"pointer",fontFamily:T.f,fontSize:13,fontWeight:600,
                transition:"all .15s",textAlign:"left"}}>
              {item.icon}
              <span style={{flex:1}}>{item.label}</span>
              {item.badge && <span style={{fontSize:10,fontWeight:700,color:T.priFg,background:T.pri,borderRadius:100,padding:"2px 7px"}}>{item.badge}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{padding:"10px 10px",borderTop:`1px solid ${T.border}`}}>
          <button onClick={()=>{onLogout();goTo("home");}}
            style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"9px 12px",borderRadius:10,
              background:"none",border:"none",color:T.mfg,cursor:"pointer",fontFamily:T.f,fontSize:13,transition:"color .15s"}}>
            <IcoLogout/> Çıxış
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{flex:1,overflowY:"auto",minWidth:0}}>
        {/* Topbar */}
        <header style={{height:58,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 28px",borderBottom:`1px solid ${T.border}`,position:"sticky",top:0,background:T.bg,zIndex:10,backdropFilter:"blur(12px)"}}>
          <div>
            <h1 style={{fontSize:16,fontWeight:800,color:T.fg,letterSpacing:"-.02em"}}>
              {{overview:"Ümumi Baxış",deals:"Deal-lar",messages:"Mesajlar",payments:"Ödənişlər",profile:"Profil",settings:"Parametrlər"}[tab]}
            </h1>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {/* Search */}
            <div style={{display:"flex",alignItems:"center",gap:8,background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:"7px 12px"}}>
              <IcoSearch/>
              <input placeholder="Axtar..." style={{background:"none",border:"none",outline:"none",fontSize:13,color:T.fg,width:130}} />
            </div>
            {/* Theme toggle */}
            <button onClick={toggle}
              style={{width:36,height:36,borderRadius:8,background:T.card,border:`1px solid ${T.border}`,cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center",color:T.mfg,flexShrink:0}}>
              {light ? <IcoSun/> : <IcoMoon/>}
            </button>
            {/* Notif */}
            <button style={{position:"relative",width:36,height:36,borderRadius:8,background:T.card,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",color:T.mfg,cursor:"pointer"}}>
              <IcoBell/>
              <span style={{position:"absolute",top:6,right:6,width:7,height:7,borderRadius:"50%",background:T.pri}}/>
            </button>
          </div>
        </header>

        {/* Content */}
        <div style={{padding:28}} className="fadein" key={tab}>
          {tab === "overview"  && <DashOverview  T={T} user={user} setTab={setTab} isK={isK}/>}
          {tab === "deals"     && <DashDeals     T={T} isK={isK}/>}
          {tab === "messages"  && <DashMessages  T={T}/>}
          {tab === "payments"  && <DashPayments  T={T}/>}
          {tab === "profile"   && <DashProfile   T={T} user={user}/>}
          {tab === "settings"  && <DashSettings  T={T}/>}
        </div>
      </main>
    </div>
  );
}

// ── STAT CARD ──
const StatCard = ({T,label,value,sub,icon,trend}) => (
  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"22px 24px"}}>
    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14}}>
      <div style={{width:38,height:38,borderRadius:10,background:T.p10,border:`1px solid ${T.p20}`,display:"flex",alignItems:"center",justifyContent:"center",color:T.pri}}>
        {icon}
      </div>
      {trend && <span style={{fontSize:12,fontWeight:700,color:T.ok,display:"flex",alignItems:"center",gap:3}}><IcoTrend/>{trend}</span>}
    </div>
    <div style={{fontSize:28,fontWeight:800,letterSpacing:"-.03em",color:T.fg,marginBottom:3}}>{value}</div>
    <div style={{fontSize:13,fontWeight:600,color:T.fg,marginBottom:2}}>{label}</div>
    {sub && <div style={{fontSize:12,color:T.mfg}}>{sub}</div>}
  </div>
);

// ── DEAL ROW ──
const DealRow = ({T,name,type,status,amount,date}) => {
  const statusCfg = {
    pending:   {label:"Gözləyir",   bg:T.p10, color:T.pri},
    active:    {label:"Aktiv",      bg:T.okBg, color:T.ok},
    completed: {label:"Tamamlandı", bg:T.a10,  color:T.acc},
    review:    {label:"Baxışda",    bg:T.p10,  color:T.pri},
  };
  const s = statusCfg[status] || statusCfg.pending;
  return (
    <div style={{display:"flex",alignItems:"center",gap:16,padding:"14px 0",borderBottom:`1px solid ${T.border}`}}>
      <div style={{width:40,height:40,borderRadius:10,background:T.p10,display:"flex",alignItems:"center",justifyContent:"center",color:T.pri,fontSize:18,flexShrink:0}}>{type}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:14,fontWeight:600,color:T.fg,marginBottom:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{name}</div>
        <div style={{fontSize:12,color:T.mfg}}>{date}</div>
      </div>
      <span style={{fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:100,background:s.bg,color:s.color,whiteSpace:"nowrap"}}>{s.label}</span>
      <div style={{fontSize:14,fontWeight:700,color:T.fg,textAlign:"right",minWidth:60}}>{amount}</div>
    </div>
  );
};

// ── OVERVIEW ──
function DashOverview({T,user,setTab,isK}) {
  const stats = isK
    ? [{label:"Ümumi Qazanc",value:"₼4,820",sub:"Bu ay",icon:<IcoCash/>,trend:"+18%"},
       {label:"Aktiv Deallar",value:"3",sub:"2 yenisi",icon:<IcoDeal/>,trend:"+2"},
       {label:"Ortalama Reytinq",value:"4.8",sub:"12 rəy",icon:<IcoStar/>,trend:"+0.2"},
       {label:"Profil Baxışı",value:"342",sub:"Bu həftə",icon:<IcoTrend/>,trend:"+24%"}]
    : [{label:"Ümumi Xərc",value:"₼12,400",sub:"Bu ay",icon:<IcoCash/>,trend:"+5%"},
       {label:"Aktiv Deallar",value:"5",sub:"3 tamamlandı",icon:<IcoDeal/>,trend:"+1"},
       {label:"Ortalama ROI",value:"3.4×",sub:"Son 90 gün",icon:<IcoTrend/>,trend:"+0.4×"},
       {label:"Kreator Sayı",value:"8",sub:"Partner",icon:<IcoUser/>,trend:"+3"}];

  const deals = [
    {name:"TechTalk Podcast — Mid-roll",type:"🎙",status:"active",amount:"₼800",date:"15 Mar 2025"},
    {name:"StartupBaku Konfrans",type:"🎪",status:"pending",amount:"₼5,000",date:"22 Mar 2025"},
    {name:"FitLife AZ — Instagram",type:"🏃",status:"completed",amount:"₼1,200",date:"10 Mar 2025"},
    {name:"FinansAZ — Sponsorlu epizod",type:"🎙",status:"review",amount:"₼2,400",date:"8 Mar 2025"},
  ];

  return (
    <div>
      <div style={{marginBottom:24}}>
        <h2 style={{fontSize:22,fontWeight:800,letterSpacing:"-.03em",color:T.fg,marginBottom:4}}>Salam, {user?.name?.split(" ")[0]} 👋</h2>
        <p style={{fontSize:14,color:T.mfg}}>Son aktivlik — bu gün</p>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:28}} className="col1">
        {stats.map((s,i)=><StatCard key={i} T={T} {...s}/>)}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr",gap:14}} className="col1">
        {/* Recent deals */}
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:24}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
            <h3 style={{fontSize:15,fontWeight:700,color:T.fg}}>Son Deal-lar</h3>
            <button onClick={()=>setTab("deals")} style={{fontFamily:T.f,fontSize:12,color:T.pri,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Hamısına bax →</button>
          </div>
          {deals.map((d,i)=><DealRow key={i} T={T} {...d}/>)}
        </div>

        {/* Quick actions */}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:24}}>
            <h3 style={{fontSize:15,fontWeight:700,color:T.fg,marginBottom:16}}>Sürətli əməliyyatlar</h3>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {(isK
                ? [["🎙 Yeni paket yarat","Sponsorlara təklif"],["📊 Statistika bax","Gəlir analizi"],["⭐ Rəyləri gör","Müştəri rəyləri"]]
                : [["🔍 Kreator axtar","AI ilə tap"],["💬 Mesaj göndər","Deal danışığı"],["📋 Hesabat al","ROI analizi"]]
              ).map(([title,desc],i)=>(
                <button key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:T.card2,border:`1px solid ${T.border}`,borderRadius:10,cursor:"pointer",fontFamily:T.f,textAlign:"left",transition:"border-color .15s"}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:T.fg}}>{title}</div>
                    <div style={{fontSize:11,color:T.mfg}}>{desc}</div>
                  </div>
                  <IcoChevron dir="right" size={12}/>
                </button>
              ))}
            </div>
          </div>

          {/* Completion nudge */}
          <div style={{background:T.p10,border:`1px solid ${T.p20}`,borderRadius:16,padding:20}}>
            <div style={{fontSize:13,fontWeight:700,color:T.fg,marginBottom:6}}>Profil tamamlama</div>
            <div style={{height:6,borderRadius:100,background:T.border,overflow:"hidden",marginBottom:10}}>
              <div style={{height:"100%",width:"68%",background:T.pri,borderRadius:100}}/>
            </div>
            <div style={{fontSize:12,color:T.mfg}}>68% tamamlandı — <span style={{color:T.pri,cursor:"pointer",fontWeight:600}}>Tamamla →</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── DEALS ──
function DashDeals({T,isK}) {
  const [filter,setFilter] = useState("Hamısı");
  const filters = ["Hamısı","Aktiv","Gözləyir","Tamamlandı","İptal"];
  const deals = [
    {name:"TechTalk Podcast — Mid-roll (60 san)",type:"🎙",status:"active",amount:"₼800",date:"15 Mar 2025",partner:"BrandX"},
    {name:"StartupBaku Konfrans — Banner",type:"🎪",status:"pending",amount:"₼5,000",date:"22 Mar 2025",partner:"TechCorp"},
    {name:"FitLife AZ — Instagram post ×3",type:"🏃",status:"completed",amount:"₼1,200",date:"10 Mar 2025",partner:"SportBrand"},
    {name:"FinansAZ — Sponsorlu epizod",type:"🎙",status:"review",amount:"₼2,400",date:"8 Mar 2025",partner:"FinCo"},
    {name:"Bakı Marafonu — Titulaq sponsor",type:"🏃",status:"pending",amount:"₼8,000",date:"1 Apr 2025",partner:"MegaBank"},
  ];
  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <h2 style={{fontSize:20,fontWeight:800,color:T.fg,letterSpacing:"-.02em"}}>Bütün Deal-lar</h2>
        <button style={{fontFamily:T.f,fontSize:13,fontWeight:700,color:T.priFg,background:T.pri,border:"none",borderRadius:8,padding:"9px 18px",cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
          <IcoPlus/> Yeni Deal
        </button>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        {filters.map(f=>(
          <button key={f} onClick={()=>setFilter(f)}
            style={{fontFamily:T.f,fontSize:12,fontWeight:600,padding:"7px 14px",borderRadius:100,cursor:"pointer",
              border:`1px solid ${filter===f?T.pri:T.border}`,
              background:filter===f?T.pri:T.card,color:filter===f?T.priFg:T.mfg,transition:"all .15s"}}>
            {f}
          </button>
        ))}
      </div>
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,overflow:"hidden"}}>
        <div style={{padding:"0 24px"}}>
          {deals.map((d,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:16,padding:"16px 0",borderBottom:i<deals.length-1?`1px solid ${T.border}`:"none"}}>
              <div style={{width:44,height:44,borderRadius:12,background:T.p10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{d.type}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:600,color:T.fg,marginBottom:2}}>{d.name}</div>
                <div style={{fontSize:12,color:T.mfg}}>{d.partner} · {d.date}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:15,fontWeight:700,color:T.fg,marginBottom:4}}>{d.amount}</div>
                <span style={{fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:100,
                  background:{active:T.okBg,pending:T.p10,completed:T.a10,review:T.p10}[d.status]||T.p10,
                  color:{active:T.ok,pending:T.pri,completed:T.acc,review:T.pri}[d.status]||T.pri}}>
                  {{active:"Aktiv",pending:"Gözləyir",completed:"Tamamlandı",review:"Baxışda"}[d.status]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── MESSAGES ──
function DashMessages({T}) {
  const [active,setActive] = useState(0);
  const threads = [
    {name:"TechTalk Podcast",avatar:"TT",last:"Salam, paket haqqında sualım var",time:"12:34",unread:2},
    {name:"BrandX",avatar:"BX",last:"Anlaşdıq, şərtlər qəbul edildi",time:"11:02",unread:0},
    {name:"StartupBaku",avatar:"SB",last:"Zəhmət olmasa invoice göndər",time:"Dün",unread:1},
    {name:"FitLife AZ",avatar:"FL",last:"Möhtəşəm əməkdaşlıq oldu!",time:"2 gün",unread:0},
  ];
  const msgs = [
    {from:"them",text:"Salam! Sponsorluq paketiniz haqqında ətraflı məlumat ala bilərəmmi?",time:"12:20"},
    {from:"me",text:"Əlbəttə! Hansı paket sizi maraqlandırır?",time:"12:22"},
    {from:"them",text:"Mid-roll seçimi çox maraqlı görünür. 60 saniydə nə qədər məlumat verə bilərsiniz?",time:"12:30"},
    {from:"them",text:"Salam, paket haqqında sualım var",time:"12:34"},
  ];
  return (
    <div style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:0,height:"calc(100svh - 110px)",background:T.card,border:`1px solid ${T.border}`,borderRadius:16,overflow:"hidden"}}>
      {/* Thread list */}
      <div style={{borderRight:`1px solid ${T.border}`,overflowY:"auto"}}>
        <div style={{padding:"16px 16px 12px",borderBottom:`1px solid ${T.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:8,background:T.card2,border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 12px"}}>
            <IcoSearch/><input placeholder="Axtar..." style={{background:"none",border:"none",outline:"none",fontSize:13,color:T.fg,flex:1}}/>
          </div>
        </div>
        {threads.map((t,i)=>(
          <div key={i} onClick={()=>setActive(i)}
            style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",cursor:"pointer",
              background:active===i?T.p10:"none",borderBottom:`1px solid ${T.border}`,transition:"background .15s"}}>
            <div style={{width:38,height:38,borderRadius:"50%",background:T.pri,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:T.priFg,flexShrink:0}}>{t.avatar}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:13,fontWeight:700,color:T.fg}}>{t.name}</span>
                <span style={{fontSize:11,color:T.mfg}}>{t.time}</span>
              </div>
              <div style={{fontSize:12,color:T.mfg,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.last}</div>
            </div>
            {t.unread>0 && <span style={{width:18,height:18,borderRadius:"50%",background:T.pri,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:T.priFg,flexShrink:0}}>{t.unread}</span>}
          </div>
        ))}
      </div>
      {/* Chat */}
      <div style={{display:"flex",flexDirection:"column"}}>
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:36,height:36,borderRadius:"50%",background:T.pri,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:T.priFg}}>{threads[active].avatar}</div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:T.fg}}>{threads[active].name}</div>
            <div style={{fontSize:12,color:T.ok}}>● Online</div>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"20px",display:"flex",flexDirection:"column",gap:12}}>
          {msgs.map((m,i)=>(
            <div key={i} style={{display:"flex",justifyContent:m.from==="me"?"flex-end":"flex-start"}}>
              <div style={{maxWidth:"68%",padding:"10px 14px",borderRadius:m.from==="me"?"16px 16px 4px 16px":"16px 16px 16px 4px",
                background:m.from==="me"?T.pri:T.card2,
                color:m.from==="me"?T.priFg:T.fg,fontSize:14,lineHeight:1.5}}>
                {m.text}
                <div style={{fontSize:11,opacity:.6,marginTop:4,textAlign:"right"}}>{m.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{padding:"12px 16px",borderTop:`1px solid ${T.border}`,display:"flex",gap:10}}>
          <input placeholder="Mesaj yazın..." style={{flex:1,background:T.card2,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 14px",fontSize:14,color:T.fg,outline:"none"}}/>
          <button style={{fontFamily:T.f,fontSize:13,fontWeight:700,color:T.priFg,background:T.pri,border:"none",borderRadius:10,padding:"10px 20px",cursor:"pointer"}}>Göndər</button>
        </div>
      </div>
    </div>
  );
}

// ── PAYMENTS ──
function DashPayments({T}) {
  const rows = [
    {desc:"TechTalk — Mid-roll",date:"15 Mar",amount:"₼800",fee:"₼240",net:"₼560",status:"completed"},
    {desc:"FitLife AZ — Instagram ×3",date:"10 Mar",amount:"₼1,200",fee:"₼360",net:"₼840",status:"completed"},
    {desc:"FinansAZ — Sponsorlu epizod",date:"8 Mar",amount:"₼2,400",fee:"₼720",net:"₼1,680",status:"escrow"},
    {desc:"StartupBaku — Titulaq",date:"1 Apr",amount:"₼5,000",fee:"₼1,500",net:"₼3,500",status:"pending"},
  ];
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:28}} className="col1">
        <StatCard T={T} label="Ümumi Qazanc" value="₼4,820" sub="Bu ay" icon={<IcoCash/>} trend="+18%"/>
        <StatCard T={T} label="Escrow-da" value="₼1,680" sub="Buraxılacaq" icon={<IcoLock/>}/>
        <StatCard T={T} label="Komissyon" value="₼1,320" sub="Bu ay ödənildi" icon={<IcoTrend/>}/>
      </div>
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,overflow:"hidden"}}>
        <div style={{padding:"16px 24px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <h3 style={{fontSize:15,fontWeight:700,color:T.fg}}>Ödəniş tarixçəsi</h3>
          <button style={{fontFamily:T.f,fontSize:12,color:T.pri,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>İxrac et →</button>
        </div>
        <div style={{padding:"0 24px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 100px 100px 100px 90px",gap:10,padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
            {["Açıqlama","Tarix","Ümumi","Komissyon","Neto"].map(h=>(
              <div key={h} style={{fontSize:11,fontWeight:700,color:T.mfg,textTransform:"uppercase",letterSpacing:".08em"}}>{h}</div>
            ))}
          </div>
          {rows.map((r,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 100px 100px 100px 90px",gap:10,padding:"14px 0",borderBottom:i<rows.length-1?`1px solid ${T.border}`:"none",alignItems:"center"}}>
              <div>
                <div style={{fontSize:14,fontWeight:600,color:T.fg,marginBottom:2}}>{r.desc}</div>
                <span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:100,
                  background:{completed:T.okBg,escrow:T.p10,pending:T.a10}[r.status],
                  color:{completed:T.ok,escrow:T.pri,pending:T.mfg}[r.status]}}>
                  {{completed:"Ödənilib",escrow:"Escrow",pending:"Gözləyir"}[r.status]}
                </span>
              </div>
              <div style={{fontSize:13,color:T.mfg}}>{r.date}</div>
              <div style={{fontSize:14,fontWeight:600,color:T.fg}}>{r.amount}</div>
              <div style={{fontSize:14,color:T.err}}>-{r.fee}</div>
              <div style={{fontSize:14,fontWeight:700,color:T.ok}}>{r.net}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── PROFILE ──
function DashProfile({T,user}) {
  const [name,setName]   = useState(user?.name||"");
  const [bio,setBio]     = useState("Azərbaycanın ən çox dinlənilən tech podkastçısı. Həftəlik epizodlar, 22K+ dinləyici.");
  const [saved,setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),2000); };
  return (
    <div style={{maxWidth:680}}>
      {/* Avatar section */}
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:28,marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:24}}>
          <div style={{width:72,height:72,borderRadius:"50%",background:T.pri,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:800,color:T.priFg,flexShrink:0}}>{(user?.avatar||"U").toUpperCase()}</div>
          <div>
            <div style={{fontSize:18,fontWeight:800,color:T.fg,marginBottom:3}}>{user?.name}</div>
            <div style={{fontSize:13,color:T.pri,fontWeight:600,textTransform:"capitalize",marginBottom:8}}>{user?.role==="kreator"?"Kreator":"Sponsor"}</div>
            <button style={{fontFamily:T.f,fontSize:12,fontWeight:600,display:"inline-flex",alignItems:"center",gap:6,color:T.mfg,background:T.card2,border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 12px",cursor:"pointer"}}>
              <IcoUpload/> Şəkil yüklə
            </button>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <FieldInput T={T} label="Ad Soyad" id="p-name" value={name} onChange={e=>setName(e.target.value)} error="" touched={false}/>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            <label style={{fontSize:13,fontWeight:600,color:T.fg}}>Bio</label>
            <textarea value={bio} onChange={e=>setBio(e.target.value)} rows={3}
              style={{fontFamily:T.f,fontSize:15,color:T.fg,background:T.input,border:`1.5px solid ${T.border}`,borderRadius:10,padding:"12px 16px",resize:"vertical",outline:"none"}}/>
          </div>
        </div>
      </div>

      {/* Paketlər */}
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:28,marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <h3 style={{fontSize:15,fontWeight:700,color:T.fg}}>Paketlərim</h3>
          <button style={{fontFamily:T.f,fontSize:12,fontWeight:700,color:T.priFg,background:T.pri,border:"none",borderRadius:8,padding:"7px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
            <IcoPlus size={12}/> Yeni
          </button>
        </div>
        {[["Mid-roll (60 san)","₼800","Aktiv"],["Sponsorlu epizod","₼2,400","Aktiv"],["Aylıq paket","₼6,500","Deaktiv"]].map(([n,p,s],i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 16px",background:T.card2,border:`1px solid ${T.border}`,borderRadius:12,marginBottom:8}}>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:600,color:T.fg}}>{n}</div>
            </div>
            <div style={{fontSize:14,fontWeight:700,color:T.pri}}>{p}</div>
            <span style={{fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:100,
              background:s==="Aktiv"?T.okBg:T.border,color:s==="Aktiv"?T.ok:T.mfg}}>{s}</span>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:10}}>
        <BtnPrimary T={T} onClick={save}>{saved?"✓ Yadda saxlandı":"Dəyişiklikləri saxla"}</BtnPrimary>
        <button style={{fontFamily:T.f,fontSize:14,color:T.mfg,background:"none",border:`1px solid ${T.border}`,borderRadius:10,padding:"12px 20px",cursor:"pointer"}}>Ləğv et</button>
      </div>
    </div>
  );
}

// ── SETTINGS ──
function DashSettings({T}) {
  const [notif,setNotif]   = useState({email:true,push:false,deals:true});
  const [privacy,setPrivacy] = useState({public:true});
  const Toggle = ({val,onChange}) => (
    <button onClick={()=>onChange(!val)}
      style={{width:44,height:24,borderRadius:100,background:val?T.pri:T.border,border:"none",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
      <span style={{position:"absolute",top:3,left:val?22:3,width:18,height:18,borderRadius:"50%",background:"white",transition:"left .2s",display:"block"}}/>
    </button>
  );
  const Row = ({label,desc,val,onChange}) => (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0",borderBottom:`1px solid ${T.border}`}}>
      <div>
        <div style={{fontSize:14,fontWeight:600,color:T.fg}}>{label}</div>
        <div style={{fontSize:12,color:T.mfg,marginTop:2}}>{desc}</div>
      </div>
      <Toggle val={val} onChange={onChange}/>
    </div>
  );
  return (
    <div style={{maxWidth:580}}>
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:28,marginBottom:14}}>
        <h3 style={{fontSize:15,fontWeight:700,color:T.fg,marginBottom:4}}>Bildirişlər</h3>
        <p style={{fontSize:13,color:T.mfg,marginBottom:16}}>Hansı hallarda xəbər almaq istəyirsiniz</p>
        <Row label="E-poçt bildirişləri" desc="Deal yenilikləri e-poçtla göndərilsin" val={notif.email} onChange={v=>setNotif(n=>({...n,email:v}))}/>
        <Row label="Push bildirişlər" desc="Brauzer bildirişlərini aktiv et" val={notif.push} onChange={v=>setNotif(n=>({...n,push:v}))}/>
        <Row label="Yeni deal xəbərdarlığı" desc="Sizə uyğun deal gəldikdə xəbər ver" val={notif.deals} onChange={v=>setNotif(n=>({...n,deals:v}))}/>
      </div>
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:28,marginBottom:14}}>
        <h3 style={{fontSize:15,fontWeight:700,color:T.fg,marginBottom:4}}>Məxfilik</h3>
        <p style={{fontSize:13,color:T.mfg,marginBottom:16}}>Profilinizin görünürlüyünü idarə edin</p>
        <Row label="İctimai profil" desc="Sponsorlar profilinizi görə bilsin" val={privacy.public} onChange={v=>setPrivacy(p=>({...p,public:v}))}/>
      </div>
      <div style={{background:T.errBg,border:`1px solid ${T.err}`,borderRadius:16,padding:24}}>
        <h3 style={{fontSize:14,fontWeight:700,color:T.err,marginBottom:8}}>Hesabı sil</h3>
        <p style={{fontSize:13,color:T.mfg,marginBottom:14}}>Bu əməliyyat geri qaytarıla bilməz. Bütün məlumatlar silinəcək.</p>
        <button style={{fontFamily:T.f,fontSize:13,fontWeight:700,color:T.err,background:"none",border:`1px solid ${T.err}`,borderRadius:8,padding:"9px 18px",cursor:"pointer"}}>Hesabı sil</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// LANDING PAGES (kompakt versiya — tam işləyir)
// ══════════════════════════════════════════
function PageHome({T,goTo}) {
  const [sel,setSel]=useState(0);
  const pkgs=[["Mid-roll (60 san)","₼800"],["Sponsorlu epizod","₼2,400"],["Aylıq paket (×4)","₼6,500"]];
  return (
    <div>
      <section style={{minHeight:"100svh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"140px 24px 100px",position:"relative",overflow:"hidden",background:T.bg}}>
        <div style={{position:"absolute",inset:0,pointerEvents:"none",backgroundImage:`linear-gradient(oklch(1 0 0/0.028) 1px,transparent 1px),linear-gradient(90deg,oklch(1 0 0/0.028) 1px,transparent 1px)`,backgroundSize:"72px 72px",WebkitMaskImage:"radial-gradient(ellipse 65% 55% at 50% 44%,black,transparent)"}}/>
        <div style={{position:"absolute",inset:0,pointerEvents:"none",background:`radial-gradient(ellipse 54% 42% at 50% 36%,${T.p10},transparent 65%)`}}/>
        <div className="r1" style={{display:"inline-flex",alignItems:"center",gap:8,color:T.pri,border:`1px solid ${T.p30}`,borderRadius:100,padding:"7px 16px",marginBottom:36,fontSize:11,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase"}}>
          <span className="bdot" style={{width:5,height:5,borderRadius:"50%",background:T.pri,flexShrink:0,display:"inline-block"}}/>
          Azərbaycanın sponsorluq platforması
        </div>
        <h1 className="r2" style={{fontSize:"clamp(58px,8.5vw,116px)",fontWeight:800,lineHeight:.9,letterSpacing:"-.04em",maxWidth:980,margin:"0 auto 28px",color:T.fg}}>
          Kreatorları<br/>brendlərlə<br/><span style={{color:T.pri}}>birləşdiririk</span>
        </h1>
        <p className="r3" style={{fontSize:15,fontWeight:300,lineHeight:1.75,color:T.mfg,maxWidth:400,margin:"0 auto 44px"}}>
          Podkastlar, atletlər, tədbirlər — sponsorluq almaq artıq sadədir.
        </p>
        <div className="r4" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,flexWrap:"wrap"}}>
          <button onClick={()=>goTo("qeydiyyat")} style={{fontFamily:T.f,fontSize:15,fontWeight:700,color:T.priFg,background:T.pri,border:"none",borderRadius:10,padding:"14px 28px",cursor:"pointer"}}>Kreator kimi qoşul →</button>
          <button onClick={()=>goTo("sponsorlar")} style={{fontFamily:T.f,fontSize:15,fontWeight:500,color:T.fg,background:"none",border:`1px solid ${T.border}`,borderRadius:10,padding:"14px 28px",cursor:"pointer"}}>Sponsor kimi axtar</button>
        </div>
      </section>

      <div style={{borderTop:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}`,background:T.card}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",maxWidth:1120,margin:"0 auto"}} className="col1">
          {[["500+","Aktiv Kreator"],["₼2M+","Deal həcmi"],["98%","Tamamlanma"],["30%","Komisyon"]].map(([n,l],i)=>(
            <div key={i} style={{padding:"32px 40px",borderRight:i<3?`1px solid ${T.border}`:"none"}}>
              <div style={{fontSize:40,fontWeight:800,letterSpacing:"-.04em",lineHeight:1,marginBottom:4,color:T.fg}}>
                {n.replace(/[+%M+]/g,"")}<span style={{color:T.pri}}>{n.match(/\+|%|M\+/)?.[0]}</span>
              </div>
              <div style={{fontSize:13,color:T.mfg}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Kreator types */}
      <div style={{padding:"96px 0",background:T.bg}}>
        <div className="wrap" style={{maxWidth:1120,margin:"0 auto",padding:"0 44px"}}>
          <Eyebrow T={T}>Kreator tipləri</Eyebrow>
          <h2 style={{fontSize:"clamp(30px,4vw,50px)",fontWeight:800,letterSpacing:"-.03em",marginBottom:48,color:T.fg}}>Hər kreator üçün<br/><span style={{color:T.pri}}>yer var</span></h2>
          <div className="col1" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {[
              {kick:"Podcast",title:"Podkastçılar",desc:"Pre-roll, mid-roll, sponsorlu epizodlar.",tags:["Spotify","YouTube"],img:"https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=700&q=80&auto=format"},
              {kick:"İdman",title:"Atletlər",desc:"Sosial media, brend geyim, canlı görünüş.",tags:["Instagram","TikTok"],img:"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=700&q=80&auto=format"},
              {kick:"Tədbir",title:"Tədbirlər",desc:"Konfrans sponsorluğu, banner, aktivasiya.",tags:["Banner","Konfrans"],img:"https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&q=80&auto=format"},
            ].map((item,i)=>(
              <article key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,overflow:"hidden",transition:"border-color .3s,transform .3s",cursor:"pointer"}}>
                <div style={{height:190,position:"relative",overflow:"hidden"}}>
                  <img src={item.img} alt={item.title} loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",opacity:.52,filter:"saturate(.35) brightness(.72)"}}/>
                  <div style={{position:"absolute",inset:0,background:`linear-gradient(to top,${T.card} 6%,transparent 55%)`}}/>
                </div>
                <div style={{padding:"20px 26px 28px"}}>
                  <div style={{fontSize:11,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:T.pri,marginBottom:6}}>{item.kick}</div>
                  <h3 style={{fontSize:20,fontWeight:700,letterSpacing:"-.02em",marginBottom:8,color:T.fg}}>{item.title}</h3>
                  <p style={{fontSize:14,fontWeight:300,lineHeight:1.7,color:T.mfg}}>{item.desc}</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:14}}>
                    {item.tags.map(t=><span key={t} style={{fontSize:11,fontWeight:500,padding:"4px 10px",borderRadius:100,background:T.card2,color:T.mfg,border:`1px solid ${T.border}`}}>{t}</span>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* DEAL FLOW */}
      <div style={{background:T.card,borderTop:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}`,padding:"96px 0"}}>
        <div className="wrap" style={{maxWidth:1120,margin:"0 auto",padding:"0 44px"}}>
          <Eyebrow T={T}>Deal axışı</Eyebrow>
          <h2 style={{fontSize:"clamp(30px,4vw,50px)",fontWeight:800,letterSpacing:"-.03em",marginBottom:56,color:T.fg}}>Sıfır friksiya,<br/><span style={{color:T.pri}}>tam nəzarət</span></h2>
          <div className="col1" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:72,alignItems:"start"}}>
            <div>
              {[["01","Paket seç","Kreatorun hazır paketlərindən birini seç."],
                ["02","Təklif göndər","Brendin tələblərini, tarixi və büdcəni doldur."],
                ["03","Kreator qəbul edir","Razı deyilsə qarşı-təklif verə bilər."],
                ["04","Escrow ödəniş","Pul tamamlanana kimi platformada saxlanır."],
                ["05","Tamamlandı","Kreator 70%, platform 30% komissyon alır."],
              ].map(([n,title,desc],i)=>(
                <div key={i} style={{display:"flex",gap:18,padding:"18px 0",
                  borderBottom:`1px solid ${T.border}`,
                  borderTop:i===0?`1px solid ${T.border}`:"none"}}>
                  <span style={{fontSize:12,fontWeight:700,color:T.mfg,width:26,flexShrink:0,paddingTop:2}}>{n}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:15,fontWeight:600,color:i===0?T.pri:T.fg,marginBottom:3}}>{title}</div>
                    <div style={{fontSize:13,fontWeight:300,color:T.mfg,lineHeight:1.6}}>{desc}</div>
                  </div>
                  <div style={{width:7,height:7,borderRadius:"50%",background:i===0?T.pri:T.border,flexShrink:0,marginTop:5}}/>
                </div>
              ))}
            </div>
            {/* Interactive deal card */}
            <div style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:20,padding:28,position:"sticky",top:88}}>
              <div style={{display:"flex",alignItems:"center",gap:14,paddingBottom:18,marginBottom:18,borderBottom:`1px solid ${T.border}`}}>
                <div style={{width:46,height:46,borderRadius:12,overflow:"hidden",flexShrink:0}}>
                  <img src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=120&q=80&auto=format" alt="TechTalk"
                    style={{width:"100%",height:"100%",objectFit:"cover",filter:"saturate(0.6)"}}/>
                </div>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:T.fg}}>TechTalk Podcast</div>
                  <div style={{fontSize:12,color:T.mfg,marginTop:1}}>Podkastçı · Bakı · 22K dinləyici</div>
                </div>
                <div style={{marginLeft:"auto",fontSize:11,fontWeight:700,color:T.acc,background:T.a10,
                  border:`1px solid ${T.a25}`,borderRadius:100,padding:"4px 10px",whiteSpace:"nowrap"}}>Təsdiqlənib</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:18}}>
                {pkgs.map(([name,price],i)=>(
                  <div key={i} onClick={()=>setSel(i)}
                    style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                      background:sel===i?T.p10:T.card,
                      border:`1px solid ${sel===i?T.p30:T.border}`,
                      borderRadius:10,padding:"12px 16px",cursor:"pointer",transition:"all .2s"}}>
                    <span style={{fontSize:13,fontWeight:500,color:T.fg}}>{name}</span>
                    <span style={{fontSize:13,fontWeight:700,color:T.pri}}>{price}</span>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontSize:11,color:T.mfg,display:"flex",alignItems:"center",gap:5}}>
                  <IcoLock/>Escrow ilə qorunur
                </span>
                <button onClick={()=>goTo("qeydiyyat")}
                  style={{fontFamily:T.f,fontSize:13,fontWeight:700,color:T.priFg,background:T.pri,
                    border:"none",borderRadius:8,padding:"10px 18px",cursor:"pointer"}}>
                  Təklif Göndər
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{padding:"96px 0",background:T.bg}}>
        <div className="wrap" style={{maxWidth:1120,margin:"0 auto",padding:"0 44px"}}>
          <div className="cta-inner" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:28,padding:"80px 72px",textAlign:"center",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-100,left:"50%",transform:"translateX(-50%)",width:680,height:440,borderRadius:"50%",background:`radial-gradient(ellipse,${T.p10},transparent 65%)`,pointerEvents:"none"}}/>
            <h2 style={{fontSize:"clamp(40px,6vw,80px)",fontWeight:800,letterSpacing:"-.04em",lineHeight:.92,color:T.fg,position:"relative"}}>İndi<br/><span style={{color:T.pri}}>başla</span></h2>
            <p style={{fontSize:15,fontWeight:300,lineHeight:1.75,color:T.mfg,maxWidth:340,margin:"14px auto 0",position:"relative"}}>Kreatorsan profilini yarat, sponsorsan kreator tap.</p>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,flexWrap:"wrap",marginTop:32,position:"relative"}}>
              <button onClick={()=>goTo("qeydiyyat")} style={{fontFamily:T.f,fontSize:15,fontWeight:700,color:T.priFg,background:T.pri,border:"none",borderRadius:10,padding:"14px 28px",cursor:"pointer"}}>Kreator kimi qoşul →</button>
              <button onClick={()=>goTo("sponsorlar")} style={{fontFamily:T.f,fontSize:15,fontWeight:500,color:T.fg,background:"none",border:`1px solid ${T.border}`,borderRadius:10,padding:"14px 28px",cursor:"pointer"}}>Sponsor kimi axtar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stub pages for kreatorlar/sponsorlar/haqqimizda/elaqe
function InnerPage({T,goTo,title,kick,children}) {
  return (
    <div style={{background:T.bg,minHeight:"100svh"}}>
      <div style={{padding:"80px 44px 64px",position:"relative",overflow:"hidden",borderBottom:`1px solid ${T.border}`}}>
        <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 50% 80% at 18% 50%,${T.p10},transparent 65%)`,pointerEvents:"none"}}/>
        <div className="wrap" style={{maxWidth:1120,margin:"0 auto"}}>
          <div style={{position:"relative",maxWidth:600}}>
            <Eyebrow T={T}>{kick}</Eyebrow>
            <h1 style={{fontSize:"clamp(36px,4.8vw,60px)",fontWeight:800,lineHeight:.95,letterSpacing:"-.035em",color:T.fg}}>{title}</h1>
          </div>
        </div>
      </div>
      <div style={{padding:"72px 0 96px"}}>
        <div className="wrap" style={{maxWidth:1120,margin:"0 auto",padding:"0 44px"}}>
          {children}
        </div>
      </div>
    </div>
  );
}

function PageKreatorlar({T}) {
  const [filter,setFilter]=useState("Hamısı");
  const ks=[
    {type:"Podcast",name:"TechTalk Podcast",desc:"Tech, startup, innovasiya. Həftəlik epizodlar.",stats:[["22K","Dinləyici"],["4.8","Reytinq"]],price:"₼800-dən",badge:"Təsdiqlənib",img:"https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&q=80&auto=format"},
    {type:"Podcast",name:"FinansAZ",desc:"Şəxsi maliyyə, investisiya, iqtisadiyyat.",stats:[["15K","Dinləyici"],["4.6","Reytinq"]],price:"₼600-dən",badge:"Təsdiqlənib",img:"https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80&auto=format"},
    {type:"Atlet",name:"Bakı Marafonu",desc:"Ən böyük idman tədbirinin sponsorluq paketi.",stats:[["5K+","İştirakçı"],["50K+","Tamaşaçı"]],price:"₼3,000-dən",badge:"Premium",img:"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80&auto=format"},
    {type:"Tədbir",name:"StartupBaku",desc:"Azərbaycanın ən böyük startup konfransı.",stats:[["1,200+","İştirakçı"],["80+","Spiker"]],price:"₼5,000-dən",badge:"Təsdiqlənib",img:"https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80&auto=format"},
    {type:"Atlet",name:"FitLife AZ",desc:"Fitness, qidalanma. Instagram + TikTok.",stats:[["38K","Follower"],["7.2%","Engagement"]],price:"₼1,200-dən",badge:"Aktiv",img:"https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80&auto=format"},
    {type:"Podcast",name:"TarixAZ",desc:"Azərbaycan tarixi, mədəniyyəti, incəsənəti.",stats:[["9K","Dinləyici"],["4.9","Reytinq"]],price:"₼400-dən",badge:"Yeni",img:"https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&q=80&auto=format"},
  ];
  const tmap={"Hamısı":null,"Podkastçılar":"Podcast","Atletlər":"Atlet","Tədbirlər":"Tədbir"};
  const vis=ks.filter(k=>!tmap[filter]||k.type===tmap[filter]);
  return (
    <InnerPage T={T} kick="Kreatorlar" title={<>Azərbaycanın ən yaxşı<br/><span style={{color:T.pri}}>kreatorları</span></>}>
      <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
        {["Hamısı","Podkastçılar","Atletlər","Tədbirlər"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{fontFamily:T.f,fontSize:12,fontWeight:600,padding:"7px 16px",borderRadius:100,cursor:"pointer",border:`1px solid ${filter===f?T.pri:T.border}`,background:filter===f?T.pri:T.card,color:filter===f?T.priFg:T.mfg,transition:"all .15s"}}>{f}</button>
        ))}
      </div>
      <div className="col1" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
        {vis.map((k,i)=>(
          <article key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,overflow:"hidden",cursor:"pointer"}}>
            <div style={{height:155,position:"relative",overflow:"hidden"}}>
              <img src={k.img} alt={k.name} loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",opacity:.55,filter:"saturate(.4) brightness(.7)"}}/>
              <div style={{position:"absolute",inset:0,background:`linear-gradient(to top,${T.card} 5%,transparent 55%)`}}/>
            </div>
            <div style={{padding:"16px 20px 20px"}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:T.pri,marginBottom:4}}>{k.type}</div>
              <div style={{fontSize:17,fontWeight:700,letterSpacing:"-.02em",marginBottom:6,color:T.fg}}>{k.name}</div>
              <div style={{fontSize:13,color:T.mfg,marginBottom:12}}>{k.desc}</div>
              <div style={{display:"flex",gap:14,marginBottom:12}}>
                {k.stats.map(([v,l])=><div key={l} style={{fontSize:12,color:T.mfg}}><strong style={{display:"block",fontSize:14,fontWeight:700,color:T.fg}}>{v}</strong>{l}</div>)}
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontSize:14,fontWeight:700,color:T.pri}}>{k.price}</span>
                <span style={{fontSize:10,fontWeight:700,color:T.acc,background:T.a10,border:`1px solid ${T.a25}`,borderRadius:100,padding:"3px 8px"}}>{k.badge}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </InnerPage>
  );
}

function PageSponsorlar({T,goTo}) {
  return (
    <InnerPage T={T} kick="Sponsorlar üçün" title={<>Brendinizi doğru<br/><span style={{color:T.pri}}>auditoriyaya çatdırın</span></>}>
      <div className="col1" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:60}}>
        {[["AI ilə tap","Büdcə, sahə, auditoriya — AI ən uyğun kreatorları sıralayır."],["Escrow qorunma","Ödəniş yalnız iş tamamlandıqda buraxılır."],["Real analytics","Reach, engagement, ROI — real-time dashboard."],["Dəstək","Hər sponsor üçün dedicated account manager."]].map(([t,d])=>(
          <div key={t} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:28}}>
            <div style={{width:36,height:36,borderRadius:9,background:T.p10,border:`1px solid ${T.p20}`,marginBottom:14}}/>
            <div style={{fontSize:16,fontWeight:700,color:T.fg,marginBottom:6}}>{t}</div>
            <div style={{fontSize:13,fontWeight:300,color:T.mfg,lineHeight:1.65}}>{d}</div>
          </div>
        ))}
      </div>
      <div className="col1" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
        {[{n:"Starter",v:"Pulsuz",s:"Qoşulun, kreatorlara baxın.",btn:"Başla",page:"qeydiyyat",feat:false},
          {n:"Business",v:"30%",s:"deal həcmindən komisyon",btn:"Başla →",page:"qeydiyyat",feat:true},
          {n:"Enterprise",v:"Fərdi",s:"Böyük büdcə üçün",btn:"Əlaqə",page:"elaqe",feat:false}].map((p,i)=>(
          <div key={i} style={{background:T.card,border:`2px solid ${p.feat?T.pri:T.border}`,borderRadius:20,padding:28,position:"relative"}}>
            {p.feat&&<div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:T.pri,color:T.priFg,fontSize:10,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",padding:"4px 14px",borderRadius:100,whiteSpace:"nowrap"}}>Tövsiyə edilir</div>}
            <div style={{fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:p.feat?T.pri:T.mfg,marginBottom:10}}>{p.n}</div>
            <div style={{fontSize:38,fontWeight:800,letterSpacing:"-.03em",lineHeight:1,marginBottom:4,color:T.fg}}>{p.v}</div>
            <div style={{fontSize:13,color:T.mfg,marginBottom:20}}>{p.s}</div>
            <button onClick={()=>goTo(p.page)} style={{fontFamily:T.f,fontSize:14,fontWeight:700,width:"100%",padding:12,borderRadius:10,cursor:"pointer",
              background:p.feat?T.pri:"none",color:p.feat?T.priFg:T.mfg,
              border:p.feat?"none":`1px solid ${T.border}`}}>{p.btn}</button>
          </div>
        ))}
      </div>
    </InnerPage>
  );
}

function PageHaqqimizda({T,goTo}) {
  return (
    <InnerPage T={T} kick="Haqqımızda" title={<>Azərbaycanda sponsorluğu<br/><span style={{color:T.pri}}>yenidən qururuq</span></>}>
      <div className="col1" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:72,alignItems:"center",marginBottom:72}}>
        <div>
          <Eyebrow T={T}>Misiyamız</Eyebrow>
          <h2 style={{fontSize:"clamp(26px,3.2vw,40px)",fontWeight:800,letterSpacing:"-.03em",marginBottom:16,color:T.fg}}>Kreatorları gücləndir,<br/><span style={{color:T.pri}}>brendlərə dəyər ver</span></h2>
          <p style={{fontSize:15,fontWeight:300,lineHeight:1.75,color:T.mfg,marginBottom:24}}>Antism creator iqtisadiyyatının Azərbaycanda lazımi infrastrukturdan məhrum olduğunu görərək 2024-cü ildə quruldu.</p>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>goTo("qeydiyyat")} style={{fontFamily:T.f,fontSize:14,fontWeight:700,color:T.priFg,background:T.pri,border:"none",borderRadius:10,padding:"12px 22px",cursor:"pointer"}}>Qoşulun</button>
            <button onClick={()=>goTo("elaqe")} style={{fontFamily:T.f,fontSize:14,color:T.fg,background:"none",border:`1px solid ${T.border}`,borderRadius:10,padding:"12px 22px",cursor:"pointer"}}>Əlaqə</button>
          </div>
        </div>
        <div style={{borderRadius:20,overflow:"hidden",border:`1px solid ${T.border}`,height:360}}>
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format" alt="Komanda" loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",opacity:.6,filter:"saturate(.4)"}}/>
        </div>
      </div>
      <div className="col1" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
        {[{n:"Əli Hüseynov",r:"Qurucu & CEO",img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format"},
          {n:"Leyla Məmmədova",r:"CTO",img:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&auto=format"},
          {n:"Murad İsmayılov",r:"Head of Growth",img:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&auto=format"}].map((m,i)=>(
          <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:24,textAlign:"center"}}>
            <div style={{width:64,height:64,borderRadius:"50%",overflow:"hidden",margin:"0 auto 12px",border:`2px solid ${T.border}`}}>
              <img src={m.img} alt={m.n} loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",filter:"saturate(.5)"}}/>
            </div>
            <div style={{fontSize:15,fontWeight:700,color:T.fg}}>{m.n}</div>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:T.mfg,marginTop:3}}>{m.r}</div>
          </div>
        ))}
      </div>
    </InnerPage>
  );
}

function PageElaqe({T,toast}) {
  const [f,setF]=useState({ad:"",email:"",msg:""});
  const [t2,setT2]=useState({});
  const errs={ad:validate.name(f.ad),email:validate.email(f.email),msg:validate.req(f.msg)};
  const touch=k=>setT2(v=>({...v,[k]:true}));
  const submit=()=>{setT2({ad:true,email:true,msg:true});if(!Object.values(errs).some(Boolean)){toast("Mesajınız göndərildi!",true);}};
  return (
    <InnerPage T={T} kick="Əlaqə" title={<>Bizimlə<br/><span style={{color:T.pri}}>danışın</span></>}>
      <div className="col1" style={{display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:52}}>
        <div>
          <p style={{fontSize:15,fontWeight:300,lineHeight:1.75,color:T.mfg,marginBottom:24}}>İş günlərində 09:00–18:00 arası cavablandırırıq.</p>
          {[["E-poçt","salam@antism.com"],["Telefon","+994 12 555 00 00"],["Ünvan","Nizami küç. 65, Bakı"]].map(([l,v])=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:14,background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18,marginBottom:10}}>
              <div style={{width:38,height:38,borderRadius:10,background:T.p10,border:`1px solid ${T.p20}`,flexShrink:0}}/>
              <div>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:T.mfg,marginBottom:2}}>{l}</div>
                <div style={{fontSize:14,fontWeight:500,color:T.fg}}>{v}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,padding:32}}>
          <h3 style={{fontSize:18,fontWeight:700,color:T.fg,marginBottom:20}}>Mesaj göndərin</h3>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <FieldInput T={T} label="Ad Soyad" id="c-ad" value={f.ad} onChange={e=>{setF(v=>({...v,ad:e.target.value}));touch("ad")}} error={errs.ad} touched={t2.ad} placeholder="Adınız"/>
              <FieldInput T={T} label="E-poçt" id="c-em" type="email" value={f.email} onChange={e=>{setF(v=>({...v,email:e.target.value}));touch("email")}} error={errs.email} touched={t2.email} placeholder="ad@nümunə.com"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <label style={{fontSize:13,fontWeight:600,color:T.fg}}>Mesaj</label>
              <textarea value={f.msg} onChange={e=>{setF(v=>({...v,msg:e.target.value}));touch("msg")}} rows={4} placeholder="Mesajınızı yazın..."
                style={{fontFamily:T.f,fontSize:14,color:T.fg,background:T.input,border:`1.5px solid ${t2.msg&&errs.msg?T.err:T.border}`,borderRadius:10,padding:"12px 16px",resize:"vertical",outline:"none"}}/>
              {t2.msg&&errs.msg&&<span className="slideup" style={{fontSize:12,color:T.err}}>⚠ {errs.msg}</span>}
            </div>
            <BtnPrimary T={T} onClick={submit}>Göndər →</BtnPrimary>
          </div>
        </div>
      </div>
    </InnerPage>
  );
}

// ══════════════════════════════════════════
// LEGAL PAGES
// ══════════════════════════════════════════
function PageSertler({T}) {
  const Section = ({title,children}) => (
    <div style={{marginBottom:36}}>
      <h2 style={{fontSize:18,fontWeight:700,color:T.fg,marginBottom:12,letterSpacing:"-.02em"}}>{title}</h2>
      <p style={{fontSize:15,fontWeight:300,color:T.mfg,lineHeight:1.8}}>{children}</p>
    </div>
  );
  return (
    <InnerPage T={T} kick="Hüquqi" title={<>İstifadə<br/><span style={{color:T.pri}}>Şərtləri</span></>}>
      <div style={{maxWidth:720}}>
        <p style={{fontSize:13,color:T.mfg,marginBottom:40}}>Son yenilənmə: 1 Yanvar 2025</p>
        <Section title="1. Qəbul">
          Antism platformasından istifadə edərək bu şərtləri tam qəbul etmiş sayılırsınız. Razı olmasanız, xidmətdən istifadə etməyin.
        </Section>
        <Section title="2. Xidmətin təsviri">
          Antism kreatorlar ilə sponsorlar arasında sponsorluq əməliyyatlarını asanlaşdıran bir platformadır. Platform hər tamamlanan deal üçün 30% komissyon alır.
        </Section>
        <Section title="3. Hesab məsuliyyəti">
          Hesab məlumatlarınızın məxfiliyini qorumaq tamamilə sizin məsuliyyətinizdədir. Hesabınızda baş verən bütün əməliyyatlara görə siz məsuliyyət daşıyırsınız.
        </Section>
        <Section title="4. Ödəniş və escrow">
          Bütün ödənişlər Stripe vasitəsilə işlənir. Ödənişlər deal tamamlanana kimi escrow hesabında saxlanır. Ləğv edilmiş deal-larda qaytarma siyasəti tətbiq olunur.
        </Section>
        <Section title="5. Qadağan olunmuş davranış">
          Aldatma, spam, saxta kreator profili, platformanın sui-istifadəsi qəti qadağandır. Pozuntular hesabın dərhal bağlanmasına səbəb olar.
        </Section>
        <Section title="6. Dəyişikliklər">
          Antism bu şərtləri istənilən vaxt dəyişdirmək hüququna malikdir. Əhəmiyyətli dəyişikliklər e-poçt vasitəsilə bildirilər.
        </Section>
        <Section title="7. Əlaqə">
          Suallarınız üçün: salam@antism.com
        </Section>
      </div>
    </InnerPage>
  );
}

function PageMexfilik({T}) {
  const Section = ({title,children}) => (
    <div style={{marginBottom:36}}>
      <h2 style={{fontSize:18,fontWeight:700,color:T.fg,marginBottom:12,letterSpacing:"-.02em"}}>{title}</h2>
      <p style={{fontSize:15,fontWeight:300,color:T.mfg,lineHeight:1.8}}>{children}</p>
    </div>
  );
  return (
    <InnerPage T={T} kick="Hüquqi" title={<>Məxfilik<br/><span style={{color:T.pri}}>Siyasəti</span></>}>
      <div style={{maxWidth:720}}>
        <p style={{fontSize:13,color:T.mfg,marginBottom:40}}>Son yenilənmə: 1 Yanvar 2025</p>
        <Section title="1. Topladığımız məlumatlar">
          Qeydiyyat zamanı ad, e-poçt, rol məlumatları toplanır. Platform istifadəsi zamanı davranış məlumatları (tıklamalar, baxışlar) anonim şəkildə analiz edilir.
        </Section>
        <Section title="2. Məlumatların istifadəsi">
          Məlumatlarınız yalnız platformanın işləməsi, sizinlə əlaqə, xidmətin təkmilləşdirilməsi məqsədilə istifadə olunur. Üçüncü tərəflərə satılmır.
        </Section>
        <Section title="3. Ödəniş məlumatları">
          Kart məlumatları Antism serverlərində saxlanmır. Bütün ödəniş məlumatları Stripe tərəfindən PCI DSS standartlarına uyğun şəkildə işlənir.
        </Section>
        <Section title="4. Çərəzlər (cookies)">
          Oturum idarəetməsi və analitika üçün çərəzlərdən istifadə edirik. Brauzer parametrlərindən çərəzləri deaktiv edə bilərsiniz.
        </Section>
        <Section title="5. Məlumatlarınızın silinməsi">
          Hesabınızı silmək istədiyiniz zaman bütün şəxsi məlumatlarınız 30 gün ərzində sistemdən tamamilə silinir.
        </Section>
        <Section title="6. Əlaqə">
          Məxfilik ilə bağlı suallar üçün: mexfilik@antism.com
        </Section>
      </div>
    </InnerPage>
  );
}

// ══════════════════════════════════════════
// APP ROOT
// ══════════════════════════════════════════
export default function App() {
  const [page,setPage]   = useState("home");
  const [scrolled,setScrolled] = useState(false);
  const [user,setUser]   = useState(null);
  const { light, toggle, T } = useTheme();
  const { msg, ok, show, toast } = useToast();

  const goTo = useCallback((id) => {
    setPage(id);
    try { window.scrollTo({top:0,behavior:"instant"}); } catch(e){}
  }, []);

  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>20);
    window.addEventListener("scroll",fn,{passive:true});
    return ()=>window.removeEventListener("scroll",fn);
  },[]);

  const PAGE_MAP = {
    home:       <PageHome         T={T} goTo={goTo} toast={toast}/>,
    giris:      <PageGiris        T={T} goTo={goTo} onLogin={setUser}/>,
    qeydiyyat:  <PageQeydiyyat    T={T} goTo={goTo} onLogin={setUser}/>,
    onboarding: <PageOnboarding   T={T} user={user} goTo={goTo} onComplete={()=>{}} light={light} toggle={toggle}/>,
    dashboard:  <Dashboard        T={T} user={user} goTo={goTo} onLogout={()=>setUser(null)} light={light} toggle={toggle}/>,
    kreatorlar: <PageKreatorlar   T={T} goTo={goTo}/>,
    sponsorlar: <PageSponsorlar   T={T} goTo={goTo}/>,
    haqqimizda: <PageHaqqimizda   T={T} goTo={goTo}/>,
    elaqe:      <PageElaqe        T={T} goTo={goTo} toast={toast}/>,
    sertler:    <PageSertler      T={T} goTo={goTo}/>,
    mexfilik:   <PageMexfilik     T={T} goTo={goTo}/>,
  };

  const hideFooter = ["dashboard","onboarding","giris","qeydiyyat"].includes(page);

  return (
    <div style={{background:T.bg,color:T.fg,minHeight:"100svh",fontFamily:T.f}}>
      <style>{GLOBAL_CSS}</style>

      <Nav T={T} goTo={goTo} light={light} toggle={toggle} scrolled={scrolled} page={page} user={user}/>

      <div style={{paddingTop:["home","dashboard","onboarding"].includes(page)?0:62}}>
        {PAGE_MAP[page] || PAGE_MAP.home}
        {!hideFooter && <Footer T={T} goTo={goTo}/>}
      </div>

      {/* TOAST */}
      <div style={{position:"fixed",bottom:28,left:"50%",transform:`translateX(-50%) translateY(${show?0:80}px)`,
        background:T.card,border:`1px solid ${ok?T.ok:T.err}`,borderRadius:12,padding:"13px 20px",
        fontSize:14,fontWeight:500,display:"flex",alignItems:"center",gap:10,zIndex:9999,
        boxShadow:T.shadow2,transition:"transform .38s cubic-bezier(.4,0,.2,1),opacity .38s",
        opacity:show?1:0,color:T.fg,pointerEvents:"none",whiteSpace:"nowrap"}}>
        <span style={{width:7,height:7,borderRadius:"50%",background:ok?T.ok:T.err,flexShrink:0,display:"inline-block"}}/>
        {msg}
      </div>
    </div>
  );
}
