import { Link } from "react-router-dom";

const events = [
    {
        title: "Coding Debugger",
        path: "/coding-debugger",
        icon: "🐛",
        tagline: "Hunt. Fix. Conquer.",
        description: "Squash the bugs lurking in broken code snippets — speed and precision win the race.",
        gradient: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
        glow: "rgba(99, 102, 241, 0.18)",
        accent: "#818cf8",
        tag: "Logic",
    },
    {
        title: "Website Design",
        path: "/website-design",
        icon: "🎨",
        tagline: "Pixel. Perfect. Craft.",
        description: "Recreate a reference layout with responsive finesse and stunning visual aesthetics.",
        gradient: "linear-gradient(135deg, #a855f7 0%, #c084fc 100%)",
        glow: "rgba(168, 85, 247, 0.18)",
        accent: "#c084fc",
        tag: "Design",
    },
    {
        title: "Blind Code",
        path: "/blind-code",
        icon: "👨‍💻",
        tagline: "No IDE. No Mercy.",
        description: "Write code for given outputs without any compiler feedback — pure mental execution.",
        gradient: "linear-gradient(135deg, #3b82f6 0%, #22d3ee 100%)",
        glow: "rgba(59, 130, 246, 0.18)",
        accent: "#22d3ee",
        tag: "Challenge",
    },
];

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col" style={{ position: "relative", zIndex: 1 }}>
            {/* ── Hero ── */}
            <header style={{ paddingTop: "5rem", paddingBottom: "2rem", paddingLeft: "1.5rem", paddingRight: "1.5rem", textAlign: "center" }}>
                {/* Live Badge */}
                <div className="animate-fade-in-up" style={{ display: "inline-flex", alignItems: "center", gap: "0.625rem", padding: "0.5rem 1.25rem", borderRadius: "9999px", marginBottom: "2rem", background: "rgba(99, 102, 241, 0.06)", border: "1px solid rgba(99, 102, 241, 0.15)" }}>
                    <span style={{ position: "relative", display: "flex", height: "0.5rem", width: "0.5rem" }}>
                        <span className="animate-ping" style={{ position: "absolute", display: "inline-flex", height: "100%", width: "100%", borderRadius: "9999px", background: "#34d399", opacity: 0.75 }} />
                        <span style={{ position: "relative", display: "inline-flex", borderRadius: "9999px", height: "0.5rem", width: "0.5rem", background: "#34d399" }} />
                    </span>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-secondary)" }}>
                        Live Portal · 2026
                    </span>
                </div>

                {/* Title */}
                <h1 className="animate-fade-in-up animate-delay-1" style={{ fontFamily: "var(--font-family-heading)", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: "0.5rem", lineHeight: 0.95, fontSize: "clamp(3.5rem, 10vw, 6rem)" }}>
                    <span className="gradient-text">NIRMAAN</span>
                </h1>
                <p className="animate-fade-in-up animate-delay-1" style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 800, color: "var(--color-text-secondary)", letterSpacing: "0.25em", fontFamily: "var(--font-family-heading)", marginBottom: "1.5rem" }}>
                    2 K 2 6
                </p>

                <p className="animate-fade-in-up animate-delay-2" style={{ fontSize: "1rem", color: "var(--color-text-muted)", maxWidth: "28rem", margin: "0 auto", lineHeight: 1.7 }}>
                    Three challenges. One portal.
                    <br />
                    <span style={{ color: "var(--color-text-secondary)", fontWeight: 500 }}>Show your technical brilliance.</span>
                </p>

                {/* Stat Chips */}
                <div className="animate-fade-in-up animate-delay-3" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
                    {[
                        { label: "Events", value: "3", icon: "🏆" },
                        { label: "Minutes", value: "75", icon: "⏱" },
                        { label: "Status", value: "Live", dotColor: "#34d399" },
                    ].map((s) => (
                        <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0.875rem 1.5rem", borderRadius: "1rem", background: "rgba(12, 17, 38, 0.5)", border: "1px solid rgba(71, 85, 105, 0.15)" }}>
                            <span style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-text-primary)", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                {s.dotColor ? (
                                    <span style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%", background: s.dotColor, display: "inline-block" }} />
                                ) : (
                                    <span>{s.icon}</span>
                                )}
                                {s.value}
                            </span>
                            <span style={{ fontSize: "0.5625rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--color-text-dim)", marginTop: "0.25rem", fontWeight: 600 }}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.2), rgba(167, 139, 250, 0.2), transparent)", maxWidth: "16rem", margin: "3rem auto 0 auto" }} />
            </header>

            {/* ── Event Cards ── */}
            <main style={{ flex: 1, padding: "1rem 1.5rem 5rem", maxWidth: "68rem", margin: "0 auto", width: "100%" }}>
                <p className="animate-fade-in-up" style={{ textAlign: "center", fontSize: "0.6875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--color-text-dim)", marginBottom: "1.5rem" }}>
                    Choose Your Challenge
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
                    {events.map((event, i) => (
                        <Link
                            key={event.path}
                            to={event.path}
                            className={`animate-fade-in-up animate-delay-${i + 1}`}
                            style={{ textDecoration: "none", display: "block" }}
                        >
                            <div className="card-shine"
                                style={{
                                    position: "relative",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    background: "var(--color-bg-card)",
                                    backdropFilter: "blur(20px)",
                                    border: "1px solid rgba(99, 102, 241, 0.12)",
                                    borderRadius: "1.25rem",
                                    overflow: "hidden",
                                    cursor: "pointer",
                                    transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.03) inset",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-8px)";
                                    e.currentTarget.style.boxShadow = `0 20px 50px ${event.glow}, 0 0 80px ${event.glow}, 0 0 0 1px rgba(255, 255, 255, 0.05) inset`;
                                    e.currentTarget.style.borderColor = `${event.accent}40`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "";
                                    e.currentTarget.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.03) inset";
                                    e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.12)";
                                }}
                            >
                                {/* Top gradient bar */}
                                <div style={{ height: "3px", background: event.gradient }} />

                                <div style={{ padding: "1.75rem", display: "flex", flexDirection: "column", flex: 1 }}>
                                    {/* Tag */}
                                    <span style={{
                                        alignSelf: "flex-start",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "0.375rem",
                                        padding: "0.3rem 0.875rem",
                                        borderRadius: "9999px",
                                        fontSize: "0.625rem",
                                        fontWeight: 700,
                                        letterSpacing: "0.06em",
                                        textTransform: "uppercase",
                                        background: `${event.accent}12`,
                                        border: `1px solid ${event.accent}25`,
                                        color: event.accent,
                                        marginBottom: "1.25rem",
                                    }}>
                                        {event.tag}
                                    </span>

                                    {/* Icon */}
                                    <div style={{
                                        width: "3.5rem",
                                        height: "3.5rem",
                                        borderRadius: "1rem",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "1.5rem",
                                        marginBottom: "1.25rem",
                                        background: event.gradient,
                                        boxShadow: `0 8px 25px ${event.glow}`,
                                        transition: "transform 0.3s ease",
                                    }}>
                                        {event.icon}
                                    </div>

                                    {/* Content */}
                                    <h2 style={{ fontSize: "1.25rem", fontWeight: 700, fontFamily: "var(--font-family-heading)", color: "var(--color-text-primary)", marginBottom: "0.25rem", letterSpacing: "-0.02em" }}>
                                        {event.title}
                                    </h2>
                                    <p style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: event.accent, opacity: 0.7, marginBottom: "0.75rem" }}>
                                        {event.tagline}
                                    </p>
                                    <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", lineHeight: 1.65, flex: 1 }}>
                                        {event.description}
                                    </p>

                                    {/* CTA */}
                                    <div style={{
                                        marginTop: "1.5rem",
                                        paddingTop: "1.25rem",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        fontSize: "0.8125rem",
                                        fontWeight: 600,
                                        borderTop: `1px solid ${event.accent}15`,
                                        color: event.accent,
                                    }}>
                                        <span>Enter Challenge</span>
                                        <svg style={{ width: "1.125rem", height: "1.125rem", transition: "transform 0.3s ease" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
            <footer style={{ padding: "2.5rem 1.5rem", textAlign: "center", borderTop: "1px solid rgba(99, 102, 241, 0.06)" }}>
                <p style={{ fontSize: "0.6875rem", color: "var(--color-text-dim)", letterSpacing: "0.04em" }}>
                    NIRMAAN 2K26 · Crafted with <span style={{ color: "#fb7185" }}>♥</span> for Technical Excellence
                </p>
            </footer>
        </div>
    );
}
