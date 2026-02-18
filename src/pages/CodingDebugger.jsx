import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";

export default function CodingDebugger() {
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
                    setReleased(d.codingDebugger?.released ?? false);
                    const visible = (d.codingDebugger?.questions ?? []).filter((q) => q.released);
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
        if (filledAnswers.length === 0) { setStatus({ type: "error", message: "Please provide at least one answer." }); return; }
        setLoading(true);
        setStatus({ type: "", message: "" });
        try {
            const submissionAnswers = questions.map((q, i) => ({ question: q.text, answer: (answers[i] || "").trim() }));
            await addDoc(collection(db, "coding_debugger_submissions"), { submittedBy: participants.trim(), answers: submissionAnswers, event: "Coding Debugger", timestamp: serverTimestamp() });
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

    const accentColor = "#818cf8";

    return (
        <div className="page-container">
            <Link to="/" className="back-link">
                <svg style={{ width: "1rem", height: "1rem" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                Back to Events
            </Link>

            {/* ── Hero ── */}
            <div className="animate-fade-in-up" style={{ marginBottom: "2.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                    <span className="event-badge" style={{ background: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.2)", color: accentColor }}>🐛 Logic</span>
                    <span className="event-badge" style={{ background: "rgba(251, 191, 36, 0.06)", border: "1px solid rgba(251, 191, 36, 0.15)", color: "#fde68a" }}>⏱ 75 Min</span>
                </div>
                <h1 style={{ fontFamily: "var(--font-family-heading)", fontWeight: 900, fontSize: "clamp(2.5rem, 8vw, 3.75rem)", letterSpacing: "-0.04em", lineHeight: 0.95, marginBottom: "0.75rem" }}>
                    <span className="gradient-text">Coding</span>{" "}
                    <span style={{ color: "var(--color-text-primary)" }}>Debugger</span>
                </h1>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", maxWidth: "28rem", lineHeight: 1.7 }}>
                    Spot the bugs. Write the fix. Every line counts — precision and speed determine the winner.
                </p>
            </div>

            {/* ── Name ── */}
            <div className="animate-fade-in-up animate-delay-1 section-card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
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
            <div className="animate-fade-in-up animate-delay-2 section-card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
                <p style={{ fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor, marginBottom: "1rem" }}>How It Works</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem" }}>
                    {[
                        { n: "01", icon: "🔍", text: "Read the buggy code" },
                        { n: "02", icon: "✏️", text: "Write your corrected version" },
                        { n: "03", icon: "🚀", text: "Submit all fixes together" },
                    ].map((s) => (
                        <div key={s.n} style={{ textAlign: "center", padding: "1rem 0.75rem", borderRadius: "0.875rem", background: "rgba(12, 17, 38, 0.4)", border: "1px solid rgba(71, 85, 105, 0.1)" }}>
                            <span style={{ fontSize: "1.5rem", display: "block", marginBottom: "0.5rem" }}>{s.icon}</span>
                            <span style={{ fontSize: "0.5625rem", fontWeight: 700, letterSpacing: "0.12em", color: accentColor, display: "block", marginBottom: "0.375rem" }}>STEP {s.n}</span>
                            <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>{s.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Questions ── */}
            {fetchLoading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "5rem 0" }}>
                    <div style={{ textAlign: "center" }}>
                        <span className="spinner spinner-lg" />
                        <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginTop: "1.25rem" }}>Loading questions...</p>
                    </div>
                </div>
            ) : !released ? (
                <div className="section-card animate-fade-in-up animate-pulse-glow" style={{ padding: "3rem 2rem", textAlign: "center" }}>
                    <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "1rem" }}>⏳</span>
                    <p style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "0.5rem" }}>Questions will be released soon</p>
                    <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Please wait for the coordinator to release questions.</p>
                </div>
            ) : questions.length === 0 ? (
                <div className="alert alert-warning" style={{ textAlign: "center" }}>
                    <p style={{ fontWeight: 600 }}>No questions released yet. Check back shortly.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2rem" }}>
                        {questions.map((q, i) => (
                            <div key={i} className={`animate-fade-in-up animate-delay-${Math.min(i + 1, 5)} section-card`} style={{ overflow: "hidden" }}>
                                <div className="code-block-header">
                                    <span>Question #{i + 1}</span>
                                    <span style={{ marginLeft: "auto", fontSize: "0.5625rem", fontWeight: 400, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-dim)" }}>Buggy Code</span>
                                </div>
                                <div className="code-block-body" style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>{q.text}</div>
                                <div style={{ padding: "1.25rem", background: "rgba(8, 12, 30, 0.35)" }}>
                                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: "0.5rem" }}>
                                        <span style={{ width: "0.375rem", height: "0.375rem", borderRadius: "50%", background: "#34d399" }} />
                                        Your Corrected Code
                                    </label>
                                    <textarea value={answers[i] || ""} onChange={(e) => setAnswers((prev) => ({ ...prev, [i]: e.target.value }))} placeholder="Paste your corrected code..." rows={6} className="input-field" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="section-divider" />

                    <div className="section-card section-card-glow" style={{ padding: "1.5rem", marginTop: "1.5rem" }}>
                        {status.message && (
                            <div className={`alert ${status.type === "success" ? "alert-success" : "alert-error"}`} style={{ marginBottom: "1rem" }}>
                                <span style={{ fontWeight: 600 }}>{status.type === "success" ? "✅" : "❌"} {status.message}</span>
                            </div>
                        )}
                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? (<><span className="spinner" /> Submitting...</>) : "🚀 Submit All Answers"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
