import { Link } from "react-router-dom";

const events = [
    {
        title: "Coding Debugger",
        path: "/coding-debugger",
        icon: "🐛",
        tagline: "Hunt. Fix. Conquer.",
        description: "Squash the bugs lurking in broken code snippets — speed and precision win.",
        gradient: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
        glow: "rgba(99, 102, 241, 0.15)",
        accent: "#818cf8",
        tag: "Logic",
    },
    {
        title: "Website Design",
        path: "/website-design",
        icon: "🎨",
        tagline: "Pixel. Perfect. Craft.",
        description: "Recreate a reference layout with responsive finesse and stunning aesthetics.",
        gradient: "linear-gradient(135deg, #a855f7 0%, #c084fc 100%)",
        glow: "rgba(168, 85, 247, 0.15)",
        accent: "#c084fc",
        tag: "Design",
    },
    {
        title: "Blind Code",
        path: "/blind-code",
        icon: "👨‍💻",
        tagline: "No IDE. No Mercy.",
        description: "Write code for given outputs without any compiler — pure mental execution.",
        gradient: "linear-gradient(135deg, #3b82f6 0%, #22d3ee 100%)",
        glow: "rgba(59, 130, 246, 0.15)",
        accent: "#22d3ee",
        tag: "Challenge",
    },
];

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col" style={{ position: "relative", zIndex: 1 }}>
            {/* ── Hero ── */}
            <header className="pt-24 pb-8 px-6 text-center">
                {/* Live Badge */}
                <div className="animate-fade-in-up inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-10"
                    style={{ background: "rgba(99, 102, 241, 0.06)", border: "1px solid rgba(99, 102, 241, 0.15)" }}>
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                    </span>
                    <span className="text-xs font-semibold tracking-wider uppercase text-[var(--color-text-secondary)]">
                        Live Portal · 2026
                    </span>
                </div>

                {/* Title */}
                <h1 className="animate-fade-in-up animate-delay-1 text-6xl sm:text-7xl md:text-8xl font-black font-[family-name:var(--font-family-heading)] tracking-tighter mb-6 leading-[0.9]">
                    <span className="gradient-text">NIRMAAN</span>
                    <br />
                    <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--color-text-secondary)]"
                        style={{ display: "block", marginTop: "0.25em", letterSpacing: "0.2em" }}>
                        2 K 2 6
                    </span>
                </h1>

                <p className="animate-fade-in-up animate-delay-2 text-base sm:text-lg text-[var(--color-text-muted)] max-w-md mx-auto leading-relaxed mt-4">
                    Three challenges. One portal. Show your technical brilliance.
                </p>

                {/* Stat Chips */}
                <div className="animate-fade-in-up animate-delay-3 flex items-center justify-center gap-3 sm:gap-5 mt-10 flex-wrap">
                    {[
                        { label: "Events", value: "3", icon: "🏆" },
                        { label: "Minutes", value: "75", icon: "⏱" },
                        { label: "Live Now", value: "●", icon: "", isLive: true },
                    ].map((s) => (
                        <div key={s.label} className="stat-chip">
                            <span className="text-lg font-bold text-[var(--color-text-primary)]"
                                style={s.isLive ? { color: "var(--color-success)", fontSize: "0.75rem" } : {}}>
                                {s.icon} {s.value}
                            </span>
                            <span className="text-[0.625rem] uppercase tracking-widest text-[var(--color-text-dim)] mt-1 font-medium">
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="section-divider max-w-xs mx-auto mt-12" />
            </header>

            {/* ── Event Cards ── */}
            <main className="flex-1 px-6 pb-24 max-w-5xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
                    {events.map((event, i) => (
                        <Link
                            key={event.path}
                            to={event.path}
                            className={`animate-fade-in-up animate-delay-${i + 1}`}
                            style={{ textDecoration: "none" }}
                        >
                            <div className="group section-card card-shine h-full flex flex-col transition-all duration-400 cursor-pointer relative"
                                style={{ "--glow": event.accent }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = `0 8px 40px ${event.glow}, 0 0 80px ${event.glow}`;
                                    e.currentTarget.style.borderColor = `${event.accent}30`;
                                    e.currentTarget.style.transform = "translateY(-6px)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = "";
                                    e.currentTarget.style.borderColor = "";
                                    e.currentTarget.style.transform = "";
                                }}
                            >
                                {/* Top gradient bar */}
                                <div className="h-1 rounded-t-[1.25rem]" style={{ background: event.gradient }} />

                                <div className="p-7 flex flex-col flex-1">
                                    {/* Tag */}
                                    <div className="event-badge mb-5"
                                        style={{ background: `${event.accent}10`, border: `1px solid ${event.accent}20`, color: event.accent }}>
                                        {event.tag}
                                    </div>

                                    {/* Icon */}
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                                        style={{ background: event.gradient, boxShadow: `0 8px 30px ${event.glow}` }}>
                                        {event.icon}
                                    </div>

                                    {/* Content */}
                                    <h2 className="text-xl font-bold font-[family-name:var(--font-family-heading)] text-[var(--color-text-primary)] mb-1 tracking-tight">
                                        {event.title}
                                    </h2>
                                    <p className="text-xs font-semibold tracking-wider uppercase mb-3"
                                        style={{ color: event.accent, opacity: 0.7 }}>
                                        {event.tagline}
                                    </p>
                                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed flex-1">
                                        {event.description}
                                    </p>

                                    {/* CTA */}
                                    <div className="mt-6 pt-5 flex items-center justify-between text-sm font-semibold"
                                        style={{ borderTop: `1px solid ${event.accent}15`, color: event.accent }}>
                                        <span>Enter Challenge</span>
                                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

            {/* ── Footer ── */}
            <footer className="py-10 text-center" style={{ borderTop: "1px solid rgba(99, 102, 241, 0.08)" }}>
                <p className="text-xs text-[var(--color-text-dim)] tracking-wide">
                    NIRMAAN 2K26 · Crafted with <span className="text-[var(--color-error)]">♥</span> for Technical Excellence
                </p>
            </footer>
        </div>
    );
}
