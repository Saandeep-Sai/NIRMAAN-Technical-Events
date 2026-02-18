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
    { key: "codingDebugger", label: "Coding Debugger", emoji: "🐛" },
    { key: "websiteDesign", label: "Website Design", emoji: "🎨" },
    { key: "blindCode", label: "Blind Code", emoji: "👨‍💻" },
];

function Toggle({ checked, onChange, label }) {
    return (
        <button
            type="button"
            onClick={onChange}
            aria-label={label}
            className="relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer shrink-0"
            style={{
                backgroundColor: checked ? "var(--color-accent-purple)" : "rgba(71, 85, 105, 0.4)",
                boxShadow: checked ? "0 0 14px rgba(139, 92, 246, 0.3)" : "none",
            }}
        >
            <span
                className="absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform duration-300"
                style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }}
            />
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

    const handleLogin = (e) => {
        e.preventDefault();
        if (passcode === ADMIN_PASSCODE) {
            setAuthenticated(true);
            setPasscodeError("");
        } else {
            setPasscodeError("Incorrect passcode. Please try again.");
        }
    };

    useEffect(() => {
        if (!authenticated) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, "event_questions", "master");
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    setData(snap.data());
                } else {
                    await setDoc(docRef, INITIAL_STRUCTURE);
                    setData({ ...INITIAL_STRUCTURE });
                }
            } catch (err) {
                console.error("Failed to load questions:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [authenticated]);

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
            // Website Design questions can have an image
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

    // ── Image to Base64 (Website Design only) ──
    const handleImageUpload = (index, file) => {
        if (!file) return;
        if (file.size > 800_000) {
            alert("Image is too large. Please use an image under 800 KB.");
            return;
        }
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
        reader.onerror = () => {
            alert("Failed to read the image file.");
            setUploading((prev) => ({ ...prev, [uploadKey]: false }));
        };
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

    // ── Passcode Screen ──
    if (!authenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="w-full max-w-sm animate-fade-in-up">
                    <div className="section-card section-card-glow p-8 text-center">
                        <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl"
                            style={{ background: "linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(99, 102, 241, 0.2))", border: "1px solid rgba(139, 92, 246, 0.2)" }}>
                            🔐
                        </div>
                        <h1 className="text-2xl font-bold font-[family-name:var(--font-family-heading)] text-[var(--color-text-primary)] mb-1">
                            Admin Access
                        </h1>
                        <p className="text-sm text-[var(--color-text-muted)] mb-8">Enter your passcode to manage events</p>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <input
                                type="password"
                                value={passcode}
                                onChange={(e) => setPasscode(e.target.value)}
                                placeholder="• • • • • • • •"
                                className="input-field text-center tracking-[0.3em] placeholder:tracking-[0.3em]"
                                autoFocus
                            />
                            {passcodeError && (
                                <div className="alert alert-error text-center py-2 text-sm">{passcodeError}</div>
                            )}
                            <button type="submit" className="btn-primary">Unlock Dashboard</button>
                        </form>

                        <Link to="/" className="block text-xs text-[var(--color-text-dim)] mt-6 hover:text-[var(--color-accent-blue)] transition-colors">
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <span className="spinner spinner-lg" />
                    <p className="text-sm text-[var(--color-text-muted)] mt-5">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    // ── Dashboard ──
    return (
        <div className="page-container" style={{ maxWidth: "64rem" }}>
            {/* Header */}
            <div className="mb-10 animate-fade-in-up">
                <Link to="/" className="back-link">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    Back to Portal
                </Link>

                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold font-[family-name:var(--font-family-heading)] tracking-tight mb-1">
                            <span className="gradient-text">Admin Dashboard</span>
                        </h1>
                        <p className="text-sm text-[var(--color-text-muted)]">Manage questions and control visibility for each event</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                        style={{ background: "rgba(52, 211, 153, 0.08)", border: "1px solid rgba(52, 211, 153, 0.2)", color: "var(--color-success)" }}>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Admin Mode
                    </div>
                </div>
            </div>

            {/* Event Sections */}
            <div className="space-y-8">
                {EVENTS.map((event, eventIdx) => {
                    const eventData = data[event.key];
                    const qCount = eventData.questions.length;
                    const visCount = eventData.questions.filter((q) => q.released).length;
                    const isWebDesign = event.key === "websiteDesign";

                    return (
                        <div key={event.key} className={`animate-fade-in-up animate-delay-${Math.min(eventIdx + 1, 3)} section-card overflow-hidden`}>
                            {/* Section Header */}
                            <div className="px-6 py-5 flex items-center justify-between flex-wrap gap-4"
                                style={{ borderBottom: "1px solid var(--color-border-default)", background: "rgba(15, 23, 42, 0.4)" }}>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{event.emoji}</span>
                                    <div>
                                        <h2 className="text-lg font-bold font-[family-name:var(--font-family-heading)] text-[var(--color-text-primary)]">
                                            {event.label}
                                        </h2>
                                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                                            {qCount} question{qCount !== 1 ? "s" : ""} · {visCount} visible to participants
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-medium ${eventData.released ? "text-[var(--color-success)]" : "text-[var(--color-text-dim)]"}`}>
                                        {eventData.released ? "Event Live" : "Event Hidden"}
                                    </span>
                                    <Toggle checked={eventData.released} onChange={() => toggleEventRelease(event.key)} label={`Toggle ${event.label}`} />
                                </div>
                            </div>

                            {/* Questions */}
                            <div className="p-6 space-y-4">
                                {eventData.questions.length === 0 && (
                                    <div className="text-center py-10">
                                        <p className="text-sm text-[var(--color-text-dim)]">No questions yet. Add your first question below.</p>
                                    </div>
                                )}

                                {eventData.questions.map((q, i) => (
                                    <div key={i} className="rounded-xl p-4 transition-all duration-200"
                                        style={{
                                            background: q.released ? "rgba(139, 92, 246, 0.04)" : "rgba(15, 23, 42, 0.3)",
                                            border: `1px solid ${q.released ? "rgba(139, 92, 246, 0.15)" : "var(--color-border-subtle)"}`,
                                        }}>
                                        {/* Question Header */}
                                        <div className="flex items-center justify-between mb-3 gap-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-mono text-[var(--color-text-dim)] w-5 text-right">#{i + 1}</span>
                                                <Toggle checked={q.released} onChange={() => toggleQuestionRelease(event.key, i)} label={`Toggle question ${i + 1}`} />
                                                <span className={`text-xs ${q.released ? "text-[var(--color-accent-purple)]" : "text-[var(--color-text-dim)]"}`}>
                                                    {q.released ? "Visible" : "Hidden"}
                                                </span>
                                            </div>
                                            <button onClick={() => deleteQuestion(event.key, i)}
                                                className="p-1.5 rounded-lg text-[var(--color-text-dim)] hover:text-[var(--color-error)] hover:bg-[rgba(248,113,113,0.08)] transition-all cursor-pointer"
                                                title="Delete question">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Question Text */}
                                        {isWebDesign ? (
                                            <>
                                                {/* ── Image (required, shown first) ── */}
                                                <div className="mb-3">
                                                    {q.imageUrl ? (
                                                        <div className="rounded-xl overflow-hidden"
                                                            style={{ border: "1px solid var(--color-border-default)", background: "rgba(15, 23, 42, 0.5)" }}>
                                                            <img
                                                                src={q.imageUrl}
                                                                alt={`Reference for question ${i + 1}`}
                                                                className="w-full max-h-64 object-contain"
                                                                style={{ background: "rgba(0,0,0,0.2)" }}
                                                            />
                                                            <div className="px-4 py-3 flex items-center justify-between"
                                                                style={{ borderTop: "1px solid var(--color-border-subtle)" }}>
                                                                <span className="text-xs text-[var(--color-success)] font-medium flex items-center gap-1.5">
                                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                    Reference image attached
                                                                </span>
                                                                <button type="button" onClick={() => removeImage(i)}
                                                                    className="text-xs text-[var(--color-error)] hover:underline cursor-pointer font-medium">
                                                                    Replace
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <label className="flex flex-col items-center justify-center gap-3 px-6 py-8 rounded-xl cursor-pointer transition-all duration-200 hover:border-[var(--color-accent-purple)]"
                                                            style={{
                                                                background: "rgba(15, 23, 42, 0.3)",
                                                                border: "1px dashed var(--color-border-default)",
                                                            }}>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={(e) => handleImageUpload(i, e.target.files[0])}
                                                                disabled={uploading[`ws_${i}`]}
                                                            />
                                                            {uploading[`ws_${i}`] ? (
                                                                <>
                                                                    <span className="spinner" />
                                                                    <span className="text-xs text-[var(--color-text-muted)]">Processing image...</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <svg className="w-8 h-8 text-[var(--color-accent-purple)]" style={{ opacity: 0.5 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                    <span className="text-sm text-[var(--color-text-secondary)] font-medium">
                                                                        Click to upload reference image
                                                                    </span>
                                                                    <span className="text-xs text-[var(--color-text-dim)]">PNG, JPG, WebP · Max 800 KB</span>
                                                                </>
                                                            )}
                                                        </label>
                                                    )}
                                                </div>
                                                {/* ── Description text (optional) ── */}
                                                <textarea value={q.text} onChange={(e) => handleQuestionChange(event.key, i, e.target.value)}
                                                    rows={2} placeholder={`Optional description or notes for requirement ${i + 1}...`}
                                                    className="input-field" style={{ fontSize: "0.8125rem" }} />
                                            </>
                                        ) : (
                                            <textarea value={q.text} onChange={(e) => handleQuestionChange(event.key, i, e.target.value)}
                                                rows={3} placeholder={`Enter question ${i + 1} content...`}
                                                className="input-field" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace" }} />
                                        )}
                                    </div>
                                ))}

                                {/* Actions */}
                                <div className="flex items-center gap-3 pt-3 flex-wrap">
                                    <button onClick={() => addQuestion(event.key)} className="btn-secondary" style={{ borderStyle: "dashed" }}>
                                        + Add Question
                                    </button>

                                    <button onClick={() => saveQuestions(event.key)} disabled={saving[event.key]}
                                        className="btn-primary" style={{ width: "auto", padding: "0.625rem 1.5rem" }}>
                                        {saving[event.key] ? (<><span className="spinner" /> Saving...</>) : "Save Changes"}
                                    </button>

                                    {saveMsg[event.key] && (
                                        <span className={`text-sm font-medium ${saveMsg[event.key] === "saved" ? "text-[var(--color-success)]" : "text-[var(--color-error)]"}`}>
                                            {saveMsg[event.key] === "saved" ? "✓ Saved successfully" : "✗ Save failed"}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
