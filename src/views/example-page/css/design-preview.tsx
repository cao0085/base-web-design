import React, { useEffect, useMemo, useState } from "react";
import "./index.css"; // 仍然引用同一份 token（:root 變數）

/**
 * DesignPreviewPanel (React 18 Function Component)
 * - 將「零件樣式」寫在同一個 .tsx 內，以 <style> 注入並以 .dtp* 前綴做區域化
 * - 仍然從 ./index.css 的 :root 讀取 CSS variables 作為 design token 來源
 * - 內建：搜尋、可折疊區塊、色票/字體/間距/圓角/陰影預覽、示意元件（按鈕/輸入/卡片）
 */
export default function DesignPreviewPanel() {
  const [tokens, setTokens] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState("");

  // 讀取 :root 中所有 -- 變數（同源樣式表）
  useEffect(() => {
    const next: Record<string, string> = {};

    const collectFromStyle = (style: CSSStyleDeclaration) => {
      for (let i = 0; i < style.length; i++) {
        const prop = style[i];
        if (prop.startsWith("--")) {
          const val = style.getPropertyValue(prop).trim();
          if (val) next[prop] = val;
        }
      }
    };

    const collectFromCSSOM = () => {
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          const rules = (sheet as CSSStyleSheet).cssRules;
          for (const rule of Array.from(rules)) {
            if (rule instanceof CSSStyleRule && rule.selectorText.includes(":root")) {
              collectFromStyle(rule.style);
            }
          }
        } catch {
          /* ignore cross-origin */
        }
      }
    };

    const collectFromComputed = () => {
      const cs = getComputedStyle(document.documentElement);
      for (let i = 0; i < cs.length; i++) {
        const prop = cs[i];
        if (prop.startsWith("--")) {
          const val = cs.getPropertyValue(prop).trim();
          if (val) next[prop] = val;
        }
      }
    };

    collectFromCSSOM();
    collectFromComputed();
    setTokens(next);
  }, []);

  // 分群
  const groups = useMemo(() => groupTokens(tokens), [tokens]);

  // 搜尋過濾
  const filtered = useMemo(() => {
    if (!query.trim()) return groups;
    const q = query.toLowerCase();
    const pick = (obj: Record<string, string>) =>
      Object.fromEntries(Object.entries(obj).filter(([k, v]) => k.toLowerCase().includes(q) || v.toLowerCase().includes(q)));

    return {
      colors: pick(groups.colors),
      neutrals: pick(groups.neutrals),
      fontSizes: pick(groups.fontSizes),
      fontWeights: pick(groups.fontWeights),
      lineHeights: pick(groups.lineHeights),
      spacing: pick(groups.spacing),
      radii: pick(groups.radii),
      shadows: pick(groups.shadows),
      durations: pick(groups.durations),
      easing: pick(groups.easing),
    } as TokenGroups;
  }, [groups, query]);

  const toggle = (id: string) => setCollapsed((s) => ({ ...s, [id]: !s[id] }));
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast("Copied!");
      setTimeout(() => setToast(""), 1000);
    } catch {}
  };

  return (
    <div className="dtp">
      {/* 局部樣式（元件外觀） */}
      <style>{localStyles}</style>

      <div className="dtp-shell dtp-elev">
        <header className="dtp-header">
          <div className="dtp-title">Design Tokens</div>
          <div className="dtp-tools">
            <input
              className="dtp-input"
              placeholder="Search tokens…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </header>

        {/* 示意零件：按鈕 / 輸入 / 卡片 */}
        <section className="dtp-demo">
          <button className="dtp-btn primary">Primary</button>
          <button className="dtp-btn secondary">Secondary</button>
          <button className="dtp-btn ghost">Ghost</button>
          <input className="dtp-input" placeholder="Sample input" />
          <div className="dtp-card dtp-elev-sm">
            <div className="dtp-card-title">Card Title</div>
            <div className="dtp-card-body">Use your tokens to style real UI parts.</div>
          </div>
        </section>

        {/* Colors */}
        <Section title="Colors" onToggle={() => toggle("colors")} collapsed={!!collapsed["colors"]}>
          <div className="dtp-grid">
            {Object.entries(filtered.colors).map(([name, value]) => (
              <div key={name} className="dtp-token-card" onClick={() => copy(name)}>
                <div className="dtp-swatch" style={{ background: `var(${name}, ${value})` }} />
                <div className="dtp-meta">
                  <code className="dtp-code">{name}</code>
                  <div className="dtp-val">{value}</div>
                </div>
              </div>
            ))}
          </div>

          {!!Object.keys(filtered.neutrals).length && (
            <div className="dtp-sub">
              <div className="dtp-subtitle">Neutrals</div>
              <div className="dtp-grid">
                {Object.entries(filtered.neutrals).map(([name, value]) => (
                  <div key={name} className="dtp-token-card" onClick={() => copy(name)}>
                    <div className="dtp-swatch" style={{ background: `var(${name}, ${value})` }} />
                    <div className="dtp-meta">
                      <code className="dtp-code">{name}</code>
                      <div className="dtp-val">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* Typography */}
        <Section title="Typography" onToggle={() => toggle("type")} collapsed={!!collapsed["type"]}>
          <div className="dtp-type-group">
            <TypeBlock label="Primary font" styleOverride={{ fontFamily: "var(--font-primary)" }} />
            <TypeBlock label="Secondary font" styleOverride={{ fontFamily: "var(--font-secondary)" }} />
            <TypeBlock label="Mono font" styleOverride={{ fontFamily: "var(--font-mono)" }} />
          </div>

          <div className="dtp-sub">
            <div className="dtp-subtitle">Font sizes</div>
            <div className="dtp-grid min160">
              {Object.entries(filtered.fontSizes).map(([name, value]) => (
                <div key={name} className="dtp-token-card" onClick={() => copy(name)}>
                  <div className="dtp-demo-center" style={{ fontSize: `var(${name})` }}>Aa</div>
                  <div className="dtp-meta">
                    <code className="dtp-code">{name}</code>
                    <div className="dtp-val">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!!Object.keys(filtered.fontWeights).length && (
            <div className="dtp-sub">
              <div className="dtp-subtitle">Font weights</div>
              <div className="dtp-grid min160">
                {Object.entries(filtered.fontWeights).map(([name, value]) => (
                  <div key={name} className="dtp-token-card" onClick={() => copy(name)}>
                    <div className="dtp-demo-center" style={{ fontWeight: `var(${name})` }}>Abc</div>
                    <div className="dtp-meta">
                      <code className="dtp-code">{name}</code>
                      <div className="dtp-val">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!!Object.keys(filtered.lineHeights).length && (
            <div className="dtp-sub">
              <div className="dtp-subtitle">Line heights</div>
              <div className="dtp-grid min220">
                {Object.entries(filtered.lineHeights).map(([name, value]) => (
                  <div key={name} className="dtp-token-card" onClick={() => copy(name)}>
                    <p className="dtp-demo-paragraph" style={{ lineHeight: `var(${name})` }}>
                      Sphinx of black quartz, judge my vow.
                    </p>
                    <div className="dtp-meta">
                      <code className="dtp-code">{name}</code>
                      <div className="dtp-val">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* Spacing */}
        <Section title="Spacing" onToggle={() => toggle("spacing")} collapsed={!!collapsed["spacing"]}>
          <div className="dtp-grid min160">
            {Object.entries(filtered.spacing).map(([name, value]) => (
              <div key={name} className="dtp-token-card" onClick={() => copy(name)}>
                <div className="dtp-bar" style={{ width: `var(${name})` }} />
                <div className="dtp-meta">
                  <code className="dtp-code">{name}</code>
                  <div className="dtp-val">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Radii */}
        <Section title="Radii" onToggle={() => toggle("radii")} collapsed={!!collapsed["radii"]}>
          <div className="dtp-grid">
            {Object.entries(filtered.radii).map(([name, value]) => (
              <div key={name} className="dtp-token-card" onClick={() => copy(name)}>
                <div className="dtp-rect" style={{ borderRadius: `var(${name})` }} />
                <div className="dtp-meta">
                  <code className="dtp-code">{name}</code>
                  <div className="dtp-val">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Shadows */}
        <Section title="Shadows" onToggle={() => toggle("shadows")} collapsed={!!collapsed["shadows"]}>
          <div className="dtp-grid">
            {Object.entries(filtered.shadows).map(([name, value]) => (
              <div key={name} className="dtp-token-card" onClick={() => copy(name)}>
                <div className="dtp-shadow" style={{ boxShadow: `var(${name})` }} />
                <div className="dtp-meta">
                  <code className="dtp-code">{name}</code>
                  <div className="dtp-val">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Motion */}
        <Section title="Motion" onToggle={() => toggle("motion")} collapsed={!!collapsed["motion"]}>
          <div className="dtp-grid min210">
            {Object.entries(filtered.durations).map(([name, value]) => (
              <div key={name} className="dtp-token-card" onClick={() => copy(name)}>
                <div className="dtp-meta-only">
                  <code className="dtp-code">{name}</code>
                  <div className="dtp-val">{value}</div>
                </div>
              </div>
            ))}
            {Object.entries(filtered.easing).map(([name, value]) => (
              <div key={name} className="dtp-token-card" onClick={() => copy(name)}>
                <div className="dtp-meta-only">
                  <code className="dtp-code">{name}</code>
                  <div className="dtp-val">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <footer className="dtp-footer">Click a card to copy its variable name</footer>
      </div>

      {toast && <div className="dtp-toast dtp-elev-sm">{toast}</div>}
    </div>
  );
}

/* ---------- 子元件 ---------- */
function Section({ title, children, onToggle, collapsed }: { title: string; children: React.ReactNode; onToggle: () => void; collapsed?: boolean }) {
  return (
    <section className="dtp-section">
      <button className="dtp-section-bar" onClick={onToggle} aria-expanded={!collapsed}>
        <span className="dtp-section-title">{title}</span>
        <span className={`dtp-chevron ${collapsed ? "is-collapsed" : ""}`}>▾</span>
      </button>
      <div className={`dtp-section-body ${collapsed ? "is-hidden" : ""}`}>{children}</div>
    </section>
  );
}

function TypeBlock({ label, styleOverride }: { label: string; styleOverride: React.CSSProperties }) {
  return (
    <div className="dtp-type">
      <div className="dtp-type-label">{label}</div>
      <p className="dtp-type-demo" style={styleOverride}>
        Sphinx of black quartz, judge my vow.
      </p>
    </div>
  );
}

/* ---------- 分群 ---------- */

type TokenGroups = {
  colors: Record<string, string>;
  neutrals: Record<string, string>;
  fontSizes: Record<string, string>;
  fontWeights: Record<string, string>;
  lineHeights: Record<string, string>;
  spacing: Record<string, string>;
  radii: Record<string, string>;
  shadows: Record<string, string>;
  durations: Record<string, string>;
  easing: Record<string, string>;
};

function groupTokens(all: Record<string, string>): TokenGroups {
  const entries = Object.entries(all).sort(([a], [b]) => a.localeCompare(b));
  const b: TokenGroups = {
    colors: {},
    neutrals: {},
    fontSizes: {},
    fontWeights: {},
    lineHeights: {},
    spacing: {},
    radii: {},
    shadows: {},
    durations: {},
    easing: {},
  };

  for (const [name, val] of entries) {
    if (name.startsWith("--color-neutral-")) b.neutrals[name] = val;
    else if (name.startsWith("--color-")) b.colors[name] = val;
    else if (name.startsWith("--font-size-")) b.fontSizes[name] = val;
    else if (name.startsWith("--font-weight-")) b.fontWeights[name] = val;
    else if (name.startsWith("--line-height-")) b.lineHeights[name] = val;
    else if (name.startsWith("--spacing-")) b.spacing[name] = val;
    else if (name.startsWith("--radius-")) b.radii[name] = val;
    else if (name.startsWith("--shadow-")) b.shadows[name] = val;
    else if (name.startsWith("--duration-")) b.durations[name] = val;
    else if (name.startsWith("--easing-")) b.easing[name] = val;
  }

  return b;
}

/* ---------- 局部 CSS（寫在同一個 .tsx） ---------- */
const localStyles = `
  .dtp { 
    --surface: var(--color-surface, #ffffff);
    --bg: var(--color-background, #f8fafc);
    --fg: var(--color-foreground, #0f172a);
    --muted: var(--color-neutral-500, #64748b);
    --line: var(--color-neutral-100, #e5e7eb);
    --primary: var(--color-primary, #4f46e5);
    --secondary: var(--color-secondary, #22d3ee);

    font-family: var(--font-secondary, ui-sans-serif, system-ui);
    color: var(--fg);
    padding: var(--spacing-6, 24px);
    background: radial-gradient(1200px 600px at 10% -10%, rgba(79,70,229,.08), transparent),
                radial-gradient(1200px 600px at 110% 10%, rgba(34,211,238,.06), transparent),
                var(--bg);
  }

  .dtp-shell {
    max-width: 1120px;
    margin: 0 auto;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-lg, 16px);
    overflow: clip;
  }

  .dtp-elev { box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,.05)); }
  .dtp-elev-sm { box-shadow: var(--shadow-xs, 0 1px 1px rgba(0,0,0,.04)); }

  .dtp-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-4, 16px);
    padding: var(--spacing-5, 20px) var(--spacing-6, 24px);
    border-bottom: 1px solid var(--line);
    background: linear-gradient(180deg, rgba(0,0,0,.02), transparent), var(--surface);
  }
  .dtp-title {
    font-family: var(--font-primary, ui-serif, Georgia);
    font-size: var(--font-size-2xl, 24px);
    line-height: var(--line-height-snug, 1.2);
  }
  .dtp-tools { display: flex; gap: var(--spacing-3, 12px); }

  .dtp-demo {
    display: flex; flex-wrap: wrap; gap: var(--spacing-3, 12px);
    padding: var(--spacing-5, 20px) var(--spacing-6, 24px);
    border-bottom: 1px solid var(--line);
    background: var(--surface);
  }

  .dtp-btn {
    appearance: none; border: 0; cursor: pointer;
    border-radius: var(--radius-md, 10px);
    padding: var(--spacing-3, 12px) var(--spacing-5, 20px);
    font-weight: 600; font-size: var(--font-size-base, 16px);
    transition: transform var(--duration-fast, .12s) var(--easing-ease-in-out, ease-in-out),
                box-shadow var(--duration-fast, .12s) var(--easing-ease-in-out, ease-in-out);
  }
  .dtp-btn:active { transform: translateY(1px); }
  .dtp-btn.primary { background: var(--primary); color: #fff; box-shadow: var(--shadow-sm); }
  .dtp-btn.secondary { background: var(--secondary); color: #0f172a; box-shadow: var(--shadow-sm); }
  .dtp-btn.ghost { background: transparent; color: var(--primary); border: 1px solid var(--line); box-shadow: var(--shadow-xs); }

  .dtp-input {
    height: 40px; padding: 0 var(--spacing-3, 12px);
    border: 1px solid var(--line); border-radius: var(--radius-md, 10px);
    background: var(--surface);
    box-shadow: var(--shadow-xs);
  }

  .dtp-section { padding: var(--spacing-6, 24px); border-bottom: 1px solid var(--line); }
  .dtp-section-bar {
    display: flex; align-items: center; justify-content: space-between; width: 100%;
    background: transparent; border: 0; cursor: pointer; padding: 0 0 var(--spacing-3, 12px);
    color: inherit; font-weight: 700; font-size: var(--font-size-lg, 18px);
  }
  .dtp-chevron { transition: transform .12s ease; }
  .dtp-chevron.is-collapsed { transform: rotate(-90deg); }
  .dtp-section-body.is-hidden { display: none; }

  .dtp-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--spacing-4, 16px); }
  .dtp-grid.min160 { grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); }
  .dtp-grid.min210 { grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); }
  .dtp-grid.min220 { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }

  .dtp-token-card {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-md, 10px);
    padding: var(--spacing-3, 12px);
    box-shadow: var(--shadow-xs);
    cursor: copy;
  }

  .dtp-swatch { height: 64px; border-radius: var(--radius-md, 10px); border: 1px solid var(--line); box-shadow: var(--shadow-sm); }
  .dtp-meta { margin-top: var(--spacing-3, 12px); display: flex; flex-direction: column; gap: 4px; }
  .dtp-code { font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace); font-size: var(--font-size-sm, 12px); color: var(--muted); }
  .dtp-val { font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace); font-size: var(--font-size-sm, 12px); color: var(--color-neutral-300, #94a3b8); word-break: break-all; }

  .dtp-type-group { display: grid; gap: var(--spacing-4, 16px); }
  .dtp-type { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-md, 10px); padding: var(--spacing-4, 16px); box-shadow: var(--shadow-xs); }
  .dtp-type-label { color: var(--muted); font-size: var(--font-size-sm, 12px); margin-bottom: var(--spacing-2, 8px); }
  .dtp-type-demo { margin: 0; font-size: var(--font-size-lg, 18px); line-height: var(--line-height-relaxed, 1.6); }

  .dtp-sub { margin-top: var(--spacing-5, 20px); }
  .dtp-subtitle { font-weight: 700; color: var(--muted); margin-bottom: var(--spacing-3, 12px); }

  .dtp-bar { height: 8px; background: var(--primary); border-radius: 9999px; box-shadow: var(--shadow-sm); }
  .dtp-rect { width: 80px; height: 56px; background: var(--surface); border: 1px solid var(--line); box-shadow: var(--shadow-xs); border-radius: var(--radius-md, 10px); }
  .dtp-shadow { width: 180px; height: 70px; background: var(--surface); border-radius: var(--radius-md, 10px); border: 1px solid var(--line); }
  .dtp-demo-center { min-height: 40px; display: flex; align-items: center; justify-content: center; }
  .dtp-demo-paragraph { margin: 0; }

  .dtp-card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-md, 10px); padding: var(--spacing-4, 16px); }
  .dtp-card-title { font-weight: 700; margin-bottom: var(--spacing-2, 8px); }
  .dtp-card-body { color: var(--muted); }

  .dtp-footer { padding: var(--spacing-5, 20px) var(--spacing-6, 24px); color: var(--muted); font-size: var(--font-size-sm, 12px); }

  .dtp-toast {
    position: fixed; right: 16px; bottom: 16px; z-index: 20;
    background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-md, 10px);
    padding: 10px 12px; font-weight: 600; color: var(--fg);
  }
`;
