"use client";

const gyms = [
  "✻ cult.fit",
  "⊛ ANYTIME FITNESS",
  "snap FITNESS 24·7",
  "THE FIT FACTORY",
  "GOLD'S GYM",
  "FITNESS FIRST",
  "✻ cult.fit",
  "⊛ ANYTIME FITNESS",
  "snap FITNESS 24·7",
  "THE FIT FACTORY",
  "GOLD'S GYM",
  "FITNESS FIRST",
];

export default function TrustedBy() {
  return (
    <section className="w-full bg-[#f5f5f6] py-8 mt-8 overflow-hidden">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] text-center mb-6">
        Trusted by 850+ Gyms Across India
      </p>

      {/* Infinite scroll marquee */}
      <div className="relative w-full">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#f5f5f6] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#f5f5f6] to-transparent z-10" />

        <div className="flex animate-marquee">
          {gyms.map((name, idx) => (
            <span
              key={idx}
              className="text-2xl font-bold tracking-tight text-gray-800 opacity-50 whitespace-nowrap mx-12 shrink-0"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
