import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";

export default function BlindCode() {
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
                    setReleased(d.blindCode?.released ?? false);
                    const visible = (d.blindCode?.questions ?? []).filter((q) => q.released);
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
        if (!participants.trim()) {
            setStatus({ type: "error", message: "Please enter your name." });
            return;
        }
        const filledAnswers = Object.entries(answers).filter(([, v]) => v.trim());
        if (filledAnswers.length === 0) {
            setStatus({ type: "error", message: "Please provide at least one answer." });
            return;
        }

        setLoading(true);
        setStatus({ type: "", message: "" });
        try {
            const submissionAnswers = questions.map((q, i) => ({
                problem: q.text,
                code: (answers[i] || "").trim(),
            }));

            await addDoc(collection(db, "blind_code_submissions"), {
                submittedBy: participants.trim(),
                answers: submissionAnswers,
                event: "Blind Code",
                timestamp: serverTimestamp(),
            });
            setStatus({ type: "success", message: "Submission received successfully!" });
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

    return (
        <div className="page-container">
            <Link to="/" className="back-link">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                Back to Events
            </Link>

            {/* ── Hero Header ── */}
            <div className="animate-fade-in-up mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <div className="event-badge" style={{ background: "rgba(34, 211, 238, 0.08)", border: "1px solid rgba(34, 211, 238, 0.2)", color: "#22d3ee" }}>
                        👨‍💻 Challenge
                    </div>
                    <div className="event-badge" style={{ background: "rgba(248, 113, 133, 0.06)", border: "1px solid rgba(248, 113, 133, 0.15)", color: "#fca5a5" }}>
                        ✕ No IDE
                    </div>
                    <div className="event-badge" style={{ background: "rgba(251, 191, 36, 0.06)", border: "1px solid rgba(251, 191, 36, 0.15)", color: "#fde68a" }}>
                        ⏱ 75 Min
                    </div>
                </div>
                <h1 className="text-5xl sm:text-6xl font-black font-[family-name:var(--font-family-heading)] tracking-tighter mb-3 leading-[0.95]">
                    <span style={{
                        background: "linear-gradient(135deg, #3b82f6 0%, #22d3ee 60%, #a5f3fc 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text"
                    }}>Blind</span>
                    <br />
                    <span className="text-[var(--color-text-primary)]">Code</span>
                </h1>
                <p className="text-[var(--color-text-muted)] text-sm max-w-md leading-relaxed">
                    Write code that produces the expected output — no compiler, no debugger, no mercy. Pure mental execution.
                </p>
                <div className="section-divider" style={{ maxWidth: "6rem", margin: "1.5rem 0 0 0" }} />
            </div>

            {/* ── Your Name ── */}
            <div className="animate-fade-in-up animate-delay-1 section-card section-card-glow p-7 mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                        style={{ background: "linear-gradient(135deg, rgba(34, 211, 238, 0.15), rgba(59, 130, 246, 0.1))", border: "1px solid rgba(34, 211, 238, 0.2)" }}>
                        👤
                    </div>
                    <div>
                        <label className="form-label text-sm font-semibold" style={{ marginBottom: 0 }}>
                            Your Name <span className="required">*</span>
                        </label>
                        <p className="text-[0.6875rem] text-[var(--color-text-dim)]">Person submitting this response</p>
                    </div>
                </div>
                <input
                    type="text"
                    value={participants}
                    onChange={(e) => setParticipants(e.target.value)}
                    placeholder="e.g., John Doe"
                    className="input-field"
                />
            </div>

            {/* ── Instructions ── */}
            <div className="animate-fade-in-up animate-delay-2 section-card p-7 mb-10">
                <h3 className="section-heading text-sm uppercase tracking-widest" style={{ color: "#22d3ee", marginBottom: "1rem", fontSize: "0.6875rem" }}>
                    The Rules
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { step: "01", icon: "📋", text: "Read the expected output for each problem" },
                        { step: "02", icon: "✍️", text: "Write code blind — any language allowed" },
                        { step: "03", icon: "🚫", text: "No compiler or IDE feedback — write it right!" },
                    ].map((item) => (
                        <div key={item.step} className="text-center p-4 rounded-xl" style={{ background: "rgba(12, 17, 38, 0.4)", border: "1px solid var(--color-border-subtle)" }}>
                            <span className="text-2xl mb-2 block">{item.icon}</span>
                            <span className="text-[0.625rem] font-bold tracking-widest block mb-1" style={{ color: "#22d3ee" }}>
                                STEP {item.step}
                            </span>
                            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Problems + Inline Answers ── */}
            {fetchLoading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="text-center">
                        <span className="spinner spinner-lg" />
                        <p className="text-sm text-[var(--color-text-muted)] mt-5">Loading problems...</p>
                    </div>
                </div>
            ) : !released ? (
                <div className="section-card p-10 text-center animate-fade-in-up animate-pulse-glow">
                    <span className="text-4xl mb-4 block">⏳</span>
                    <p className="text-lg font-bold text-[var(--color-text-primary)] mb-2">Problems will be released soon</p>
                    <p className="text-sm text-[var(--color-text-muted)]">Please wait for the event coordinator to release the problems.</p>
                </div>
            ) : questions.length === 0 ? (
                <div className="alert alert-warning text-center mb-12 animate-fade-in-up">
                    <p className="font-semibold">No problems have been released yet. Check back shortly.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6 mb-10">
                        {questions.map((q, i) => (
                            <div key={i} className={`animate-fade-in-up animate-delay-${Math.min(i + 1, 5)} section-card overflow-hidden`}>
                                {/* Problem Header */}
                                <div className="code-block-header">
                                    Problem #{i + 1}
                                    <span className="ml-auto text-[0.625rem] font-normal tracking-wider uppercase text-[var(--color-text-dim)]">
                                        Expected Output
                                    </span>
                                </div>
                                <div className="code-block-body" style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
                                    {q.text}
                                </div>
                                {/* Answer */}
                                <div className="p-5" style={{ background: "rgba(8, 12, 30, 0.4)" }}>
                                    <label className="form-label text-xs flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#22d3ee" }} />
                                        Your Code
                                    </label>
                                    <textarea
                                        value={answers[i] || ""}
                                        onChange={(e) => setAnswers((prev) => ({ ...prev, [i]: e.target.value }))}
                                        placeholder="Write your code for this problem..."
                                        rows={8}
                                        className="input-field"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="section-divider" />

                    {/* Submit */}
                    <div className="section-card section-card-glow p-7 mt-8">
                        <h2 className="section-heading text-base flex items-center gap-2">
                            <span className="text-lg">🚀</span> Submit Your Solutions
                        </h2>
                        {status.message && (
                            <div className={`alert ${status.type === "success" ? "alert-success" : "alert-error"} mb-5`}>
                                <span className="font-semibold">{status.type === "success" ? "✅" : "❌"} {status.message}</span>
                            </div>
                        )}
                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? (<><span className="spinner" /> Submitting...</>) : "Submit All Answers"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
