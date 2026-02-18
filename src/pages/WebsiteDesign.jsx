import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";

export default function WebsiteDesign() {
    const [questions, setQuestions] = useState([]);
    const [released, setReleased] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [participants, setParticipants] = useState("");
    const [answers, setAnswers] = useState({});
    const [status, setStatus] = useState({ type: "", message: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const snap = await getDoc(doc(db, "event_questions", "master"));
                if (snap.exists()) {
                    const d = snap.data();
                    setReleased(d.websiteDesign?.released ?? false);
                    const visible = (d.websiteDesign?.questions ?? []).filter((q) => q.released);
                    setQuestions(visible);
                    const init = {};
                    visible.forEach((_, i) => { init[i] = ""; });
                    setAnswers(init);
                }
            } catch (err) {
                console.error("Error fetching questions:", err);
            } finally {
                setFetchLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!participants.trim()) { setStatus({ type: "error", message: "Please enter your name." }); return; }
        const filledAnswers = Object.entries(answers).filter(([, v]) => v.trim());
        if (filledAnswers.length === 0) { setStatus({ type: "error", message: "Please provide at least one response." }); return; }
        setLoading(true);
        setStatus({ type: "", message: "" });
        try {
            const submissionAnswers = questions.map((q, i) => ({ requirement: q.text, response: (answers[i] || "").trim() }));
            await addDoc(collection(db, "website_design_submissions"), { submittedBy: participants.trim(), answers: submissionAnswers, event: "Website Design", timestamp: serverTimestamp() });
            setStatus({ type: "success", message: "Submission received successfully! 🎉" });
            setParticipants("");
            const reset = {};
            questions.forEach((_, i) => { reset[i] = ""; });
            setAnswers(reset);
        } catch (err) {
            console.error("Submission error:", err);
            setStatus({ type: "error", message: "Submission failed. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    const accentColor = "#c084fc";

    return (
        <div className="page-container">
            <Link to="/" className="back-link">
                <svg style={{ width: "1rem", height: "1rem" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                Back to Events
            </Link>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* ── Hero ── */}
                <div className="animate-fade-in-up">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                        <span className="event-badge" style={{ background: "rgba(168, 85, 247, 0.1)", border: "1px solid rgba(168, 85, 247, 0.2)", color: accentColor }}>🎨 Design</span>
                        <span className="event-badge" style={{ background: "rgba(251, 191, 36, 0.06)", border: "1px solid rgba(251, 191, 36, 0.15)", color: "#fde68a" }}>⏱ 75 Min</span>
                    </div>
                    <h1 style={{ fontFamily: "var(--font-family-heading)", fontWeight: 900, fontSize: "clamp(2.5rem, 8vw, 3.75rem)", letterSpacing: "-0.04em", lineHeight: 0.95, marginBottom: "0.75rem" }}>
                        <span style={{ background: "linear-gradient(135deg, #a855f7, #c084fc, #f0abfc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Website</span>{" "}
                        <span style={{ color: "var(--color-text-primary)" }}>Design</span>
                    </h1>
                    <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", maxWidth: "32rem", lineHeight: 1.7 }}>
                        Pixel-perfect recreation meets responsive excellence. Replicate the reference, add your creative flair, and deploy.
                    </p>
                </div>

                {/* ── Name ── */}
                <div className="animate-fade-in-up animate-delay-1 section-card" style={{ padding: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                        <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.125rem", background: `linear-gradient(135deg, ${accentColor}25, ${accentColor}10)`, border: `1px solid ${accentColor}30` }}>👤</div>
                        <div>
                            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text-primary)" }}>Your Name <span style={{ color: "var(--color-error)" }}>*</span></label>
                            <p style={{ fontSize: "0.6875rem", color: "var(--color-text-dim)", marginTop: "0.125rem" }}>Person submitting this response</p>
                        </div>
                    </div>
                    <input type="text" value={participants} onChange={(e) => setParticipants(e.target.value)} placeholder="e.g., John Doe" className="input-field" />
                </div>

                {/* ── How It Works ── */}
                <div className="animate-fade-in-up animate-delay-2 section-card" style={{ padding: "1.5rem" }}>
                    <p style={{ fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor, marginBottom: "1rem" }}>How It Works</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem" }}>
                        {[
                            { n: "01", icon: "🖼️", text: "Study the reference image" },
                            { n: "02", icon: "💻", text: "Build a responsive pixel-perfect clone" },
                            { n: "03", icon: "🔗", text: "Submit your live deployment link" },
                        ].map((s) => (
                            <div key={s.n} style={{ textAlign: "center", padding: "1rem 0.75rem", borderRadius: "0.875rem", background: "rgba(12, 17, 38, 0.4)", border: "1px solid rgba(71, 85, 105, 0.1)" }}>
                                <span style={{ fontSize: "1.5rem", display: "block", marginBottom: "0.5rem" }}>{s.icon}</span>
                                <span style={{ fontSize: "0.5625rem", fontWeight: 700, letterSpacing: "0.12em", color: accentColor, display: "block", marginBottom: "0.375rem" }}>STEP {s.n}</span>
                                <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>{s.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Requirements ── */}
                {fetchLoading ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "5rem 0" }}>
                        <div style={{ textAlign: "center" }}>
                            <span className="spinner spinner-lg" />
                            <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginTop: "1.25rem" }}>Loading requirements...</p>
                        </div>
                    </div>
                ) : !released ? (
                    <div className="section-card animate-fade-in-up animate-pulse-glow" style={{ padding: "3rem 2rem", textAlign: "center" }}>
                        <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "1rem" }}>⏳</span>
                        <p style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "0.5rem" }}>Requirements will be released soon</p>
                        <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Please wait for the coordinator to release the details.</p>
                    </div>
                ) : questions.length === 0 ? (
                    <div className="alert alert-warning" style={{ textAlign: "center" }}>
                        <p style={{ fontWeight: 600 }}>No requirements released yet. Check back shortly.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <p style={{ fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: accentColor }}>📝 Requirements & Responses</p>

                        {questions.map((q, i) => (
                            <div key={i} className={`animate-fade-in-up animate-delay-${Math.min(i + 1, 5)} section-card`} style={{ overflow: "hidden" }}>
                                <div className="code-block-header">
                                    <span>Requirement #{i + 1}</span>
                                    {q.imageUrl && <span style={{ marginLeft: "auto", fontSize: "0.5625rem", fontWeight: 400, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-dim)" }}>Reference Included</span>}
                                </div>

                                {q.imageUrl && (
                                    <div style={{ padding: "1.25rem", borderBottom: "1px solid var(--color-border-subtle)" }}>
                                        <a href={q.imageUrl} target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                                            <img src={q.imageUrl} alt={`Reference ${i + 1}`} style={{ width: "100%", borderRadius: "0.75rem", border: "1px solid var(--color-border-default)", boxShadow: "0 8px 30px rgba(0,0,0,0.4)", maxHeight: "500px", objectFit: "contain", background: "rgba(0,0,0,0.2)", transition: "transform 0.3s ease" }}
                                                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.01)"; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }} />
                                        </a>
                                        <p style={{ fontSize: "0.5625rem", color: "var(--color-text-dim)", marginTop: "0.75rem", textAlign: "center", letterSpacing: "0.1em", textTransform: "uppercase" }}>Click to view full size</p>
                                    </div>
                                )}

                                {q.text && (
                                    <div style={{ padding: "1rem 1.5rem", fontSize: "0.8125rem", color: "var(--color-text-muted)", lineHeight: 1.65, whiteSpace: "pre-wrap", borderBottom: "1px solid var(--color-border-subtle)", background: "rgba(12, 17, 38, 0.3)" }}>
                                        {q.text}
                                    </div>
                                )}

                                <div style={{ padding: "1.25rem", background: "rgba(8, 12, 30, 0.35)" }}>
                                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: "0.5rem" }}>
                                        <span style={{ width: "0.375rem", height: "0.375rem", borderRadius: "50%", background: accentColor }} />
                                        Your Response (GitHub / Deployment Link)
                                    </label>
                                    <input type="text" value={answers[i] || ""} onChange={(e) => setAnswers((prev) => ({ ...prev, [i]: e.target.value }))} placeholder="https://github.com/your-repo or https://your-site.vercel.app" className="input-field" />
                                </div>
                            </div>
                        ))}

                        <div className="section-divider" />

                        <div className="section-card section-card-glow" style={{ padding: "1.5rem" }}>
                            {status.message && (
                                <div className={`alert ${status.type === "success" ? "alert-success" : "alert-error"}`} style={{ marginBottom: "1rem" }}>
                                    <span style={{ fontWeight: 600 }}>{status.type === "success" ? "✅" : "❌"} {status.message}</span>
                                </div>
                            )}
                            <button type="submit" disabled={loading} className="btn-primary">
                                {loading ? (<><span className="spinner" /> Submitting...</>) : "🚀 Submit All Responses"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
