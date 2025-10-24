import { FunnelJSON } from "../types";

export function buildFullPageHtml(data: FunnelJSON) {
  const colors = {
    primary: data.branding?.color_palette?.primary || "#8C4BFF",
    secondary: data.branding?.color_palette?.secondary || "#6E76FF",
    accent: data.branding?.color_palette?.accent || "#22D3EE",
    background: data.branding?.color_palette?.background || "#0B0D12",
    text: data.branding?.color_palette?.text || "#FFFFFF",
  };

  const fonts = {
    heading: data.branding?.typography?.heading || "Inter, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    body: data.branding?.typography?.body || "Inter, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  };

  // Map your layout to the HTML snippets returned by the model
  const sectionMap: Record<string, string | undefined> = {
    Hero: data.systeme_sections?.hero_html,
    Benefits: data.systeme_sections?.benefits_html,
    Offer: data.systeme_sections?.offer_html,
    FAQ: data.systeme_sections?.faq_html,
    CTA: data.systeme_sections?.cta_html,
    // (Ignore sections that don’t have HTML snippets)
  };

  const orderedSections = (data.layout || [])
    .map((key) => sectionMap[key])
    .filter(Boolean)
    .join("\n\n");

  const css = `
:root{
  --ll-primary:${colors.primary};
  --ll-secondary:${colors.secondary};
  --ll-accent:${colors.accent};
  --ll-bg:${colors.background};
  --ll-text:${colors.text};
}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:var(--ll-bg);color:var(--ll-text);}
.ll-container{max-width:1100px;margin:0 auto;padding:32px 20px;}
h1,h2,h3{font-family:${fonts.heading};margin:0 0 10px;line-height:1.15}
p,li,span,div{font-family:${fonts.body};}
.ll-btn{display:inline-block;padding:12px 18px;border-radius:12px;text-decoration:none;color:#fff;background:var(--ll-primary);}
.ll-btn.secondary{background:transparent;color:var(--ll-text);border:1px solid #ffffff22}
.ll-card{background:#ffffff08;border:1px solid #ffffff14;border-radius:16px;padding:20px}
hr{border:0;border-top:1px solid #ffffff14;margin:28px 0}
@media (min-width:840px){ .ll-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px} }
`;

  const title =
    data.meta?.big_idea ||
    `LaunchLab — ${data.meta?.brand_idea || "Your brand made simple"}`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${escapeHtml(title)}</title>
  <style>${css}</style>
</head>
<body>
  <main class="ll-container">
    ${orderedSections}
  </main>
</body>
</html>`;
}

function escapeHtml(s: string) {
  // Fix: Replaced `replaceAll` with `replace` using a global regex for wider JS compatibility.
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
