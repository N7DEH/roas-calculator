import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const CATEGORIES = {
  "Fine Jewellery":      { avgRoas: 2.4, avgCvr: 0.6,  avgAov: 780, returnRate: 12, resaleable: 85 },
  "Premium Fashion":     { avgRoas: 2.8, avgCvr: 1.1,  avgAov: 320, returnRate: 22, resaleable: 40 },
  "Luxury Homeware":     { avgRoas: 2.6, avgCvr: 0.9,  avgAov: 410, returnRate: 17, resaleable: 60 },
  "Premium Gifting":     { avgRoas: 3.1, avgCvr: 1.4,  avgAov: 195, returnRate: 14, resaleable: 30 },
  "High-End Beauty":     { avgRoas: 3.4, avgCvr: 1.8,  avgAov: 145, returnRate: 8,  resaleable: 20 },
  "Artisan Food & Drink":{ avgRoas: 3.6, avgCvr: 2.1,  avgAov: 95,  returnRate: 5,  resaleable: 0  },
  "Premium Wellness":    { avgRoas: 2.9, avgCvr: 1.2,  avgAov: 260, returnRate: 10, resaleable: 20 },
  "Luxury Pet Products": { avgRoas: 3.2, avgCvr: 1.6,  avgAov: 130, returnRate: 9,  resaleable: 50 },
};

const CURRENCIES = ["£", "$", "€"];

const TOOLTIPS = {
  price:        "The full price your customer pays, including any VAT/tax if applicable.",
  cogs:         "What it costs you to produce or purchase one unit — materials, manufacturing, supplier cost. Exclude shipping.",
  shipping:     "What you actually pay to ship one order out. If you offer free shipping, enter your carrier cost.",
  returnRate:   "The % of orders that come back. We've pre-filled an industry average for your category — adjust to match your reality.",
  returnShip:   "Enter the cost if you cover return postage. Leave at 0 if the customer pays.",
  processFee:   "Stripe/PayPal charge roughly 2.9%. Check your payment provider statement for your exact rate.",
  adSpend:      "Your total monthly spend on Google Ads — not including agency fees, just the raw media spend.",
  reportedRoas: "The ROAS number shown in your Google Ads dashboard. This is what we're stress-testing.",
  vat:          "If your price already includes VAT (most UK/EU retail prices do), toggle this on. We'll strip the VAT before calculating your true revenue.",
  agencyFee:    "If you pay an agency (including us) a % of ad spend, this is a real acquisition cost. Including it gives you the true all-in break-even.",
  resaleable:   "After a return, what % of that stock can you actually resell at full price? Luxury fashion might be 40%, fine jewellery 85%, food 0%.",
  ltv:          "If your customers come back and buy again, your first-order break-even matters less. Enter realistic numbers — this changes the whole picture.",
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const f2 = n => isFinite(n) ? n.toFixed(2) : "0.00";
const f0 = n => isFinite(n) ? Math.abs(n).toFixed(0) : "0";
const fX = n => isFinite(n) ? `${Math.abs(n).toFixed(2)}x` : "0.00x";

function useAnimatedValue(target, duration = 550) {
  const [val, setVal] = useState(target);
  const prev = useRef(target);
  const raf  = useRef(null);
  useEffect(() => {
    const start = prev.current, end = target, t0 = performance.now();
    const tick = now => {
      const p = Math.min((now - t0) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(start + (end - start) * e);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else prev.current = target;
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return val;
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function Tooltip({ text }) {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", marginLeft: 5 }}>
      <span
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(v => !v)}
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 14, height: 14, borderRadius: "50%",
          border: "1px solid rgba(201,169,110,0.3)", color: "rgba(201,169,110,0.5)",
          fontSize: "0.55rem", cursor: "help", flexShrink: 0, userSelect: "none",
        }}
      >?</span>
      {open && (
        <span style={{
          position: "absolute", bottom: "calc(100% + 6px)", left: "50%",
          transform: "translateX(-50%)", width: 220, padding: "8px 10px",
          background: "#1e1a14", border: "1px solid rgba(201,169,110,0.2)",
          borderRadius: 3, fontSize: "0.68rem", color: "#9a9080",
          lineHeight: 1.5, zIndex: 100, pointerEvents: "none",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        }}>{text}</span>
      )}
    </span>
  );
}

function Field({ label, tooltip, children }) {
  return (
    <div style={{ marginBottom: "1.2rem" }}>
      <div style={{
        display: "flex", alignItems: "center", marginBottom: "0.35rem",
      }}>
        <label style={{
          fontSize: "0.68rem", letterSpacing: "0.11em", textTransform: "uppercase",
          color: "#7a7060", fontFamily: "var(--font-serif)", fontWeight: 500,
        }}>{label}</label>
        {tooltip && <Tooltip text={tooltip} />}
      </div>
      {children}
    </div>
  );
}

function NumberInput({ value, onChange, prefix, suffix, step = "1", min = 0, max }) {
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      {prefix && (
        <span style={{
          position: "absolute", left: "0.85rem", color: "#c9a96e",
          fontFamily: "var(--font-serif)", fontSize: "1rem", pointerEvents: "none", zIndex: 1,
        }}>{prefix}</span>
      )}
      <input
        type="number" value={value} min={min} max={max} step={step}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(201,169,110,0.18)",
          borderRadius: 2, outline: "none", transition: "border-color .2s, background .2s",
          padding: prefix ? "0.65rem 0.85rem 0.65rem 1.9rem" : suffix ? "0.65rem 2.2rem 0.65rem 0.85rem" : "0.65rem 0.85rem",
          color: "#f0ebe0", fontFamily: "var(--font-serif)", fontSize: "1.05rem",
          WebkitAppearance: "none", MozAppearance: "textfield",
        }}
        onFocus={e => { e.target.style.borderColor = "rgba(201,169,110,.5)"; e.target.style.background = "rgba(201,169,110,.035)"; }}
        onBlur={e =>  { e.target.style.borderColor = "rgba(201,169,110,.18)"; e.target.style.background = "rgba(255,255,255,.03)"; }}
      />
      {suffix && (
        <span style={{
          position: "absolute", right: "0.85rem", color: "#7a7060",
          fontFamily: "var(--font-serif)", fontSize: "0.82rem", pointerEvents: "none",
        }}>{suffix}</span>
      )}
    </div>
  );
}

function Toggle({ value, onChange, label }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        display: "flex", alignItems: "center", gap: 8, background: "none",
        border: "none", cursor: "pointer", padding: 0, color: value ? "#c9a96e" : "#5a5448",
        fontFamily: "var(--font-serif)", fontSize: "0.75rem", letterSpacing: "0.1em",
        textTransform: "uppercase", transition: "color .2s",
      }}
    >
      <span style={{
        width: 32, height: 18, borderRadius: 9, flexShrink: 0,
        background: value ? "rgba(201,169,110,0.25)" : "rgba(255,255,255,0.06)",
        border: `1px solid ${value ? "rgba(201,169,110,0.4)" : "rgba(255,255,255,0.1)"}`,
        position: "relative", transition: "all .2s", display: "block",
      }}>
        <span style={{
          position: "absolute", top: 2, left: value ? 14 : 2,
          width: 12, height: 12, borderRadius: "50%",
          background: value ? "#c9a96e" : "#4a4438",
          transition: "left .2s, background .2s",
        }} />
      </span>
      {label}
    </button>
  );
}

function SectionDivider({ icon, title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.1rem", marginTop: "1.6rem" }}>
      <span style={{ color: "#c9a96e", fontSize: "0.65rem", opacity: 0.6 }}>{icon}</span>
      <span style={{ fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#5a5040" }}>{title}</span>
      <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.08)" }} />
    </div>
  );
}

function MetricCard({ label, value, sub, tone = "neutral", large = false, topLine = false }) {
  const colors = { neutral: "#c9a96e", success: "#7ab87a", danger: "#c4605e", dim: "#6a6050" };
  const c = colors[tone] || colors.neutral;
  return (
    <div style={{
      padding: large ? "1.4rem" : "1rem 1.1rem",
      border: `1px solid ${topLine ? "rgba(201,169,110,.25)" : "rgba(255,255,255,.06)"}`,
      borderRadius: 2, background: topLine ? "rgba(201,169,110,.04)" : "rgba(255,255,255,.02)",
      position: "relative", overflow: "hidden",
    }}>
      {topLine && <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,#c9a96e,transparent)" }}/>}
      <div style={{ fontSize:"0.6rem",letterSpacing:"0.14em",textTransform:"uppercase",color:"#5a5040",marginBottom:"0.35rem",fontFamily:"var(--font-serif)" }}>{label}</div>
      <div style={{ fontSize: large ? "2.2rem" : "1.55rem", fontFamily:"var(--font-serif)", fontWeight:300, color: c, lineHeight:1, letterSpacing:"-0.02em" }}>{value}</div>
      {sub && <div style={{ fontSize:"0.64rem",color:"#4a4030",marginTop:"0.3rem",lineHeight:1.4 }}>{sub}</div>}
    </div>
  );
}

function RoasGauge({ current, breakEven, target }) {
  const max = Math.max(current * 1.4, target * 1.2, breakEven * 1.6, 6);
  const pct  = n => `${Math.min(Math.max((n / max) * 100, 0), 100)}%`;
  const isOk = current >= breakEven;
  return (
    <div>
      <div style={{ height: 6, background: "rgba(255,255,255,.05)", borderRadius: 3, position: "relative", marginBottom: "0.6rem" }}>
        {/* fill */}
        <div style={{ height:"100%", width: pct(current), borderRadius:3, transition:"width .55s cubic-bezier(.16,1,.3,1)",
          background: isOk ? "linear-gradient(90deg,#c9a96e,#e8cc8a)" : "linear-gradient(90deg,#8b4a4a,#c4605e)" }} />
        {/* break-even line */}
        <div style={{ position:"absolute",top:-4,left:pct(breakEven),width:2,height:14,background:"#c9a96e",transform:"translateX(-50%)",borderRadius:1, opacity:.7 }} />
        {/* target line */}
        <div style={{ position:"absolute",top:-2,left:pct(target),width:1,height:10,background:"#7ab87a",transform:"translateX(-50%)",borderRadius:1, opacity:.5 }} />
      </div>
      <div style={{ display:"flex",justifyContent:"space-between",fontSize:"0.58rem",color:"#4a4030",letterSpacing:"0.08em" }}>
        <span>0x</span>
        <span style={{ color:"rgba(201,169,110,.6)" }}>break-even {f2(breakEven)}x</span>
        <span style={{ color:"rgba(122,184,122,.5)" }}>target {f2(target)}x</span>
        <span>{f2(max)}x</span>
      </div>
    </div>
  );
}

function CostBar({ items, price }) {
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:"0.45rem" }}>
      {items.map(({ label, val, color }) => {
        const pct = Math.min((val / price) * 100, 100);
        return (
          <div key={label} style={{ display:"flex",alignItems:"center",gap:"0.8rem" }}>
            <div style={{ fontSize:"0.68rem",color:"#6a6055",width:160,flexShrink:0 }}>{label}</div>
            <div style={{ flex:1,height:3,background:"rgba(255,255,255,.04)",borderRadius:2 }}>
              <div style={{ height:"100%",width:`${pct}%`,background:color,borderRadius:2,opacity:.75,transition:"width .6s cubic-bezier(.16,1,.3,1)" }} />
            </div>
            <div style={{ fontSize:"0.72rem",color:"#8a8070",width:55,textAlign:"right",fontFamily:"var(--font-serif)" }}>£{f0(val)}</div>
            <div style={{ fontSize:"0.6rem",color:"#4a4030",width:38,textAlign:"right" }}>{pct.toFixed(1)}%</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN CALCULATOR ─────────────────────────────────────────────────────────

export default function ROASCalculator() {
  // Setup
  const [currency, setCurrency]     = useState("£");
  const [category, setCategory]     = useState("Fine Jewellery");
  const cat                          = CATEGORIES[category];

  // Core inputs
  const [price,       setPrice]       = useState(450);
  const [cogs,        setCogs]        = useState(135);
  const [shipping,    setShipping]    = useState(8);
  const [returnRate,  setReturnRate]  = useState(cat.returnRate);
  const [retShip,     setRetShip]     = useState(0);
  const [processFee,  setProcessFee]  = useState(2.9);
  const [adSpend,     setAdSpend]     = useState(2000);
  const [reportedRoas,setReportedRoas]= useState(3.2);
  const [vatOn,       setVatOn]       = useState(false);

  // Advanced inputs
  const [advanced,    setAdvanced]    = useState(false);
  const [agencyFee,   setAgencyFee]   = useState(12);
  const [resalePct,   setResalePct]   = useState(cat.resaleable);
  const [ltvOn,       setLtvOn]       = useState(false);
  const [purchPerYear,setPurchPerYear]= useState(1.8);
  const [yearsRetain, setYearsRetain] = useState(2);

  // Sync category defaults
  useEffect(() => {
    setReturnRate(CATEGORIES[category].returnRate);
    setResalePct(CATEGORIES[category].resaleable);
  }, [category]);

  // ── CALCULATIONS ──

  // VAT-stripped revenue per unit
  const netPrice = vatOn ? price / 1.2 : price;

  // Processing fee cost
  const processCost = (netPrice * processFee) / 100;

  // Return cost — fixed formula using resaleable %
  const unrecoverableCogs = cogs * (1 - (advanced ? resalePct : cat.resaleable) / 100);
  const returnCostPerOrder = (returnRate / 100) * (retShip + unrecoverableCogs);

  // Total variable cost per fulfilled order
  const totalVarCost = cogs + shipping + processCost + returnCostPerOrder;

  // Gross profit per sale (net of all variable costs, before ad spend)
  const grossProfit   = netPrice - totalVarCost;
  const grossMarginPct = netPrice > 0 ? (grossProfit / netPrice) * 100 : 0;

  // Break-even ROAS (pure): what ROAS covers all variable costs
  const breakEvenRoas = grossMarginPct > 0 ? (100 / grossMarginPct) : 999;

  // Add agency fee layer if advanced
  const totalAdCost = advanced
    ? adSpend * (1 + agencyFee / 100)
    : adSpend;

  // Performance at reported ROAS
  const currentRevenue = Math.max(adSpend * reportedRoas, 0.01);
  const currentOrders  = currentRevenue / (price > 0 ? price : 1);
  const adCostPerOrder = totalAdCost / (currentOrders > 0 ? currentOrders : 0.01);
  const trueProfit     = currentRevenue - totalAdCost - (currentOrders * totalVarCost);
  const profitPerOrder = currentOrders > 0 ? trueProfit / currentOrders : 0;
  const isProfitable   = trueProfit > 0;

  // Actual ROAS needed accounting for agency fee
  const trueBreakEven = advanced && agencyFee > 0
    ? breakEvenRoas * (1 + agencyFee / 100)
    : breakEvenRoas;

  // Target ROAS tiers
  const targetRoas    = trueBreakEven * 1.3;   // healthy
  const stretchRoas   = trueBreakEven * 1.6;   // strong

  // LTV calculations
  const ltv          = ltvOn ? price * purchPerYear * yearsRetain : null;
  const ltvProfit    = ltv ? ltv * (grossMarginPct / 100) : null;
  const maxCacForLtv = ltvProfit ? ltvProfit / 3 : null; // 3:1 LTV:CAC
  const ltvAdjBreak  = (maxCacForLtv && maxCacForLtv > 0) ? price / maxCacForLtv : null;

  // Gap
  const gap = reportedRoas - trueBreakEven;

  // Verdict
  const verdict = isProfitable
    ? gap > 0.6
      ? { label: "Profitable — Room to Scale",  tone: "success", color: "#7ab87a", text: `At a ${f2(reportedRoas)}x ROAS you're generating ${currency}${f0(Math.abs(profitPerOrder))} true profit per order. The ${f2(gap)}x buffer above break-even gives you room to increase spend strategically.` }
      : { label: "Profitable — Watch Closely",   tone: "warn",    color: "#c9a96e", text: `You're in profit but the margin of safety is thin at ${f2(gap)}x above break-even. One bad month of returns or a rising CPC could tip you negative.` }
    : { label: "Currently Loss-Making",          tone: "danger",  color: "#c4605e", text: `Despite a reported ROAS of ${f2(reportedRoas)}x, once all costs are included your actual break-even is ${f2(trueBreakEven)}x. You are losing ${currency}${f0(Math.abs(profitPerOrder))} on every ad-driven order.` };

  // Animated values for key outputs
  const animBreakEven = useAnimatedValue(isFinite(trueBreakEven) ? trueBreakEven : 0);
  const animProfit    = useAnimatedValue(isFinite(profitPerOrder) ? profitPerOrder : 0);
  const animMonthly   = useAnimatedValue(isFinite(trueProfit) ? trueProfit : 0);
  const animMargin    = useAnimatedValue(isFinite(grossMarginPct) ? grossMarginPct : 0);
  const animLtv       = useAnimatedValue(ltv ?? 0);
  const animLtvBreak  = useAnimatedValue(ltvAdjBreak ?? 0);

  // Cost bars data
  const costBars = [
    { label: "Cost of Goods (COGS)",   val: cogs,              color: "#8a8070" },
    { label: "Outbound Shipping",      val: shipping,          color: "#7a7060" },
    { label: "Payment Processing",     val: processCost,       color: "#6a6050" },
    { label: "Returns Allowance",      val: returnCostPerOrder,color: "#5a5040" },
    { label: "Ad Spend per Order",     val: adCostPerOrder,    color: "#c9a96e" },
    ...(advanced && agencyFee > 0 ? [{ label: "Agency Fee per Order", val: adCostPerOrder * (agencyFee/100), color: "#a07840" }] : []),
  ];

  // ── RENDER ──
  return (
    <div style={{ minHeight:"100vh", background:"#0e0c09", fontFamily:"var(--font-sans)", color:"#f0ebe0", position:"relative", overflowX:"hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        :root {
          --font-serif: 'Playfair Display', Georgia, serif;
          --font-sans:  'DM Sans', system-ui, sans-serif;
          --gold:  #c9a96e;
          --gold2: #e8cc8a;
          --bg:    #0e0c09;
          --bg2:   #141109;
          --line:  rgba(201,169,110,0.12);
        }
        * { box-sizing: border-box; margin:0; padding:0; }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button { -webkit-appearance:none; }
        input[type=number] { -moz-appearance:textfield; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:#0e0c09; }
        ::-webkit-scrollbar-thumb { background:#2a2318; border-radius:2px; }
        select { -webkit-appearance:none; appearance:none; }
        select option { background:#1a1510; }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fade-up { animation: fadeUp .45s cubic-bezier(.16,1,.3,1) both; }
        .fade-up-1 { animation-delay:.04s; }
        .fade-up-2 { animation-delay:.08s; }
        .fade-up-3 { animation-delay:.12s; }
        .fade-up-4 { animation-delay:.16s; }
        .fade-up-5 { animation-delay:.20s; }
        .fade-up-6 { animation-delay:.24s; }

        .adv-body {
          overflow: hidden;
          transition: max-height .4s cubic-bezier(.16,1,.3,1), opacity .35s ease;
        }
        .adv-body.open  { max-height: 700px; opacity: 1; }
        .adv-body.closed{ max-height: 0;     opacity: 0; }

        /* ── RESPONSIVE ── */
        .main-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
        }
        .full-row { grid-column: 1 / -1; }

        @media (max-width: 780px) {
          .main-grid { grid-template-columns: 1fr; }
          .metrics-grid-3 { grid-template-columns: 1fr 1fr !important; }
          .metrics-grid-2 { grid-template-columns: 1fr !important; }
          .strip-grid     { grid-template-columns: 1fr 1fr !important; }
          .cta-row        { flex-direction: column !important; }
          h1 { font-size: 2rem !important; }
        }
        @media (max-width: 480px) {
          .metrics-grid-3 { grid-template-columns: 1fr !important; }
          .strip-grid     { grid-template-columns: 1fr !important; }
          .currency-row   { gap: 0.3rem !important; }
        }
      `}</style>

      {/* Atmospheric glow */}
      <div style={{ position:"fixed",top:"-15%",right:"-8%",width:500,height:500,background:"radial-gradient(circle,rgba(201,169,110,.045) 0%,transparent 70%)",pointerEvents:"none",zIndex:0 }}/>
      <div style={{ position:"fixed",bottom:"-5%",left:"-5%",width:350,height:350,background:"radial-gradient(circle,rgba(201,169,110,.025) 0%,transparent 70%)",pointerEvents:"none",zIndex:0 }}/>

      <div style={{ position:"relative",zIndex:1,maxWidth:1100,margin:"0 auto",padding:"0 1.25rem 5rem" }}>

        {/* ── HEADER ── */}
        <header style={{ padding:"3rem 0 2.2rem", borderBottom:"1px solid var(--line)" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:"0.9rem" }}>
            <div style={{ width:20,height:1,background:"var(--gold)",opacity:.5 }}/>
            <span style={{ fontSize:"0.62rem",letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--gold)",opacity:.65,fontFamily:"var(--font-serif)" }}>Free Tool — Your Agency Name</span>
          </div>
          <h1 style={{ fontFamily:"var(--font-serif)",fontWeight:400,fontSize:"clamp(1.9rem,4.5vw,3.2rem)",lineHeight:1.1,letterSpacing:"-0.01em",marginBottom:"0.7rem",background:"linear-gradient(130deg,#f0ebe0 0%,#c9a96e 55%,#9a7238 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>
            Break-Even ROAS Calculator
          </h1>
          <p style={{ fontSize:"0.95rem",color:"#7a7060",maxWidth:520,lineHeight:1.7,fontStyle:"italic" }}>
            Your Google Ads dashboard reports a ROAS. This calculates the one that actually matters — the number you must beat before you make a single pound of real profit.
          </p>
        </header>

        {/* ── MAIN GRID ── */}
        <div className="main-grid" style={{ marginTop:2 }}>

          {/* ─── LEFT: INPUTS ─── */}
          <div style={{ background:"rgba(255,255,255,.015)",padding:"1.8rem",borderLeft:"1px solid var(--line)",borderBottom:"1px solid var(--line)" }}>

            {/* Currency + Category */}
            <SectionDivider icon="◈" title="Your Product" />

            <Field label="Currency">
              <div className="currency-row" style={{ display:"flex",gap:"0.5rem" }}>
                {CURRENCIES.map(c => (
                  <button key={c} onClick={() => setCurrency(c)} style={{
                    flex:1, padding:"0.6rem",
                    background: currency===c ? "rgba(201,169,110,.1)" : "rgba(255,255,255,.03)",
                    border: `1px solid ${currency===c ? "rgba(201,169,110,.45)" : "rgba(201,169,110,.13)"}`,
                    borderRadius:2, color: currency===c ? "#c9a96e" : "#5a5040",
                    cursor:"pointer", fontFamily:"var(--font-serif)", fontSize:"1rem", transition:"all .15s",
                  }}>{c}</button>
                ))}
              </div>
            </Field>

            <Field label="Product Category">
              <div style={{ position:"relative" }}>
                <select value={category} onChange={e => setCategory(e.target.value)} style={{
                  width:"100%", background:"rgba(255,255,255,.03)", border:"1px solid rgba(201,169,110,.18)",
                  borderRadius:2, padding:"0.65rem 2rem 0.65rem 0.85rem", color:"#f0ebe0",
                  fontFamily:"var(--font-sans)", fontSize:"0.92rem", outline:"none", cursor:"pointer",
                }}>
                  {Object.keys(CATEGORIES).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
                <span style={{ position:"absolute",right:"0.8rem",top:"50%",transform:"translateY(-50%)",color:"#5a5040",fontSize:"0.65rem",pointerEvents:"none" }}>▾</span>
              </div>
            </Field>

            <Field label="VAT / Tax">
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.6rem 0.85rem",background:"rgba(255,255,255,.02)",border:"1px solid rgba(201,169,110,.1)",borderRadius:2 }}>
                <span style={{ fontSize:"0.78rem",color:"#6a6050" }}>Price includes VAT / Sales Tax</span>
                <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <Tooltip text={TOOLTIPS.vat} />
                  <Toggle value={vatOn} onChange={setVatOn} label="" />
                </div>
              </div>
            </Field>

            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 1rem" }}>
              <Field label="Selling Price" tooltip={TOOLTIPS.price}>
                <NumberInput value={price} onChange={setPrice} prefix={currency} />
              </Field>
              <Field label="Cost of Goods" tooltip={TOOLTIPS.cogs}>
                <NumberInput value={cogs} onChange={setCogs} prefix={currency} />
              </Field>
            </div>

            <SectionDivider icon="◇" title="Fulfilment" />

            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 1rem" }}>
              <Field label="Outbound Shipping" tooltip={TOOLTIPS.shipping}>
                <NumberInput value={shipping} onChange={setShipping} prefix={currency} />
              </Field>
              <Field label="Return Rate" tooltip={TOOLTIPS.returnRate}>
                <NumberInput value={returnRate} onChange={setReturnRate} suffix="%" step="0.5" max={100} />
              </Field>
              <Field label="Return Shipping" tooltip={TOOLTIPS.returnShip}>
                <NumberInput value={retShip} onChange={setRetShip} prefix={currency} />
              </Field>
              <Field label="Processing Fee" tooltip={TOOLTIPS.processFee}>
                <NumberInput value={processFee} onChange={setProcessFee} suffix="%" step="0.1" />
              </Field>
            </div>

            <SectionDivider icon="◉" title="Ad Performance" />

            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 1rem" }}>
              <Field label="Monthly Ad Spend" tooltip={TOOLTIPS.adSpend}>
                <NumberInput value={adSpend} onChange={setAdSpend} prefix={currency} />
              </Field>
              <Field label="Reported ROAS" tooltip={TOOLTIPS.reportedRoas}>
                <NumberInput value={reportedRoas} onChange={setReportedRoas} suffix="x" step="0.1" min={0.1} />
              </Field>
            </div>

            <div style={{ padding:"0.75rem 0.9rem",background:"rgba(201,169,110,.03)",border:"1px solid rgba(201,169,110,.1)",borderRadius:2,marginTop:"0.2rem" }}>
              <p style={{ fontSize:"0.68rem",color:"#5a5040",lineHeight:1.6 }}>
                This is the number in your Google Ads dashboard — not your real profitability. That's what we calculate on the right.
              </p>
            </div>

            {/* ── ADVANCED SECTION ── */}
            <div style={{ marginTop:"1.6rem" }}>
              <button
                onClick={() => setAdvanced(v => !v)}
                style={{
                  width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
                  padding:"0.8rem 1rem", background: advanced ? "rgba(201,169,110,.06)" : "rgba(255,255,255,.02)",
                  border:`1px solid ${advanced ? "rgba(201,169,110,.25)" : "rgba(201,169,110,.1)"}`,
                  borderRadius:2, cursor:"pointer", transition:"all .2s", color: advanced ? "#c9a96e" : "#6a6050",
                }}
              >
                <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <span style={{ fontSize:"0.62rem",letterSpacing:"0.14em",textTransform:"uppercase",fontFamily:"var(--font-sans)" }}>Advanced Settings</span>
                  <span style={{ fontSize:"0.6rem",color: advanced ? "rgba(201,169,110,.6)" : "#4a4030",letterSpacing:"0.06em" }}>Agency fee · Resale rate · LTV</span>
                </div>
                <span style={{ fontSize:"0.7rem",transition:"transform .3s",display:"block",transform: advanced ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
              </button>

              <div className={`adv-body ${advanced ? "open" : "closed"}`}>
                <div style={{ paddingTop:"1.2rem" }}>
                  <SectionDivider icon="◆" title="Agency & Overhead" />

                  <Field label="Agency / Management Fee" tooltip={TOOLTIPS.agencyFee}>
                    <NumberInput value={agencyFee} onChange={setAgencyFee} suffix="% of ad spend" step="0.5" max={50} />
                  </Field>

                  <SectionDivider icon="◆" title="Returns — Resale Rate" />

                  <Field label="Returned Stock You Can Resell" tooltip={TOOLTIPS.resaleable}>
                    <div>
                      <NumberInput value={resalePct} onChange={setResalePct} suffix="% resaleable" step="5" max={100} />
                      <div style={{ fontSize:"0.62rem",color:"#4a4030",marginTop:"0.3rem" }}>
                        Category default: {cat.resaleable}% — adjust if your situation differs.
                      </div>
                    </div>
                  </Field>

                  <SectionDivider icon="◆" title="Customer Lifetime Value" />

                  <div style={{ marginBottom:"0.8rem" }}>
                    <Toggle value={ltvOn} onChange={setLtvOn} label="My customers buy more than once" />
                    <Tooltip text={TOOLTIPS.ltv} />
                  </div>

                  {ltvOn && (
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 1rem" }}>
                      <Field label="Avg Purchases / Year">
                        <NumberInput value={purchPerYear} onChange={setPurchPerYear} step="0.1" min={1} suffix="× / yr" />
                      </Field>
                      <Field label="Avg Years as Customer">
                        <NumberInput value={yearsRetain} onChange={setYearsRetain} step="0.5" min={0.5} suffix="yrs" />
                      </Field>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ─── RIGHT: OUTPUTS ─── */}
          <div style={{ background:"rgba(255,255,255,.01)",padding:"1.8rem",borderRight:"1px solid var(--line)",borderBottom:"1px solid var(--line)" }}>

            {/* Verdict */}
            <div className="fade-up fade-up-1" style={{
              padding:"1.1rem 1.3rem", marginBottom:"1.2rem",
              borderLeft:`3px solid ${verdict.color}`,
              border:`1px solid ${verdict.color}25`,
              background:`${verdict.color}08`, borderRadius:2,
            }}>
              <div style={{ fontSize:"0.58rem",letterSpacing:"0.18em",textTransform:"uppercase",color:verdict.color,marginBottom:"0.25rem",opacity:.8 }}>Verdict</div>
              <div style={{ fontSize:"1rem",color:verdict.color,marginBottom:"0.35rem",fontFamily:"var(--font-serif)",fontWeight:500 }}>{verdict.label}</div>
              <div style={{ fontSize:"0.75rem",color:"#6a6055",lineHeight:1.6 }}>{verdict.text}</div>
            </div>

            {/* Primary Metric */}
            <div className="fade-up fade-up-2" style={{ marginBottom:8 }}>
              <MetricCard
                large topLine
                label="Your Break-Even ROAS"
                value={`${f2(animBreakEven)}x`}
                sub={`You must beat this ROAS to make any real profit${advanced && agencyFee > 0 ? ` (includes ${agencyFee}% agency fee)` : ""}`}
              />
            </div>

            {/* ROAS Gauge */}
            <div className="fade-up fade-up-2" style={{ padding:"1rem 1.1rem",border:"1px solid rgba(255,255,255,.06)",borderRadius:2,marginBottom:8,background:"rgba(255,255,255,.01)" }}>
              <div style={{ fontSize:"0.58rem",letterSpacing:"0.14em",textTransform:"uppercase",color:"#4a4030",marginBottom:"0.7rem" }}>ROAS Position</div>
              <RoasGauge current={reportedRoas} breakEven={trueBreakEven} target={targetRoas} />
            </div>

            {/* 3-col metrics */}
            <div className="fade-up fade-up-3 metrics-grid-3" style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:8 }}>
              <MetricCard
                label="Gross Margin"
                value={`${f2(animMargin)}%`}
                sub="After all variable costs"
                tone="neutral"
              />
              <MetricCard
                label="Profit per Order"
                value={`${animProfit < 0 ? "-" : ""}${currency}${f0(animProfit)}`}
                sub={animProfit >= 0 ? "True net per sale" : "Loss per sale"}
                tone={animProfit >= 0 ? "success" : "danger"}
              />
              <MetricCard
                label="Monthly Profit"
                value={`${animMonthly < 0 ? "-" : ""}${currency}${f0(animMonthly)}`}
                sub={animMonthly >= 0 ? "From ad campaigns" : "Currently losing"}
                tone={animMonthly >= 0 ? "success" : "danger"}
              />
            </div>

            {/* Target ROAS tiers */}
            <div className="fade-up fade-up-4" style={{ padding:"1rem 1.1rem",border:"1px solid rgba(255,255,255,.06)",borderRadius:2,marginBottom:8,background:"rgba(255,255,255,.01)" }}>
              <div style={{ fontSize:"0.58rem",letterSpacing:"0.14em",textTransform:"uppercase",color:"#4a4030",marginBottom:"0.8rem" }}>Target ROAS Tiers</div>
              {[
                { label:"Break-even",  val: trueBreakEven, color:"#c4605e", desc:"Cover all costs, zero profit" },
                { label:"Healthy",     val: targetRoas,    color:"#c9a96e", desc:"30% buffer — recommended minimum" },
                { label:"Strong",      val: stretchRoas,   color:"#7ab87a", desc:"60% buffer — room to scale" },
              ].map(({ label, val, color, desc }) => (
                <div key={label} style={{ display:"flex",alignItems:"center",gap:"0.8rem",marginBottom:"0.55rem" }}>
                  <div style={{ width:6,height:6,borderRadius:"50%",background:color,flexShrink:0 }}/>
                  <div style={{ fontSize:"0.7rem",color:"#6a6055",width:80,flexShrink:0 }}>{label}</div>
                  <div style={{ fontSize:"1.05rem",color,fontFamily:"var(--font-serif)",width:55,flexShrink:0 }}>{f2(val)}x</div>
                  <div style={{ fontSize:"0.65rem",color:"#4a4030" }}>{desc}</div>
                </div>
              ))}
            </div>

            {/* Industry Benchmark */}
            <div className="fade-up fade-up-4" style={{ padding:"1rem 1.1rem",border:"1px solid rgba(255,255,255,.06)",borderRadius:2,marginBottom:8,background:"rgba(255,255,255,.01)" }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.7rem" }}>
                <div style={{ fontSize:"0.58rem",letterSpacing:"0.14em",textTransform:"uppercase",color:"#4a4030" }}>vs {category} Benchmark</div>
                {(() => {
                  const diff = reportedRoas - cat.avgRoas;
                  return (
                    <span style={{ fontSize:"0.62rem",padding:"0.18rem 0.55rem",borderRadius:2,color: diff>=0?"#7ab87a":"#c4605e",background: diff>=0?"rgba(122,184,122,.09)":"rgba(196,96,94,.09)",border:`1px solid ${diff>=0?"rgba(122,184,122,.2)":"rgba(196,96,94,.2)"}`}}>
                      {diff>=0?"▲":"▼"} {Math.abs(diff).toFixed(2)}x vs avg
                    </span>
                  );
                })()}
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.6rem" }}>
                {[
                  { l:"Industry Avg ROAS", v:`${cat.avgRoas}x` },
                  { l:"Typical Conv. Rate",v:`${cat.avgCvr}%`  },
                  { l:"Typical AOV",       v:`${currency}${cat.avgAov}` },
                ].map(({ l, v }) => (
                  <div key={l}>
                    <div style={{ fontSize:"0.58rem",color:"#3a3020",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.2rem" }}>{l}</div>
                    <div style={{ fontSize:"0.95rem",color:"#7a7060",fontFamily:"var(--font-serif)" }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* LTV Output — only when advanced + ltvOn */}
            {advanced && ltvOn && ltv && (
              <div className="fade-up fade-up-5" style={{ padding:"1.1rem 1.3rem",border:"1px solid rgba(201,169,110,.2)",borderRadius:2,marginBottom:8,background:"rgba(201,169,110,.04)",position:"relative",overflow:"hidden" }}>
                <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,#c9a96e,transparent)" }}/>
                <div style={{ fontSize:"0.58rem",letterSpacing:"0.14em",textTransform:"uppercase",color:"rgba(201,169,110,.6)",marginBottom:"0.7rem" }}>LTV-Adjusted Acquisition Target</div>
                <div className="metrics-grid-2" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
                  <MetricCard
                    label="Customer LTV"
                    value={`${currency}${f0(animLtv)}`}
                    sub={`${purchPerYear}× / yr over ${yearsRetain} yrs`}
                  />
                  <MetricCard
                    label="LTV-Adjusted ROAS Floor"
                    value={ltvAdjBreak ? `${f2(animLtvBreak)}x` : "–"}
                    sub="Min ROAS for LTV profitability"
                    tone={ltvAdjBreak && ltvAdjBreak < trueBreakEven ? "success" : "neutral"}
                  />
                </div>
                {ltvAdjBreak && ltvAdjBreak < trueBreakEven && (
                  <p style={{ fontSize:"0.72rem",color:"#8a8070",lineHeight:1.6,marginTop:"0.7rem",fontStyle:"italic" }}>
                    Because your customers repurchase, you can profitably acquire at as low as {f2(ltvAdjBreak)}x ROAS on first order — {f2(trueBreakEven - ltvAdjBreak)}x lower than your single-order break-even.
                  </p>
                )}
              </div>
            )}

          </div>

          {/* ─── FULL-WIDTH: COST BREAKDOWN STRIP ─── */}
          <div className="full-row fade-up fade-up-5" style={{ padding:"1.5rem 1.8rem",background:"rgba(255,255,255,.01)",borderBottom:"1px solid var(--line)",borderLeft:"1px solid var(--line)",borderRight:"1px solid var(--line)" }}>
            <div className="strip-grid" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1.2rem",marginBottom:"1.4rem" }}>
              {[
                { l:"Est. Monthly Orders",   v:`${f0(currentOrders)}`,              s:"from ads at current ROAS" },
                { l:"True Cost Per Order",   v:`${currency}${f0(adCostPerOrder)}`,  s:"ad spend only, excl. COGS" },
                { l:"Return Cost / Order",   v:`-${currency}${f0(returnCostPerOrder)}`, s:"unrecoverable stock + shipping" },
                { l:"CAC (all-in)",          v:`${currency}${f0(adCostPerOrder + totalVarCost)}`, s:"full cost of one paid customer" },
              ].map(({ l, v, s }) => (
                <div key={l} style={{ borderLeft:"1px solid rgba(201,169,110,.1)",paddingLeft:"1rem" }}>
                  <div style={{ fontSize:"0.58rem",letterSpacing:"0.12em",textTransform:"uppercase",color:"#4a4030",marginBottom:"0.25rem" }}>{l}</div>
                  <div style={{ fontSize:"1.3rem",color:"var(--gold)",fontFamily:"var(--font-serif)",fontWeight:300,letterSpacing:"-0.01em" }}>{v}</div>
                  <div style={{ fontSize:"0.62rem",color:"#3a3020",marginTop:"0.15rem" }}>{s}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize:"0.58rem",letterSpacing:"0.14em",textTransform:"uppercase",color:"#4a4030",marginBottom:"0.9rem" }}>True Cost per Order — Breakdown</div>
            <CostBar items={costBars} price={netPrice} />
            <div style={{ display:"flex",justifyContent:"flex-end",marginTop:"0.6rem",paddingTop:"0.5rem",borderTop:"1px solid rgba(201,169,110,.08)" }}>
              <span style={{ fontSize:"0.68rem",color:"#5a5040" }}>Total cost of one sale: </span>
              <span style={{ fontSize:"0.78rem",color:"var(--gold)",fontFamily:"var(--font-serif)",marginLeft:8 }}>
                {currency}{f0(totalVarCost + adCostPerOrder)}
                <span style={{ fontSize:"0.62rem",color:"#4a4030",marginLeft:6 }}>({f2((totalVarCost + adCostPerOrder) / (netPrice||1) * 100)}% of net revenue)</span>
              </span>
            </div>
          </div>

          {/* ─── FULL-WIDTH: PLAIN ENGLISH SUMMARY ─── */}
          <div className="full-row fade-up fade-up-6" style={{ padding:"1.6rem 1.8rem",background:"rgba(201,169,110,.025)",borderBottom:"1px solid var(--line)",borderLeft:"1px solid var(--line)",borderRight:"1px solid var(--line)" }}>
            <div style={{ maxWidth:640 }}>
              <div style={{ fontSize:"0.6rem",letterSpacing:"0.16em",textTransform:"uppercase",color:"rgba(201,169,110,.6)",marginBottom:"0.8rem" }}>What This Means For Your Business</div>
              <p style={{ fontSize:"0.95rem",color:"#7a7060",lineHeight:1.8,fontStyle:"italic",marginBottom:"0.8rem" }}>
                {isProfitable
                  ? `At ${f2(reportedRoas)}x ROAS, your campaigns generate ${currency}${f0(Math.abs(profitPerOrder))} real profit per order after all costs. Your healthy target should be ${f2(targetRoas)}x — giving you enough buffer to absorb a bad week without slipping into loss.`
                  : `Despite a reported ROAS of ${f2(reportedRoas)}x, your true break-even is ${f2(trueBreakEven)}x once COGS, shipping, returns, processing${advanced && agencyFee > 0 ? ", and agency fees" : ""} are accounted for. Every ad-driven order is currently costing you ${currency}${f0(Math.abs(profitPerOrder))}. This is fixable — the first step is knowing the number.`
                }
              </p>
              <p style={{ fontSize:"0.8rem",color:"#4a4030",lineHeight:1.7 }}>
                Industry benchmark for {category}: average ROAS {cat.avgRoas}x · typical AOV {currency}{cat.avgAov} · typical conversion rate {cat.avgCvr}%. Your reported ROAS is <span style={{ color: reportedRoas >= cat.avgRoas ? "#7ab87a" : "#c4605e" }}>{reportedRoas >= cat.avgRoas ? `${f2(reportedRoas - cat.avgRoas)}x above` : `${f2(cat.avgRoas - reportedRoas)}x below`}</span> that benchmark.
              </p>
            </div>
          </div>

          {/* ─── FULL-WIDTH: CTA ─── */}
          <div className="full-row cta-row" style={{ padding:"2rem 1.8rem",display:"flex",justifyContent:"space-between",alignItems:"center",gap:"1.5rem",background:"rgba(255,255,255,.01)",borderLeft:"1px solid var(--line)",borderRight:"1px solid var(--line)",borderBottom:"1px solid var(--line)" }}>
            <div>
              <div style={{ fontFamily:"var(--font-serif)",fontSize:"1.2rem",fontWeight:400,color:"#f0ebe0",marginBottom:"0.35rem" }}>
                Want to know <em>why</em> your ROAS is where it is?
              </div>
              <div style={{ fontSize:"0.8rem",color:"#4a4030",lineHeight:1.6 }}>
                Take the free 2-minute Google Ads Health Check — no account access required.
              </div>
            </div>
            <button
              style={{
                padding:"0.85rem 1.8rem", flexShrink:0,
                background:"linear-gradient(135deg,#c9a96e,#9a7238)",
                border:"none", borderRadius:2, cursor:"pointer",
                color:"#0e0c09", fontFamily:"var(--font-sans)",
                fontSize:"0.82rem", letterSpacing:"0.1em", textTransform:"uppercase",
                fontWeight:500, boxShadow:"0 4px 20px rgba(201,169,110,.2)", transition:"all .2s",
              }}
              onMouseEnter={e => { e.target.style.boxShadow="0 6px 28px rgba(201,169,110,.35)"; e.target.style.transform="translateY(-1px)"; }}
              onMouseLeave={e => { e.target.style.boxShadow="0 4px 20px rgba(201,169,110,.2)"; e.target.style.transform="translateY(0)"; }}
            >
              Run Account Health Check →
            </button>
          </div>

        </div>{/* /main-grid */}

        {/* Footer */}
        <div style={{ marginTop:"2.5rem",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem",paddingTop:"1.2rem",borderTop:"1px solid rgba(201,169,110,.06)" }}>
          <p style={{ fontSize:"0.6rem",color:"#2e2a20",letterSpacing:"0.07em" }}>Calculations are estimates. Actual profitability may vary. For a full account review, speak with a specialist.</p>
          <div style={{ fontSize:"0.6rem",color:"#2e2a20",letterSpacing:"0.1em" }}>© Your Agency · Luxury Ecommerce Growth</div>
        </div>

      </div>
    </div>
  );
}
