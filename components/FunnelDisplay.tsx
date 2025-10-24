import React, {useMemo} from "react";
import { FunnelJSON } from "../types";
import { buildFullPageHtml } from "../utils/buildFullPageHtml";
import LoadingSpinner from "./LoadingSpinner";
import FunnelVisualizer from "./FunnelVisualizer";
import { FullPageHtmlButton } from "./FullPageHtmlButton";
import { FullPageSnippetButton } from "./FullPageSnippetButton";

type Props = {
  data?: FunnelJSON | null;
  loading?: boolean;
  error?: string | null;
};

const Card: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  actions?: React.ReactNode;
}> = ({ title, children, defaultOpen = true, actions }) => {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-4 md:p-5 mb-4">
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => setOpen(!open)}
          className="text-left font-semibold tracking-tight text-white/90 hover:text-white"
        >
          {title}
        </button>
        <div className="flex items-center gap-2">{actions}</div>
      </div>
      {open && <div className="pt-3 text-white/80">{children}</div>}
    </div>
  );
};

const CopyBtn: React.FC<{ value: string; label?: string }> = ({ value, label = "Copy" }) => {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(value)}
      className="text-xs px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white"
      title="Copy to clipboard"
    >
      {label}
    </button>
  );
};

const DownloadBtn: React.FC<{
  filename: string;
  content: string;
  label?: string;
  className?: string;
}> = ({
  filename,
  content,
  label = "Download",
  className,
}) => {
  const handle = () => {
    const blob = new Blob([content], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
  return (
    <button onClick={handle} className={className || "text-xs px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white"}>
      {label}
    </button>
  );
};

const CodeBlock: React.FC<{ value: string }> = ({ value }) => (
  <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-black/40 p-3 text-xs text-white/90">{value}</pre>
);

export const FunnelDisplay: React.FC<Props> = ({ data, loading, error }) => {
  const hasData = !!data && !!data.meta;

  const palettePreview = useMemo(() => {
    if (!data) return null;
    const { primary, secondary, accent, background, text } = data.branding.color_palette;
    const swatch = (c: string, name: string) => (
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 rounded" style={{ background: c, border: "1px solid rgba(255,255,255,.15)" }} />
        <span className="text-xs text-white/70">{name}: {c}</span>
      </div>
    );
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {swatch(primary, "Primary")}
        {swatch(secondary, "Secondary")}
        {swatch(accent, "Accent")}
        {swatch(background, "Background")}
        {swatch(text, "Text")}
      </div>
    );
  }, [data]);

  if (loading) {
    return <LoadingSpinner />;
  }
  if (error) {
    return (
      <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-6 text-rose-100">
        {error}
      </div>
    );
  }
  if (!hasData) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white/70">
        Your funnel will appear here after generation.
      </div>
    );
  }

  return (
    <>
      {hasData && (
        <div className="mb-4 flex flex-wrap justify-end gap-2">
          <FullPageSnippetButton data={data!} />
          <FullPageHtmlButton data={data!} />
        </div>
      )}
      <div className="space-y-4">
        {/* META */}
        <Card
          title="Big Idea"
          actions={<CopyBtn value={data!.meta.big_idea} />}
        >
          <div className="text-lg font-semibold text-white">{data!.meta.big_idea}</div>
          <div className="mt-2 text-sm text-white/70">
            <strong>Idea:</strong> {data!.meta.brand_idea} • <strong>Industry:</strong> {data!.meta.industry} •{" "}
            <strong>Tone:</strong> {data!.meta.tone} • <strong>Mode:</strong> {data!.meta.mode}
          </div>
        </Card>

        {/* FUNNEL VISUALIZER */}
        <FunnelVisualizer data={data!} />

        {/* HERO */}
        <Card
          title="Hero"
          actions={
            <>
              <CopyBtn value={data!.hero.headline} label="Copy Headline" />
              <CopyBtn value={data!.systeme_sections.hero_html} label="Copy HTML" />
              <DownloadBtn filename="hero.html" content={data!.systeme_sections.hero_html} />
            </>
          }
        >
          <div className="text-xl font-bold text-white">{data!.hero.headline}</div>
          <div className="mt-1 text-white/80">{data!.hero.subheadline}</div>
          <ul className="mt-3 list-disc pl-5 text-sm">
            {data!.hero.hero_points.map((p, i) => (<li key={i}>{p}</li>))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <span className="px-2 py-1 rounded bg-white/10">{data!.hero.primary_cta}</span>
            <span className="px-2 py-1 rounded bg-white/10">{data!.hero.secondary_cta}</span>
          </div>
          <div className="mt-3 text-xs uppercase tracking-wide text-white/60">
            Viral hook: {data!.hero.viral_hook}
          </div>
        </Card>

        {/* SOCIAL PROOF */}
        <Card title="Social Proof" actions={<CopyBtn value={data!.social_proof.proof_line} />}>
          <div>{data!.social_proof.proof_line}</div>
          {data!.social_proof.badges?.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {data!.social_proof.badges.map((b, i) => (
                <span key={i} className="text-xs px-2 py-1 rounded bg-white/10">{b}</span>
              ))}
            </div>
          ) : null}
          {data!.social_proof.mini_testimonials?.length ? (
            <ul className="mt-3 grid gap-2">
              {data!.social_proof.mini_testimonials.map((t, i) => (
                <li key={i} className="text-sm">
                  <strong>{t.name}</strong> — <em>{t.snippet}</em>{" "}
                  {t.result && <span className="text-white/70">({t.result})</span>}
                </li>
              ))}
            </ul>
          ) : null}
        </Card>

        {/* BENEFITS */}
        <Card
          title="Benefits"
          actions={
            <>
              <CopyBtn value={data!.benefits.bullets.join("\n")} />
              <CopyBtn value={data!.systeme_sections.benefits_html} label="Copy HTML" />
              <DownloadBtn filename="benefits.html" content={data!.systeme_sections.benefits_html} />
            </>
          }
        >
          <ul className="list-disc pl-5">
            {data!.benefits.bullets.map((b, i) => (<li key={i} className="mb-1">{b}</li>))}
          </ul>
        </Card>

        {/* HOW IT WORKS */}
        <Card title="How It Works" actions={<CopyBtn value={JSON.stringify(data!.how_it_works.steps, null, 2)} />}>
          <ol className="list-decimal pl-5">
            {data!.how_it_works.steps.map((s, i) => (
              <li key={i} className="mb-1">
                <strong>{s.title}:</strong> {s.desc}
              </li>
            ))}
          </ol>
        </Card>

        {/* OFFER */}
        <Card
          title="Offer"
          actions={
            <>
              <CopyBtn value={data!.systeme_sections.offer_html} label="Copy HTML" />
              <DownloadBtn filename="offer.html" content={data!.systeme_sections.offer_html} />
            </>
          }
        >
          <div className="font-semibold">{data!.offer.title}</div>
          <ul className="mt-2 grid gap-2">
            {data!.offer.items.map((it, i) => (
              <li key={i} className="text-sm">
                <strong>{it.name}</strong> — {it.desc} <span className="text-white/60">{it.value_tag}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 text-white/80">{data!.offer.price_anchor}</div>
          <div className="mt-1 text-sm text-white/70">Risk reversal: {data!.offer.risk_reversal}</div>
          <div className="mt-2">
            <span className="px-2 py-1 rounded bg-white/10 text-sm">{data!.offer.primary_cta}</span>
          </div>
        </Card>

        {/* BONUS */}
        <Card title="Bonus" actions={<CopyBtn value={JSON.stringify(data!.bonus.items, null, 2)} />}>
          <ul className="list-disc pl-5">
            {data!.bonus.items.map((b, i) => (<li key={i}><strong>{b.name}:</strong> {b.desc}</li>))}
          </ul>
        </Card>

        {/* FAQ */}
        <Card
          title="FAQ"
          actions={
            <>
              <CopyBtn value={data!.systeme_sections.faq_html} label="Copy HTML" />
              <DownloadBtn filename="faq.html" content={data!.systeme_sections.faq_html} />
            </>
          }
        >
          <ul className="grid gap-2">
            {data!.faq.map((f, i) => (
              <li key={i}>
                <div className="font-semibold">{f.q}</div>
                <div className="text-white/80">{f.a}</div>
              </li>
            ))}
          </ul>
        </Card>

        {/* GUARANTEE */}
        <Card title="Guarantee" actions={<CopyBtn value={`${data!.guarantee.headline}\n\n${data!.guarantee.copy}`} />}>
          <div className="font-semibold">{data!.guarantee.headline}</div>
          <p className="text-white/80 mt-1">{data!.guarantee.copy}</p>
        </Card>

        {/* CTA */}
        <Card
          title="Final CTA"
          actions={
            <>
              <CopyBtn value={data!.systeme_sections.cta_html} label="Copy HTML" />
              <DownloadBtn filename="cta.html" content={data!.systeme_sections.cta_html} />
            </>
          }
        >
          <div className="text-lg font-semibold">{data!.cta_block.headline}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="px-2 py-1 rounded bg-white/10">{data!.cta_block.button_text}</span>
          </div>
          <div className="mt-2 text-sm text-white/70">{data!.cta_block.reassurance}</div>
        </Card>

        {/* BRANDING */}
        <Card title="Branding (Palette & Typography)">
          {palettePreview}
          <div className="mt-3 text-sm text-white/70">
            <div><strong>Heading:</strong> {data!.branding.typography.heading}</div>
            <div><strong>Body:</strong> {data!.branding.typography.body}</div>
          </div>
        </Card>

        {/* EXTRAS */}
        <Card title="Extras: UGC / Ad Angles / Email Subjects" actions={<CopyBtn value={JSON.stringify(data!.extras, null, 2)} />}>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <div className="font-semibold mb-1">UGC Hooks</div>
              <ul className="list-disc pl-5 text-sm">
                {data!.extras.ugc_hooks.map((h,i)=>(<li key={i}>{h}</li>))}
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-1">Ad Angles</div>
              <ul className="list-disc pl-5 text-sm">
                {data!.extras.ad_angles.map((h,i)=>(<li key={i}>{h}</li>))}
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-1">Email Subjects</div>
              <ul className="list-disc pl-5 text-sm">
                {data!.extras.email_subjects.map((h,i)=>(<li key={i}>{h}</li>))}
              </ul>
            </div>
          </div>
        </Card>

        {/* RAW JSON */}
        <Card title="Raw JSON" actions={<CopyBtn value={JSON.stringify(data!, null, 2)} />}>
          <CodeBlock value={JSON.stringify(data!, null, 2)} />
        </Card>
      </div>
    </>
  );
};