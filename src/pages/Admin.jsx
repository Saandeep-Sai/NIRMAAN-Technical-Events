import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const ADMIN_PASSCODE = "NIRMAAN2026";

const INITIAL_STRUCTURE = {
    codingDebugger: { released: false, questions: [] },
    websiteDesign: { released: false, questions: [] },
    blindCode: { released: false, questions: [] },
};

const EVENTS = [
    { key: "codingDebugger", label: "Coding Debugger", emoji: "🐛", accent: "#818cf8", gradient: "linear-gradient(135deg, #6366f1, #818cf8)" },
    { key: "websiteDesign", label: "Website Design", emoji: "🎨", accent: "#c084fc", gradient: "linear-gradient(135deg, #a855f7, #c084fc)" },
    { key: "blindCode", label: "Blind Code", emoji: "👨‍💻", accent: "#22d3ee", gradient: "linear-gradient(135deg, #3b82f6, #22d3ee)" },
];

/* ── Toggle Switch ── */
function Toggle({ checked, onChange, label }) {
    return (
        <button type="button" onClick={onChange} aria-label={label}
            style={{
                position: "relative", width: "2.75rem", height: "1.5rem", borderRadius: "9999px",
                transition: "all 0.3s ease", cursor: "pointer", border: "none", flexShrink: 0,
                background: checked ? "var(--color-accent-purple)" : "rgba(71, 85, 105, 0.4)",
                boxShadow: checked ? "0 0 14px rgba(139, 92, 246, 0.3)" : "none",
            }}>
            <span style={{
                position: "absolute", top: "3px", left: "3px",
                width: "18px", height: "18px", borderRadius: "50%",
                background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                transition: "transform 0.3s ease",
                transform: checked ? "translateX(20px)" : "translateX(0)",
            }} />
        </button>
    );
}

export default function Admin() {
    const [authenticated, setAuthenticated] = useState(false);
    const [passcode, setPasscode] = useState("");
    const [passcodeError, setPasscodeError] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState({});
    const [saveMsg, setSaveMsg] = useState({});
    const [uploading, setUploading] = useState({});
    const [activeTab, setActiveTab] = useState("codingDebugger");

    const handleLogin = (e) => {
        e.preventDefault();
        if (passcode === ADMIN_PASSCODE) { setAuthenticated(true); setPasscodeError(""); }
        else { setPasscodeError("Incorrect passcode. Please try again."); }
    };

    useEffect(() => {
        if (!authenticated) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, "event_questions", "master");
                const snap = await getDoc(docRef);
                if (snap.exists()) { setData(snap.data()); }
                else { await setDoc(docRef, INITIAL_STRUCTURE); setData({ ...INITIAL_STRUCTURE }); }
            } catch (err) { console.error("Failed to load questions:", err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, [authenticated]);

    /* ── Question CRUD ── */
    const handleQuestionChange = (eventKey, index, value) => {
        setData((prev) => {
            const updated = { ...prev };
            const questions = [...updated[eventKey].questions];
            questions[index] = { ...questions[index], text: value };
            updated[eventKey] = { ...updated[eventKey], questions };
            return updated;
        });
    };

    const toggleQuestionRelease = (eventKey, index) => {
        setData((prev) => {
            const updated = { ...prev };
            const questions = [...updated[eventKey].questions];
            questions[index] = { ...questions[index], released: !questions[index].released };
            updated[eventKey] = { ...updated[eventKey], questions };
            return updated;
        });
    };

    const addQuestion = (eventKey) => {
        setData((prev) => {
            const updated = { ...prev };
            const newQ = { text: "", released: false };
            if (eventKey === "websiteDesign") newQ.imageUrl = "";
            const questions = [...updated[eventKey].questions, newQ];
            updated[eventKey] = { ...updated[eventKey], questions };
            return updated;
        });
    };

    const deleteQuestion = (eventKey, index) => {
        setData((prev) => {
            const updated = { ...prev };
            const questions = updated[eventKey].questions.filter((_, i) => i !== index);
            updated[eventKey] = { ...updated[eventKey], questions };
            return updated;
        });
    };

    /* ── Image (Website Design) ── */
    const handleImageUpload = (index, file) => {
        if (!file) return;
        if (file.size > 800_000) { alert("Image too large. Max 800 KB."); return; }
        const uploadKey = `ws_${index}`;
        setUploading((prev) => ({ ...prev, [uploadKey]: true }));
        const reader = new FileReader();
        reader.onload = () => {
            setData((prev) => {
                const updated = { ...prev };
                const questions = [...updated.websiteDesign.questions];
                questions[index] = { ...questions[index], imageUrl: reader.result };
                updated.websiteDesign = { ...updated.websiteDesign, questions };
                return updated;
            });
            setUploading((prev) => ({ ...prev, [uploadKey]: false }));
        };
        reader.onerror = () => { alert("Failed to read image."); setUploading((prev) => ({ ...prev, [uploadKey]: false })); };
        reader.readAsDataURL(file);
    };

    const removeImage = (index) => {
        setData((prev) => {
            const updated = { ...prev };
            const questions = [...updated.websiteDesign.questions];
            questions[index] = { ...questions[index], imageUrl: "" };
            updated.websiteDesign = { ...updated.websiteDesign, questions };
            return updated;
        });
    };

    /* ── Save + Release ── */
    const saveQuestions = async (eventKey) => {
        setSaving((prev) => ({ ...prev, [eventKey]: true }));
        setSaveMsg((prev) => ({ ...prev, [eventKey]: "" }));
        try {
            const docRef = doc(db, "event_questions", "master");
            await updateDoc(docRef, { [eventKey]: data[eventKey] });
            setSaveMsg((prev) => ({ ...prev, [eventKey]: "saved" }));
            setTimeout(() => setSaveMsg((prev) => ({ ...prev, [eventKey]: "" })), 3000);
        } catch (err) {
            console.error("Save error:", err);
            setSaveMsg((prev) => ({ ...prev, [eventKey]: "error" }));
        } finally {
            setSaving((prev) => ({ ...prev, [eventKey]: false }));
        }
    };

    const toggleEventRelease = async (eventKey) => {
        const newVal = !data[eventKey].released;
        setData((prev) => ({ ...prev, [eventKey]: { ...prev[eventKey], released: newVal } }));
        try {
            const docRef = doc(db, "event_questions", "master");
            await updateDoc(docRef, { [`${eventKey}.released`]: newVal });
        } catch (err) {
            console.error("Toggle error:", err);
            setData((prev) => ({ ...prev, [eventKey]: { ...prev[eventKey], released: !newVal } }));
        }
    };

    /* ════════════════════════════════════════════════════
       RENDER
       ════════════════════════════════════════════════════ */

    // ── Login Screen ──
    if (!authenticated) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", position: "relative", zIndex: 1 }}>
                <div style={{ width: "100%", maxWidth: "380px" }} className="animate-fade-in-up">
                    <div className="section-card section-card-glow" style={{ padding: "2.5rem", textAlign: "center" }}>
                        <div style={{ width: "4rem", height: "4rem", borderRadius: "1rem", margin: "0 auto 1.5rem", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem", background: "linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(99, 102, 241, 0.2))", border: "1px solid rgba(139, 92, 246, 0.2)" }}>
                            🔐
                        </div>
                        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-family-heading)", color: "var(--color-text-primary)", marginBottom: "0.25rem" }}>Admin Access</h1>
                        <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", marginBottom: "2rem" }}>Enter your passcode to manage events</p>

                        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)}
                                placeholder="• • • • • • • •" className="input-field" autoFocus
                                style={{ textAlign: "center", letterSpacing: "0.3em" }} />
                            {passcodeError && (
                                <div className="alert alert-error" style={{ textAlign: "center", padding: "0.5rem", fontSize: "0.8125rem" }}>{passcodeError}</div>
                            )}
                            <button type="submit" className="btn-primary">Unlock Dashboard</button>
                        </form>

                        <Link to="/" style={{ display: "block", fontSize: "0.75rem", color: "var(--color-text-dim)", marginTop: "1.5rem", textDecoration: "none" }}>
                            ← Back to Portal
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ── Loading ──
    if (loading || !data) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                    <span className="spinner spinner-lg" />
                    <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginTop: "1.25rem" }}>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const activeEvent = EVENTS.find((e) => e.key === activeTab);
    const eventData = data[activeTab];
    const isWebDesign = activeTab === "websiteDesign";
    const qCount = eventData.questions.length;
    const visCount = eventData.questions.filter((q) => q.released).length;

    // ── Dashboard ──
    return (
        <div className="page-container" style={{ maxWidth: "64rem" }}>
            {/* Header */}
            <div className="animate-fade-in-up" style={{ marginBottom: "2rem" }}>
                <Link to="/" className="back-link">
                    <svg style={{ width: "1rem", height: "1rem" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    Back to Portal
                </Link>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                        <h1 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(1.75rem, 5vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.25rem" }}>
                            <span className="gradient-text">Admin Dashboard</span>
                        </h1>
                        <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>Manage questions and control visibility for each event</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.375rem 0.875rem", borderRadius: "9999px", fontSize: "0.6875rem", fontWeight: 600, background: "rgba(52, 211, 153, 0.08)", border: "1px solid rgba(52, 211, 153, 0.2)", color: "var(--color-success)" }}>
                        <span style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%", background: "#34d399" }} className="animate-pulse" />
                        Admin Mode
                    </div>
                </div>
            </div>

            {/* ── Tab Navigation ── */}
            <div className="animate-fade-in-up animate-delay-1" style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
                {EVENTS.map((ev) => {
                    const isActive = activeTab === ev.key;
                    const evData = data[ev.key];
                    return (
                        <button key={ev.key} onClick={() => setActiveTab(ev.key)}
                            style={{
                                display: "flex", alignItems: "center", gap: "0.625rem",
                                padding: "0.875rem 1.25rem", borderRadius: "0.875rem",
                                border: isActive ? `1px solid ${ev.accent}40` : "1px solid var(--color-border-subtle)",
                                background: isActive ? `${ev.accent}0D` : "rgba(12, 17, 38, 0.4)",
                                cursor: "pointer", transition: "all 0.3s ease",
                                boxShadow: isActive ? `0 4px 20px ${ev.accent}15` : "none",
                                minWidth: "fit-content", flex: "1",
                            }}>
                            <span style={{ fontSize: "1.25rem" }}>{ev.emoji}</span>
                            <div style={{ textAlign: "left" }}>
                                <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: isActive ? ev.accent : "var(--color-text-secondary)", whiteSpace: "nowrap" }}>
                                    {ev.label}
                                </p>
                                <p style={{ fontSize: "0.5625rem", color: "var(--color-text-dim)", marginTop: "0.125rem" }}>
                                    {evData.questions.length} Q · {evData.released ? "Live" : "Hidden"}
                                </p>
                            </div>
                            {evData.released && (
                                <span style={{ width: "0.375rem", height: "0.375rem", borderRadius: "50%", background: "#34d399", marginLeft: "auto", flexShrink: 0 }} />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* ── Active Event Panel ── */}
            <div className="animate-fade-in-up section-card" style={{ overflow: "hidden" }} key={activeTab}>
                {/* Panel Header */}
                <div style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", borderBottom: "1px solid var(--color-border-default)", background: "rgba(15, 23, 42, 0.4)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", background: activeEvent.gradient, boxShadow: `0 4px 15px ${activeEvent.accent}25` }}>
                            {activeEvent.emoji}
                        </div>
                        <div>
                            <h2 style={{ fontSize: "1.125rem", fontWeight: 700, fontFamily: "var(--font-family-heading)", color: "var(--color-text-primary)" }}>{activeEvent.label}</h2>
                            <p style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)", marginTop: "0.125rem" }}>
                                {qCount} question{qCount !== 1 ? "s" : ""} · {visCount} visible to participants
                            </p>
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                        <span style={{
                            fontSize: "0.6875rem", fontWeight: 600,
                            padding: "0.25rem 0.75rem", borderRadius: "9999px",
                            background: eventData.released ? "rgba(52, 211, 153, 0.08)" : "rgba(248, 113, 133, 0.06)",
                            color: eventData.released ? "var(--color-success)" : "var(--color-text-dim)",
                            border: eventData.released ? "1px solid rgba(52, 211, 153, 0.15)" : "1px solid rgba(248, 113, 133, 0.1)",
                        }}>
                            {eventData.released ? "● Live" : "○ Hidden"}
                        </span>
                        <Toggle checked={eventData.released} onChange={() => toggleEventRelease(activeTab)} label={`Toggle ${activeEvent.label}`} />
                    </div>
                </div>

                {/* Questions List */}
                <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {eventData.questions.length === 0 && (
                        <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                            <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.75rem" }}>📝</span>
                            <p style={{ fontSize: "0.875rem", color: "var(--color-text-dim)" }}>No questions yet. Add your first question below.</p>
                        </div>
                    )}

                    {eventData.questions.map((q, i) => (
                        <div key={i} style={{
                            borderRadius: "0.875rem", padding: "1.25rem", transition: "all 0.2s ease",
                            background: q.released ? `${activeEvent.accent}08` : "rgba(15, 23, 42, 0.3)",
                            border: `1px solid ${q.released ? `${activeEvent.accent}20` : "var(--color-border-subtle)"}`,
                        }}>
                            {/* Question Header */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.875rem", gap: "0.75rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <span style={{ fontSize: "0.6875rem", fontFamily: "monospace", color: "var(--color-text-dim)", width: "1.5rem", textAlign: "right" }}>#{i + 1}</span>
                                    <Toggle checked={q.released} onChange={() => toggleQuestionRelease(activeTab, i)} label={`Toggle Q${i + 1}`} />
                                    <span style={{ fontSize: "0.6875rem", fontWeight: 500, color: q.released ? activeEvent.accent : "var(--color-text-dim)" }}>
                                        {q.released ? "Visible" : "Hidden"}
                                    </span>
                                </div>
                                <button onClick={() => deleteQuestion(activeTab, i)} title="Delete question"
                                    style={{ padding: "0.375rem", borderRadius: "0.5rem", border: "none", background: "none", color: "var(--color-text-dim)", cursor: "pointer", transition: "all 0.2s ease" }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-error)"; e.currentTarget.style.background = "rgba(248,113,113,0.08)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-text-dim)"; e.currentTarget.style.background = "none"; }}>
                                    <svg style={{ width: "1rem", height: "1rem" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>

                            {/* Question Content */}
                            {isWebDesign ? (
                                <>
                                    {/* Image Upload */}
                                    <div style={{ marginBottom: "0.75rem" }}>
                                        {q.imageUrl ? (
                                            <div style={{ borderRadius: "0.75rem", overflow: "hidden", border: "1px solid var(--color-border-default)", background: "rgba(15, 23, 42, 0.5)" }}>
                                                <img src={q.imageUrl} alt={`Reference ${i + 1}`}
                                                    style={{ width: "100%", maxHeight: "16rem", objectFit: "contain", background: "rgba(0,0,0,0.2)" }} />
                                                <div style={{ padding: "0.625rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--color-border-subtle)" }}>
                                                    <span style={{ fontSize: "0.6875rem", color: "var(--color-success)", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                                        <svg style={{ width: "0.875rem", height: "0.875rem" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Reference attached
                                                    </span>
                                                    <button type="button" onClick={() => removeImage(i)}
                                                        style={{ fontSize: "0.6875rem", color: "var(--color-error)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                                                        Replace
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <label style={{
                                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                                gap: "0.75rem", padding: "2rem 1.5rem", borderRadius: "0.75rem", cursor: "pointer",
                                                transition: "all 0.2s ease", background: "rgba(15, 23, 42, 0.3)",
                                                border: "1px dashed var(--color-border-default)",
                                            }}>
                                                <input type="file" accept="image/*" style={{ display: "none" }}
                                                    onChange={(e) => handleImageUpload(i, e.target.files[0])}
                                                    disabled={uploading[`ws_${i}`]} />
                                                {uploading[`ws_${i}`] ? (
                                                    <>
                                                        <span className="spinner" />
                                                        <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Processing...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg style={{ width: "2rem", height: "2rem", color: activeEvent.accent, opacity: 0.5 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", fontWeight: 500 }}>Click to upload reference image</span>
                                                        <span style={{ fontSize: "0.6875rem", color: "var(--color-text-dim)" }}>PNG, JPG, WebP · Max 800 KB</span>
                                                    </>
                                                )}
                                            </label>
                                        )}
                                    </div>
                                    {/* Optional Description */}
                                    <textarea value={q.text} onChange={(e) => handleQuestionChange(activeTab, i, e.target.value)}
                                        rows={2} placeholder={`Optional description for requirement ${i + 1}...`}
                                        className="input-field" style={{ fontSize: "0.8125rem" }} />
                                </>
                            ) : (
                                <textarea value={q.text} onChange={(e) => handleQuestionChange(activeTab, i, e.target.value)}
                                    rows={3} placeholder={`Enter question ${i + 1} content...`}
                                    className="input-field" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace" }} />
                            )}
                        </div>
                    ))}

                    {/* Actions Bar */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingTop: "0.75rem", flexWrap: "wrap" }}>
                        <button onClick={() => addQuestion(activeTab)} className="btn-secondary" style={{ borderStyle: "dashed" }}>
                            + Add Question
                        </button>

                        <button onClick={() => saveQuestions(activeTab)} disabled={saving[activeTab]}
                            className="btn-primary" style={{ width: "auto", padding: "0.625rem 1.5rem" }}>
                            {saving[activeTab] ? (<><span className="spinner" /> Saving...</>) : "💾 Save Changes"}
                        </button>

                        {saveMsg[activeTab] && (
                            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: saveMsg[activeTab] === "saved" ? "var(--color-success)" : "var(--color-error)" }}>
                                {saveMsg[activeTab] === "saved" ? "✓ Saved successfully" : "✗ Save failed"}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Quick Overview Cards ── */}
            <div className="animate-fade-in-up animate-delay-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem", marginTop: "1.5rem" }}>
                {EVENTS.map((ev) => {
                    const evData = data[ev.key];
                    const total = evData.questions.length;
                    const visible = evData.questions.filter((q) => q.released).length;
                    return (
                        <div key={ev.key} className="section-card" style={{ padding: "1.25rem", cursor: "pointer", transition: "all 0.3s ease" }}
                            onClick={() => setActiveTab(ev.key)}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${ev.accent}30`; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = ""; }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                                <span style={{ fontSize: "1.25rem" }}>{ev.emoji}</span>
                                <span style={{
                                    fontSize: "0.5625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
                                    padding: "0.2rem 0.5rem", borderRadius: "9999px",
                                    background: evData.released ? "rgba(52, 211, 153, 0.08)" : "rgba(248, 113, 133, 0.06)",
                                    color: evData.released ? "#34d399" : "#fca5a5",
                                    border: evData.released ? "1px solid rgba(52, 211, 153, 0.15)" : "1px solid rgba(248, 113, 133, 0.1)",
                                }}>{evData.released ? "LIVE" : "HIDDEN"}</span>
                            </div>
                            <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "0.25rem" }}>{ev.label}</p>
                            <p style={{ fontSize: "0.6875rem", color: "var(--color-text-dim)" }}>
                                {total} total · {visible} visible
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
