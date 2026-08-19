export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  organization: string;
  rating: number;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "FitWorks has completely transformed how we hire. The quality of verified trainers we found through the platform allowed us to elevate our entire gym experience. It's simply the best hiring solution out there.",
    name: "Vikram R.",
    role: "Owner",
    organization: "HOPE GYM&SPA",
    rating: 5,
    avatar: "https://i.pravatar.cc/100?img=60",
  },
  {
    id: "2",
    quote:
      "I was struggling to find good opportunities that matched my expertise. Within two weeks of joining FitWorks, I had three amazing offers and landed my dream role at a premium fitness center.",
    name: "Nidhi S.",
    role: "Premium Fitness Coach",
    organization: "Verified Trainer",
    rating: 5,
    avatar: "https://i.pravatar.cc/100?img=32",
  },
];
