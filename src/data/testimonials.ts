export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  /** Monogram shown in place of a photo until we have a real one. */
  initials: string;
  role: string;
  organization: string;
  rating: number;
}

/**
 * Only real, attributable testimonials belong here.
 *
 * NOTE: a third entry ("Priya Sharma", Verified Trainer) was removed — it was
 * placeholder copy with a stock photo attached to a named person. Add it back
 * only with a real quote from a real trainer.
 */
export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "FitWorks has completely transformed how we hire at HOPE GYM&SPA. Finding certified, background-verified trainers used to take weeks — now we connect with top coaching talent within days.",
    name: "Ashish",
    initials: "A",
    role: "Gym Owner",
    organization: "HOPE GYM & SPA",
    rating: 5,
  },
  {
    id: "2",
    quote:
      "The quality of trainers on FitWorks is exceptional. We quickly staffed Anyday Fitness with passionate, verified fitness professionals who bring discipline and energy to our floor every day.",
    name: "Gagan Arora",
    initials: "GA",
    role: "Owner & Managing Director",
    organization: "Anyday Fitness",
    rating: 5,
  },
];
