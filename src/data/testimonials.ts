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
      "FitWorks has completely transformed how we hire at HOPE GYM&SPA. Finding certified, background-verified trainers used to take weeks—now we connect with top coaching talent within days.",
    name: "Ashish",
    role: "Gym Owner",
    organization: "HOPE GYM&SPA",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "2",
    quote:
      "The quality of trainers on FitWorks is exceptional. We quickly staffed Anyday Fitness with passionate, verified fitness professionals who bring discipline and energy to our floor every day.",
    name: "Gagan Arora",
    role: "Owner & Managing Director",
    organization: "Anyday Fitness",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    quote:
      "I was struggling to find trusted opportunities that valued my international certifications. Within two weeks of getting verified on FitWorks, I connected with premium gyms and secured my dream coaching role.",
    name: "Priya Sharma",
    role: "Senior Strength & Functional Coach",
    organization: "Verified Trainer",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  },
];
