const SITE = "https://fitworks.in";

/** Indian numbers are stored bare (10 digits); wa.me needs the country code. */
const WA_COUNTRY_CODE = "91";

export interface WhatsAppTrainer {
  personal?: { fullName?: string; phone?: string };
  slug?: string;
  verificationStatus?: string;
}

/**
 * Messages an admin sends a trainer from the trainers table.
 *
 * No emoji. WhatsApp Desktop turns emoji in pre-filled link text into "�",
 * while ₹ and — come through intact, so stick to plain characters.
 *
 * Edit freely — this is the only place the copy lives. `{name}` and `{link}`
 * are substituted; everything else is sent verbatim, newlines included.
 */
export const WHATSAPP_TEMPLATES = {
  /** Pending — ask them to upload documents so they can be verified. */
  upload: `Hi {name}!
Thanks for registering with FitWorks.

To get your trainer profile verified, please upload your documents — a fitness certificate and a government ID (Aadhaar or PAN). FitWorks is free for trainers, so you can browse and apply to gym vacancies right away.

Log in and open "Verification" to upload:
{link}

We connect you with gyms searching for trainers.`,

  /** Verified — nothing to ask for. */
  live: `Hi {name}!

Good news — your FitWorks profile is verified.

You can now browse and apply to gym vacancies. Gyms see your full profile with each application.

Log in here to browse open vacancies:
{link}

Welcome to FitWorks!
We look forward to helping you discover new opportunities.`,
};

export type WhatsAppTemplate = keyof typeof WHATSAPP_TEMPLATES;

/** Verified trainers are told so; everyone else is asked for documents. */
export const pickTemplate = (trainer: WhatsAppTrainer): WhatsAppTemplate =>
  trainer.verificationStatus === "verified" ? "live" : "upload";

/** First name only — "Hi Trilokeswari!" reads warmer than the full name. */
const firstName = (fullName?: string) => (fullName || "there").trim().split(/\s+/)[0];

/** Strips punctuation and any existing country code down to a bare 10 digits. */
export const whatsappNumber = (phone?: string): string | null => {
  const digits = String(phone ?? "").replace(/\D/g, "").slice(-10);
  return /^[6-9]\d{9}$/.test(digits) ? `${WA_COUNTRY_CODE}${digits}` : null;
};

/**
 * A wa.me link that opens the desktop app or WhatsApp Web on a computer and the
 * app on a phone, with the message prefilled for the admin to review and send.
 *
 * Returns null when the number can't be dialled, so the caller can disable the
 * button rather than open a broken chat.
 */
export const buildWhatsAppUrl = (trainer: WhatsAppTrainer): string | null => {
  const number = whatsappNumber(trainer.personal?.phone);
  if (!number) return null;

  // One link for everyone: /auth sends an existing session straight to the
  // dashboard and asks anyone else to sign in first. A deep link would have to
  // guess whether the phone it lands on is already signed in.
  const link = `${SITE}/auth`;

  const text = WHATSAPP_TEMPLATES[pickTemplate(trainer)]
    .replace("{name}", firstName(trainer.personal?.fullName))
    .replace("{link}", link);

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
};
