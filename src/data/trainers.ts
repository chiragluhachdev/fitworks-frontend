export interface Trainer {
  id: string;
  name: string;
  title: string;
  location: string;
  experience: string;
  compensation: string;
  rating: number;
  reviewCount: number;
  specializations: string[];
  verified: boolean;
  avatar: string;
}

export const trainers: Trainer[] = [
  {
    id: "rohit-sharma",
    name: "Rohit Sharma",
    title: "Strength & Conditioning Coach",
    location: "Delhi, India",
    experience: "6 Years",
    compensation: "₹20,000 / month",
    rating: 4.9,
    reviewCount: 48,
    specializations: ["Strength Training", "HIIT", "Sports Performance"],
    verified: true,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop", // Professional headshot man
  },
  {
    id: "priya-mehta",
    name: "Priya Mehta",
    title: "Personal Trainer",
    location: "Mumbai, India",
    experience: "4 Years",
    compensation: "₹18,000 / month",
    rating: 4.8,
    reviewCount: 36,
    specializations: ["Weight Loss", "Yoga", "Functional Training"],
    verified: true,
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=600&auto=format&fit=crop", // Professional headshot woman
  },
  {
    id: "arjun-reddy",
    name: "Arjun Reddy",
    title: "CrossFit Coach",
    location: "Bangalore, India",
    experience: "5 Years",
    compensation: "₹22,000 / month",
    rating: 4.7,
    reviewCount: 29,
    specializations: ["CrossFit", "Olympic Lifting", "Endurance"],
    verified: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop", // Professional headshot man
  },
  {
    id: "sneha-kapoor",
    name: "Sneha Kapoor",
    title: "Yoga & Wellness Coach",
    location: "Pune, India",
    experience: "7 Years",
    compensation: "₹15,000 / month",
    rating: 5.0,
    reviewCount: 62,
    specializations: ["Yoga", "Meditation", "Flexibility"],
    verified: true,
    avatar: "https://images.unsplash.com/photo-1699899657680-421c2c2d5064?q=80&w=600&auto=format&fit=crop", // Professional headshot woman
  },
  {
    id: "karan-singh",
    name: "Karan Singh",
    title: "Bodybuilding Coach",
    location: "Chandigarh, India",
    experience: "8 Years",
    compensation: "₹25,000 / month",
    rating: 4.9,
    reviewCount: 84,
    specializations: ["Bodybuilding", "Nutrition", "Hypertrophy"],
    verified: true,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop", // Professional headshot man
  },
  {
    id: "aisha-khan",
    name: "Aisha Khan",
    title: "Pilates Instructor",
    location: "Hyderabad, India",
    experience: "3 Years",
    compensation: "₹16,000 / month",
    rating: 4.6,
    reviewCount: 21,
    specializations: ["Pilates", "Core Strength", "Rehab"],
    verified: false,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop", // Professional headshot woman
  },
  {
    id: "vikram-desai",
    name: "Vikram Desai",
    title: "Fitness Trainer",
    location: "Ahmedabad, India",
    experience: "10 Years",
    compensation: "₹30,000 / month",
    rating: 4.9,
    reviewCount: 112,
    specializations: ["Weight Loss", "Senior Fitness", "Mobility"],
    verified: true,
    avatar: "https://images.unsplash.com/photo-1652471943570-f3590a4e52ed?q=80&w=600&auto=format&fit=crop", // Professional headshot man
  },
  {
    id: "neha-sharma",
    name: "Neha Sharma",
    title: "Aerobics & Zumba Expert",
    location: "Jaipur, India",
    experience: "5 Years",
    compensation: "₹14,000 / month",
    rating: 4.7,
    reviewCount: 45,
    specializations: ["Zumba", "Aerobics", "Cardio"],
    verified: true,
    avatar: "https://images.unsplash.com/photo-1701096374092-bb70915fdc5c?q=80&w=600&auto=format&fit=crop", // Professional headshot woman
  }
];
