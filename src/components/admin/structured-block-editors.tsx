"use client";

import React, { useState } from "react";
import { Plus, Trash2, List, Code, Images } from "lucide-react";
import { MediaPickerModal } from "./media-picker-modal";

export interface UniversalStructuredEditorProps {
    blockKey: string;
    value: Record<string, unknown> | undefined;
    disabled?: boolean;
    onChange: (val: Record<string, unknown>) => void;
}

export function UniversalStructuredEditor({
    blockKey,
    value = {},
    disabled = false,
    onChange,
}: UniversalStructuredEditorProps) {
    const [mode, setMode] = useState<"visual" | "json">("visual");
    const [jsonText, setJsonText] = useState(() => JSON.stringify(value, null, 2));
    const [jsonError, setJsonError] = useState<string | null>(null);

    const handleJsonChange = (text: string) => {
        setJsonText(text);
        try {
            const parsed = JSON.parse(text);
            if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
                setJsonError(null);
                onChange(parsed as Record<string, unknown>);
            } else {
                setJsonError("Structured data must be a JSON object {...}");
            }
        } catch (e: unknown) {
            setJsonError(e instanceof Error ? e.message : "Invalid JSON");
        }
    };

    const handleVisualUpdate = (newVal: Record<string, unknown>) => {
        onChange(newVal);
        setJsonText(JSON.stringify(newVal, null, 2));
        setJsonError(null);
    };

    const isChairman = /chairman/i.test(blockKey);
    const isRoster = /roster|committee|council|members/i.test(blockKey) || Array.isArray(value.members);
    const isRoutes = /transport|route|bus/i.test(blockKey) || Array.isArray(value.routes);
    const isFees = /fee|scholarship|tuition/i.test(blockKey) || Array.isArray(value.admission_fees) || Array.isArray(value.schemes);
    const isMoU = /mou|partner|industry/i.test(blockKey) || Array.isArray(value.partners);

    return (
        <div className="bg-[#0E1017] rounded-xl border border-white/[0.08] p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                        Structured Data
                    </span>
                    <span className="text-[10px] text-zinc-500 bg-white/[0.05] px-2 py-0.5 rounded">
                        {isChairman ? "Chairman Profile" : isRoster ? "Committee Roster" : isRoutes ? "Transport Routes" : isFees ? "Fees Matrix" : isMoU ? "Industry MoUs" : "JSON Object"}
                    </span>
                </div>
                <div className="flex items-center bg-[#0B0D12] rounded-lg p-0.5 border border-white/[0.06]">
                    <button
                        type="button"
                        onClick={() => {
                            setJsonText(JSON.stringify(value, null, 2));
                            setMode("visual");
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                            mode === "visual"
                                ? "bg-[#D4AF37] text-[#090A0D]"
                                : "text-zinc-400 hover:text-white"
                        }`}
                    >
                        <List className="w-3.5 h-3.5" /> Visual Rows
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setJsonText(JSON.stringify(value, null, 2));
                            setMode("json");
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                            mode === "json"
                                ? "bg-[#D4AF37] text-[#090A0D]"
                                : "text-zinc-400 hover:text-white"
                        }`}
                    >
                        <Code className="w-3.5 h-3.5" /> JSON View
                    </button>
                </div>
            </div>

            {mode === "visual" ? (
                <div>
                    {isChairman ? (
                        <ChairmanProfileEditor value={value} disabled={disabled} onChange={handleVisualUpdate} />
                    ) : isRoster ? (
                        <RosterEditor value={value} disabled={disabled} onChange={handleVisualUpdate} />
                    ) : isRoutes ? (
                        <RouteStopsEditor value={value} disabled={disabled} onChange={handleVisualUpdate} />
                    ) : isFees ? (
                        <FeeScheduleEditor value={value} disabled={disabled} onChange={handleVisualUpdate} />
                    ) : isMoU ? (
                        <MoUPartnerEditor value={value} disabled={disabled} onChange={handleVisualUpdate} />
                    ) : (
                        <GenericObjectEditor value={value} disabled={disabled} onChange={handleVisualUpdate} />
                    )}
                </div>
            ) : (
                <div className="space-y-2">
                    {jsonError && (
                        <div className="text-xs text-red-400 bg-red-950/40 border border-red-500/30 px-3 py-2 rounded-lg">
                            {jsonError}
                        </div>
                    )}
                    <textarea
                        rows={12}
                        value={jsonText}
                        readOnly={disabled}
                        onChange={(e) => handleJsonChange(e.target.value)}
                        className="w-full bg-[#0B0D12] border border-white/[0.1] rounded-xl p-3 font-mono text-xs text-zinc-200 focus:outline-none focus:border-[#D4AF37] read-only:opacity-60"
                        placeholder="{ ... }"
                    />
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------
// 1. Roster Editor (Committee members, council leaders)
// ----------------------------------------------------
interface RosterMember {
    sl?: number;
    name: string;
    role?: string;
    designation?: string;
    dept?: string;
    badge?: string;
    image?: string;
}

function RosterEditor({
    value,
    disabled,
    onChange,
}: {
    value: Record<string, unknown>;
    disabled?: boolean;
    onChange: (val: Record<string, unknown>) => void;
}) {
    const members: RosterMember[] = Array.isArray(value.members)
        ? (value.members as RosterMember[])
        : [];

    const updateMembers = (newMembers: RosterMember[]) => {
        onChange({ ...value, members: newMembers });
    };

    const addMember = () => {
        updateMembers([
            ...members,
            { sl: members.length + 1, name: "", role: "Member", designation: "", dept: "" },
        ]);
    };

    const removeMember = (idx: number) => {
        updateMembers(members.filter((_, i) => i !== idx));
    };

    const changeMember = (idx: number, field: keyof RosterMember, val: string | number) => {
        const next = [...members];
        next[idx] = { ...next[idx], [field]: val };
        updateMembers(next);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-300">
                    Committee Members ({members.length})
                </span>
                {!disabled && (
                    <button
                        type="button"
                        onClick={addMember}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] rounded-lg text-xs font-bold transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5" /> Add Member
                    </button>
                )}
            </div>

            {members.length === 0 ? (
                <div className="text-center py-6 text-xs text-zinc-500 bg-[#0B0D12] rounded-xl border border-white/[0.04]">
                    No members configured yet. Click &quot;Add Member&quot; to add repeatable rows.
                </div>
            ) : (
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                    {members.map((m, idx) => (
                        <div
                            key={idx}
                            className="bg-[#0B0D12] p-3 rounded-xl border border-white/[0.06] flex flex-col sm:flex-row gap-2.5 items-start sm:items-center"
                        >
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <span className="text-[11px] font-mono text-zinc-500 w-5 text-center shrink-0">
                                    {idx + 1}
                                </span>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={m.name}
                                    readOnly={disabled}
                                    onChange={(e) => changeMember(idx, "name", e.target.value)}
                                    className="flex-1 sm:w-44 h-8 px-2.5 bg-[#12141C] border border-white/[0.08] rounded-lg text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Role (e.g. Chairman / Member)"
                                value={m.role || ""}
                                readOnly={disabled}
                                onChange={(e) => changeMember(idx, "role", e.target.value)}
                                className="w-full sm:w-36 h-8 px-2.5 bg-[#12141C] border border-white/[0.08] rounded-lg text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
                            />
                            <input
                                type="text"
                                placeholder="Designation / Dept"
                                value={m.designation || m.dept || ""}
                                readOnly={disabled}
                                onChange={(e) => changeMember(idx, "designation", e.target.value)}
                                className="w-full sm:flex-1 h-8 px-2.5 bg-[#12141C] border border-white/[0.08] rounded-lg text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
                            />
                            {!disabled && (
                                <button
                                    type="button"
                                    onClick={() => removeMember(idx)}
                                    className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors shrink-0"
                                    title="Remove member"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------
// 2. Route Stops Editor (Transportation bus routes)
// ----------------------------------------------------
interface BusRoute {
    id: number | string;
    name: string;
    color?: string;
    stops: string[];
}

function RouteStopsEditor({
    value,
    disabled,
    onChange,
}: {
    value: Record<string, unknown>;
    disabled?: boolean;
    onChange: (val: Record<string, unknown>) => void;
}) {
    const routes: BusRoute[] = Array.isArray(value.routes)
        ? (value.routes as BusRoute[])
        : [];

    const updateRoutes = (newRoutes: BusRoute[]) => {
        onChange({ ...value, routes: newRoutes });
    };

    const addRoute = () => {
        updateRoutes([
            ...routes,
            { id: routes.length + 1, name: `Route ${routes.length + 1}`, color: "emerald", stops: [] },
        ]);
    };

    const removeRoute = (idx: number) => {
        updateRoutes(routes.filter((_, i) => i !== idx));
    };

    const changeRoute = (idx: number, field: keyof BusRoute, val: unknown) => {
        const next = [...routes];
        next[idx] = { ...next[idx], [field]: val };
        updateRoutes(next);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-300">
                    Bus Routes ({routes.length})
                </span>
                {!disabled && (
                    <button
                        type="button"
                        onClick={addRoute}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] rounded-lg text-xs font-bold transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5" /> Add Route
                    </button>
                )}
            </div>

            {routes.length === 0 ? (
                <div className="text-center py-6 text-xs text-zinc-500 bg-[#0B0D12] rounded-xl border border-white/[0.04]">
                    No bus routes configured. Click &quot;Add Route&quot; to define routes and stops.
                </div>
            ) : (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {routes.map((r, idx) => (
                        <div key={idx} className="bg-[#0B0D12] p-3 rounded-xl border border-white/[0.06] space-y-2">
                            <div className="flex items-center justify-between gap-3">
                                <input
                                    type="text"
                                    placeholder="Route Name (e.g. Route 1: Kattakkada)"
                                    value={r.name}
                                    readOnly={disabled}
                                    onChange={(e) => changeRoute(idx, "name", e.target.value)}
                                    className="flex-1 h-8 px-2.5 bg-[#12141C] border border-white/[0.08] rounded-lg text-xs font-semibold text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
                                />
                                <select
                                    value={r.color || "emerald"}
                                    disabled={disabled}
                                    onChange={(e) => changeRoute(idx, "color", e.target.value)}
                                    className="h-8 px-2 bg-[#12141C] border border-white/[0.08] rounded-lg text-xs text-zinc-300 focus:outline-none"
                                >
                                    <option value="emerald">Emerald</option>
                                    <option value="blue">Blue</option>
                                    <option value="violet">Violet</option>
                                    <option value="amber">Amber</option>
                                </select>
                                {!disabled && (
                                    <button
                                        type="button"
                                        onClick={() => removeRoute(idx)}
                                        className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <div>
                                <label className="block text-[10px] text-zinc-400 mb-1">
                                    Stops (comma separated)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Kattakkada, Peyad, Thirumala, Kumarapuram..."
                                    value={Array.isArray(r.stops) ? r.stops.join(", ") : ""}
                                    readOnly={disabled}
                                    onChange={(e) =>
                                        changeRoute(
                                            idx,
                                            "stops",
                                            e.target.value
                                                .split(",")
                                                .map((s) => s.trim())
                                                .filter(Boolean)
                                        )
                                    }
                                    className="w-full h-8 px-2.5 bg-[#12141C] border border-white/[0.08] rounded-lg text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------
// 3. Fee Schedule Editor (Admission & tuition fees)
// ----------------------------------------------------
interface FeeItem {
    item?: string;
    branch?: string;
    category?: string;
    amount?: string;
    fee?: string;
    desc?: string;
}

function FeeScheduleEditor({
    value,
    disabled,
    onChange,
}: {
    value: Record<string, unknown>;
    disabled?: boolean;
    onChange: (val: Record<string, unknown>) => void;
}) {
    const admissionFees: FeeItem[] = Array.isArray(value.admission_fees)
        ? (value.admission_fees as FeeItem[])
        : [];

    const updateFees = (newFees: FeeItem[]) => {
        onChange({ ...value, admission_fees: newFees });
    };

    const addFee = () => {
        updateFees([...admissionFees, { item: "", amount: "", desc: "" }]);
    };

    const removeFee = (idx: number) => {
        updateFees(admissionFees.filter((_, i) => i !== idx));
    };

    const changeFee = (idx: number, field: keyof FeeItem, val: string) => {
        const next = [...admissionFees];
        next[idx] = { ...next[idx], [field]: val };
        updateFees(next);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-300">
                    Admission Fee Items ({admissionFees.length})
                </span>
                {!disabled && (
                    <button
                        type="button"
                        onClick={addFee}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] rounded-lg text-xs font-bold transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5" /> Add Fee Row
                    </button>
                )}
            </div>

            {admissionFees.length === 0 ? (
                <div className="text-center py-6 text-xs text-zinc-500 bg-[#0B0D12] rounded-xl border border-white/[0.04]">
                    No fee rows defined. Click &quot;Add Fee Row&quot; to configure items and amounts.
                </div>
            ) : (
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                    {admissionFees.map((f, idx) => (
                        <div
                            key={idx}
                            className="bg-[#0B0D12] p-2.5 rounded-xl border border-white/[0.06] flex flex-col sm:flex-row gap-2 items-start sm:items-center"
                        >
                            <input
                                type="text"
                                placeholder="Fee Item Name"
                                value={f.item || f.category || f.branch || ""}
                                readOnly={disabled}
                                onChange={(e) => changeFee(idx, "item", e.target.value)}
                                className="flex-1 h-8 px-2.5 bg-[#12141C] border border-white/[0.08] rounded-lg text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
                            />
                            <input
                                type="text"
                                placeholder="Amount (e.g. 2,000)"
                                value={f.amount || f.fee || ""}
                                readOnly={disabled}
                                onChange={(e) => changeFee(idx, "amount", e.target.value)}
                                className="w-full sm:w-28 h-8 px-2.5 bg-[#12141C] border border-white/[0.08] rounded-lg text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
                            />
                            <input
                                type="text"
                                placeholder="Description (e.g. One-time payment)"
                                value={f.desc || ""}
                                readOnly={disabled}
                                onChange={(e) => changeFee(idx, "desc", e.target.value)}
                                className="w-full sm:w-48 h-8 px-2.5 bg-[#12141C] border border-white/[0.08] rounded-lg text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
                            />
                            {!disabled && (
                                <button
                                    type="button"
                                    onClick={() => removeFee(idx)}
                                    className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors shrink-0"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------
// 4. MoU / Industrial Partner Editor
// ----------------------------------------------------
interface MouPartner {
    name: string;
    domain?: string;
    status?: string;
}

function MoUPartnerEditor({
    value,
    disabled,
    onChange,
}: {
    value: Record<string, unknown>;
    disabled?: boolean;
    onChange: (val: Record<string, unknown>) => void;
}) {
    const partners: MouPartner[] = Array.isArray(value.partners)
        ? (value.partners as MouPartner[])
        : [];

    const updatePartners = (newPartners: MouPartner[]) => {
        onChange({ ...value, partners: newPartners });
    };

    const addPartner = () => {
        updatePartners([...partners, { name: "", domain: "Internships & Placements", status: "Active" }]);
    };

    const removePartner = (idx: number) => {
        updatePartners(partners.filter((_, i) => i !== idx));
    };

    const changePartner = (idx: number, field: keyof MouPartner, val: string) => {
        const next = [...partners];
        next[idx] = { ...next[idx], [field]: val };
        updatePartners(next);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-300">
                    MoU Industrial Partners ({partners.length})
                </span>
                {!disabled && (
                    <button
                        type="button"
                        onClick={addPartner}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] rounded-lg text-xs font-bold transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5" /> Add Partner
                    </button>
                )}
            </div>

            {partners.length === 0 ? (
                <div className="text-center py-6 text-xs text-zinc-500 bg-[#0B0D12] rounded-xl border border-white/[0.04]">
                    No MoU partners configured yet. Click &quot;Add Partner&quot; to add records.
                </div>
            ) : (
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                    {partners.map((p, idx) => (
                        <div
                            key={idx}
                            className="bg-[#0B0D12] p-2.5 rounded-xl border border-white/[0.06] flex flex-col sm:flex-row gap-2 items-start sm:items-center"
                        >
                            <input
                                type="text"
                                placeholder="Company / Organization Name"
                                value={p.name}
                                readOnly={disabled}
                                onChange={(e) => changePartner(idx, "name", e.target.value)}
                                className="flex-1 h-8 px-2.5 bg-[#12141C] border border-white/[0.08] rounded-lg text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
                            />
                            <input
                                type="text"
                                placeholder="Domain / Scope"
                                value={p.domain || ""}
                                readOnly={disabled}
                                onChange={(e) => changePartner(idx, "domain", e.target.value)}
                                className="w-full sm:w-48 h-8 px-2.5 bg-[#12141C] border border-white/[0.08] rounded-lg text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
                            />
                            {!disabled && (
                                <button
                                    type="button"
                                    onClick={() => removePartner(idx)}
                                    className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors shrink-0"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------
// 5. Generic Object Editor
// ----------------------------------------------------
function GenericObjectEditor({
    value,
    disabled,
    onChange,
}: {
    value: Record<string, unknown>;
    disabled?: boolean;
    onChange: (val: Record<string, unknown>) => void;
}) {
    const keys = Object.keys(value);

    const changeKeyVal = (k: string, v: string) => {
        onChange({ ...value, [k]: v });
    };

    const removeKey = (k: string) => {
        const next = { ...value };
        delete next[k];
        onChange(next);
    };

    const addKey = () => {
        const keyName = prompt("Enter new field name (e.g. phone, subtitle, quota):");
        if (keyName && keyName.trim()) {
            onChange({ ...value, [keyName.trim()]: "" });
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-300">
                    Fields ({keys.length})
                </span>
                {!disabled && (
                    <button
                        type="button"
                        onClick={addKey}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] rounded-lg text-xs font-bold transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5" /> Add Field
                    </button>
                )}
            </div>

            {keys.length === 0 ? (
                <div className="text-center py-6 text-xs text-zinc-500 bg-[#0B0D12] rounded-xl border border-white/[0.04]">
                    Empty structured data. Click &quot;Add Field&quot; or switch to &quot;JSON View&quot; to configure.
                </div>
            ) : (
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                    {keys.map((k) => {
                        const val = value[k];
                        const isSimple = typeof val === "string" || typeof val === "number" || typeof val === "boolean";
                        return (
                            <div
                                key={k}
                                className="bg-[#0B0D12] p-2.5 rounded-xl border border-white/[0.06] flex flex-col sm:flex-row gap-2 items-start sm:items-center"
                            >
                                <span className="font-mono text-xs text-[#D4AF37] w-36 shrink-0 truncate" title={k}>
                                    {k}
                                </span>
                                {isSimple ? (
                                    <input
                                        type="text"
                                        value={String(val ?? "")}
                                        readOnly={disabled}
                                        onChange={(e) => changeKeyVal(k, e.target.value)}
                                        className="flex-1 h-8 px-2.5 bg-[#12141C] border border-white/[0.08] rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-[#D4AF37]"
                                    />
                                ) : (
                                    <span className="text-xs text-zinc-500 italic flex-1">
                                        Complex nested data ({typeof val}) — edit in JSON View
                                    </span>
                                )}
                                {!disabled && (
                                    <button
                                        type="button"
                                        onClick={() => removeKey(k)}
                                        className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors shrink-0"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export function ChairmanProfileEditor({
    value = {},
    disabled = false,
    onChange,
}: {
    value: Record<string, unknown>;
    disabled?: boolean;
    onChange: (val: Record<string, unknown>) => void;
}) {
    const name = (value.name as string) ?? "Rev. Dr. Princeton Ben Bishop";
    const designation_line1 =
        (value.designation_line1 as string) ??
        (value.designationLine1 as string) ??
        "Bishop, South Kerala Diocese";
    const designation_line2 =
        (value.designation_line2 as string) ??
        (value.designationLine2 as string) ??
        "Chairman & Manager";
    const quote =
        (value.quote as string) ??
        (value.quotation as string) ??
        "";
    const message =
        (value.message as string) ??
        "The institution is under the administrative control of the Society for Technical Training (STT) of South Kerala Diocese (SKD) of Church of South India (CSI). The management of the institution is vested with the Governing Body and the Executive Committee headed by the Reverend Chairman & Manager.";
    const image_url =
        (value.image_url as string) ??
        (value.imagePath as string) ??
        "/images/new chair.jpeg";

    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

    const updateField = (key: string, val: string) => {
        onChange({
            ...value,
            [key]: val,
        });
    };

    return (
        <div className="space-y-4">
            <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wide">
                    Official Chairman Profile Editor
                </span>
                <p className="text-xs text-zinc-400 mt-1">
                    Manage the Chairman&apos;s name, designations, quotation, institutional description, and portrait.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Full Name &amp; Title
                    </label>
                    <input
                        type="text"
                        disabled={disabled}
                        value={name}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder="Rev. Dr. Princeton Ben Bishop"
                        className="w-full bg-[#0A0C10] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#D4AF37]/50"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Portrait Image URL / Path
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            disabled={disabled}
                            value={image_url}
                            onChange={(e) => updateField("image_url", e.target.value)}
                            placeholder="/images/new chair.jpeg"
                            className="flex-1 bg-[#0A0C10] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#D4AF37]/50"
                        />
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={() => setIsMediaPickerOpen(true)}
                            className="px-3 py-2 bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/[0.08] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                            title="Browse media library"
                        >
                            <Images className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Browse</span>
                        </button>
                    </div>
                </div>
            </div>

            {isMediaPickerOpen && (
                <MediaPickerModal
                    isOpen={isMediaPickerOpen}
                    onClose={() => setIsMediaPickerOpen(false)}
                    category="image"
                    title="Select Chairman Portrait"
                    currentValue={image_url}
                    onSelect={(url) => {
                        updateField("image_url", url);
                        setIsMediaPickerOpen(false);
                    }}
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Designation Line 1
                    </label>
                    <input
                        type="text"
                        disabled={disabled}
                        value={designation_line1}
                        onChange={(e) => updateField("designation_line1", e.target.value)}
                        placeholder="Bishop, South Kerala Diocese"
                        className="w-full bg-[#0A0C10] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#D4AF37]/50"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Designation Line 2
                    </label>
                    <input
                        type="text"
                        disabled={disabled}
                        value={designation_line2}
                        onChange={(e) => updateField("designation_line2", e.target.value)}
                        placeholder="Chairman &amp; Manager"
                        className="w-full bg-[#0A0C10] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#D4AF37]/50"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Official Quotation
                </label>
                <textarea
                    rows={2}
                    disabled={disabled}
                    value={quote}
                    onChange={(e) => updateField("quote", e.target.value)}
                    placeholder="Leave empty until a verified official quotation is provided..."
                    className="w-full bg-[#0A0C10] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#D4AF37]/50"
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Institutional Management Description
                </label>
                <textarea
                    rows={4}
                    disabled={disabled}
                    value={message}
                    onChange={(e) => updateField("message", e.target.value)}
                    placeholder="The institution is under the administrative control of the Society for Technical Training (STT)..."
                    className="w-full bg-[#0A0C10] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#D4AF37]/50"
                />
            </div>
        </div>
    );
}
