const SITE = "https://fitworks.in";

/** Indian numbers are stored bare (10 digits); wa.me needs the country code. */
const WA_COUNTRY_CODE = "91";

export interface WhatsAppTrainer {
  personal?: { fullName?: string; phone?: string };
  slug?: string;
  activation?: { isActive?: boolean };
  verificationStatus?: string;
  verificationDocuments?: string[];
}

/**
 * Messages an admin sends a trainer from the trainers table.
 *
 * Edit freely — this is the only place the copy lives. `{name}`, `{link}` and
 * `{activation}` are substituted; everything else is sent verbatim, newlines
 * included. `{activation}` is the ₹99 pitch, and is dropped for anyone who has
 * already paid.
 */
export const WHATSAPP_TEMPLATES = {
  /** Pending, nothing uploaded yet — ask for documents. */
  upload: `Hi {name}! 👋
Thanks for registering with FitWorks.

To get your trainer profile verified ✅, please upload your documents — a fitness certificate and a government ID (Aadhaar or PAN).

{activation}

Log in and open "Verification" to upload:
🔗 {link}

Gyms across India are posting vacancies for trainers on FitWorks 💪`,

  /** Pending, documents already in — don't ask for them again. */
  review: `Hi {name}! 👋
Thanks for registering with FitWorks.

We've received your documents and our team is reviewing them for verification ✅

{activation}

Log in here:
🔗 {link}

Gyms across India are posting vacancies for trainers on FitWorks 💪`,

  /** Verified but hasn't paid — the nudge that earns the one-time ₹99. */
  activate: `Hi {name}! 👋
Thanks for registering with FitWorks.

Your trainer account is verified! ✅
Just one step left — a one-time ₹99 to activate your profile and start applying to gym vacancies. No monthly fee.

Log in here to activate:
🔗 {link}

Welcome to FitWorks! 💪
We look forward to helping you discover new opportunities.`,

  /** Verified and already activated — nothing to sell, so don't. */
  live: `Hi {name}! 👋

Good news — your FitWorks profile is verified ✅ and activated.

You can now browse and apply to gym vacancies. Gyms see your full profile with each application.

Log in here to browse open vacancies:
🔗 {link}

Welcome to FitWorks! 💪
We look forward to helping you discover new opportunities.`,
};

export type WhatsAppTemplate = keyof typeof WHATSAPP_TEMPLATES;

/**
 * Which message fits this trainer's situation. Asking someone to upload
 * documents they already sent, or to pay for something they bought, is exactly
 * the kind of message that makes a trainer stop trusting what we tell them.
 */
export const pickTemplate = (trainer: WhatsAppTrainer): WhatsAppTemplate => {
  if (trainer.verificationStatus === "pending") {
    return (trainer.verificationDocuments?.length ?? 0) > 0 ? "review" : "upload";
  }
  return trainer.activation?.isActive ? "live" : "activate";
};

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

  const isActive = Boolean(trainer.activation?.isActive);
  // One link for everyone: /auth sends an existing session straight to the
  // dashboard and asks anyone else to sign in first. A deep link would have to
  // guess whether the phone it lands on is already signed in.
  const link = `${SITE}/auth`;

  const template = pickTemplate(trainer);
  const activation = isActive
    ? ""
    : "Activate your profile for just ₹99 one-time — no monthly fee — and start applying to gym vacancies right away.";

  const text = WHATSAPP_TEMPLATES[template]
    .replace("{name}", firstName(trainer.personal?.fullName))
    .replace("{link}", link)
    .replace("{activation}", activation)
    // An empty {activation} leaves a double gap behind; close it up.
    .replace(/\n{3,}/g, "\n\n");

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
};
