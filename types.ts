

export interface FunnelFormState {
  brandIdea: string;
  industry: string;
  tone: string;
  mode: string;
}

export interface Meta {
  brand_idea: string;
  industry: string;
  tone: string;
  mode: string;
  big_idea: string;
}

export interface Hero {
  headline: string;
  subheadline: string;
  primary_cta: string;
  secondary_cta: string;
  hero_points: string[];
  viral_hook: string;
}

export interface MiniTestimonial {
  name: string;
  snippet: string;
  result: string;
}

export interface SocialProof {
  proof_line: string;
  badges: string[];
  mini_testimonials: MiniTestimonial[];
}

export interface Benefits {
  title: string;
  bullets: string[];
}

export interface HowItWorksStep {
  step: string;
  title: string;
  desc: string;
}

export interface HowItWorks {
  title: string;
  steps: HowItWorksStep[];
}

export interface OfferItem {
  name: string;
  desc: string;
  value_tag: string;
}

export interface Offer {
  title: string;
  items: OfferItem[];
  price_anchor: string;
  primary_cta: string;
  risk_reversal: string;
}

export interface BonusItem {
    name: string;
    desc: string;
}

export interface Bonus {
  title: string;
  items: BonusItem[];
}

export interface FAQ {
  q: string;
  a: string;
}

export interface Guarantee {
  headline: string;
  copy: string;
}

export interface CtaBlock {
  headline: string;
  button_text: string;
  reassurance: string;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface Typography {
  heading: string;
  body: string;
}

export interface Branding {
  color_palette: ColorPalette;
  typography: Typography;
}

export interface Extras {
  ugc_hooks: string[];
  ad_angles: string[];
  email_subjects: string[];
}

export interface SystemeSections {
  hero_html: string;
  benefits_html: string;
  offer_html: string;
  faq_html: string;
  cta_html: string;
}

export type FunnelJSON = {
  meta: Meta;
  layout: string[];
  hero: Hero;
  social_proof: SocialProof;
  benefits: Benefits;
  how_it_works: HowItWorks;
  offer: Offer;
  bonus: Bonus;
  faq: FAQ[];
  guarantee: Guarantee;
  cta_block: CtaBlock;
  branding: Branding;
  extras: Extras;
  systeme_sections: SystemeSections;
};