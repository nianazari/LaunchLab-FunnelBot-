import { FunnelJSON } from "../types";

export function buildFullPageSnippet(data: FunnelJSON) {
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

  // Map layout keys to the model’s section HTML
  const sectionMap: Record<string, string | undefined> = {
    Hero: data.systeme_sections?.hero_html,
    Benefits: data.systeme_sections?.benefits_html,
    Offer: data.systeme_sections?.offer_html,
    FAQ: data.systeme_sections?.faq_html,
    CTA: data.systeme_sections?.cta_html,
  };

  const ordered = (data.layout || [])
    .map((k) => sectionMap[k])
    .filter(Boolean)
    .join("\n\n");

  // Styles embedded INSIDE the snippet so Systeme keeps them.
  const css = `
/* ===== LaunchLab Funnel Styles (scoped) ===== */
#ll-root{--ll-primary:${colors.primary};--ll-secondary:${colors.secondary};
--ll-accent:${colors.accent};--ll-bg:${colors.background};--ll-text:${colors.text};
font-family:${fonts.body};color:var(--ll-text)}
#ll-root *{box-sizing:border-box}
#ll-root .ll-container{max-width:1100px;margin:0 auto;padding:32px 20px;background:var(--ll-bg)}
#ll-root h1,#ll-root h2,#ll-root h3{font-family:${fonts.heading};margin:0 0 10px;line-height:1.15}
#ll-root p,#ll-root li,#ll-root span{opacity:.95}
#ll-root .ll-btn{display:inline-block;padding:12px 18px;border-radius:12px;text-decoration:none;color:#fff;background:var(--ll-primary)}
#ll-root .ll-btn.secondary{background:transparent;color:var(--ll-text);border:1px solid #ffffff22}
#ll-root .ll-card{background:#ffffff08;border:1px solid #ffffff14;border-radius:16px;padding:20px}
#ll-root hr{border:0;border-top:1px solid #ffffff14;margin:28px 0}
@media (min-width:840px){#ll-root .ll-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}}
/* ===== End Styles ===== */
  `.trim();

  // Wrap everything in a single root so styles are scoped
  return `
<style>${css}</style>
<section id="ll-root">
  <div class="ll-container">
    ${ordered}
  </div>
</section>
  `.trim();
}