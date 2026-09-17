const SITE = "https://fitworks.in";

/** Indian numbers are stored bare (10 digits); WhatsApp needs the country code. */
const WA_COUNTRY_CODE = "91";

/**
 * Link straight to api.whatsapp.com rather than the shorter wa.me.
 *
 * wa.me 302-redirects here and mangles the text on the way: a correctly encoded
 * 👋 (%F0%9F%91%8B) comes back out as %EF%BF%BD, the replacement character —
 * which is why emoji arrived as "�". api.whatsapp.com takes the same parameters
 * and leaves them intact, and still opens the desktop app or the phone.
 */
const waLink = (number: string, text: string) =>
  `https://api.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(text)}`;

export interface WhatsAppTrainer {
  personal?: { fullName?: string; phone?: string };
  slug?: string;
  verificationStatus?: string;
}

/**
 * Messages an admin sends a trainer from the trainers table.
 *
 * Edit freely — this is the only place the copy lives. `{name}` and `{link}`
 * are substituted; everything else is sent verbatim, newlines included.
 */
export const WHATSAPP_TEMPLATES = {
  /** Pending — ask them to upload documents so they can be verified. */
  upload: `Hi {name}! 👋

Thanks for registering with FitWorks!

To get your trainer profile verified, please upload your fitness certificate or a government ID (Aadhaar or PAN).

Once verified, we'll help connect you with gyms and fitness centres looking for trainers, based on your profile and location. Whenever a relevant opportunity comes up, our team will reach out to you. 💪

Log in and open "Verification" to upload your documents:
{link}

Keep your profile updated and stay ready for your next fitness opportunity.

Team FitWorks`,

  /** Approved — congratulate, then set the expectation of what happens next. */
  live: `Hi {name}! 👋

Your FitWorks profile has been approved and is now active! ✅

From here, we'll work to connect you with gyms looking for trainers and fitness professionals. When a suitable opportunity matches your profile and location, we'll reach out to you directly.

Keep your profile updated and stay ready for your next opportunity.

{link}

Your next fitness career opportunity could be closer than you think.

Team FitWorks`,
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
 * A WhatsApp link that opens the desktop app on a computer and the app on a
 * phone, with the message prefilled for the admin to review and send.
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

  return waLink(number, text);
};

/* ─────────────────── Meta instant-form leads ─────────────────── */

export interface WhatsAppLead {
  fullName?: string;
  phone?: string;
  /** Set when this person has since registered — changes what we ask of them. */
  registeredTrainer?: { slug?: string } | null;
}

/**
 * Messages for people who filled in a Meta instant form but are not trainers
 * on the platform yet. Separate from the trainer templates above: a lead has no
 * account, so the ask is to create one.
 */
export const LEAD_TEMPLATES = {
  /** Never registered — invite them to create a profile. */
  invite: `Hi {name}! 👋
Thanks for your interest in FitWorks.

You filled in our form for gym trainer jobs. FitWorks is completely free for trainers — create your profile, upload your documents, and let gyms discover you.

Create your profile here:
{signupLink}

We connect trainers with gyms looking for the right talent. 💪`,

  /** Already signed up — nudge them to finish instead of starting again. */
  registered: `Hi {name}! 👋
Thanks for registering with FitWorks.

Your profile is created. Upload your documents to get verified — once approved, you can start applying to gym vacancies. It is completely free.

Log in here:
{loginLink}

We connect you with gyms searching for trainers.`,
};

export const buildLeadWhatsAppUrl = (lead: WhatsAppLead): string | null => {
  const number = whatsappNumber(lead.phone);
  if (!number) return null;

  const template = lead.registeredTrainer ? LEAD_TEMPLATES.registered : LEAD_TEMPLATES.invite;
  const text = template
    .replace("{name}", firstName(lead.fullName))
    .replace("{signupLink}", `${SITE}/auth/trainer-signup`)
    .replace("{loginLink}", `${SITE}/auth`);

  return waLink(number, text);
};
