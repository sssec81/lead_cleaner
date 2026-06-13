import { ArrowDown, CheckCircle2, CloudOff, LockKeyhole, Zap } from "lucide-react";

type TextTransformationPreviewCardProps = {
 messyLabel: string;
 messyLines: string[];
 actionLabel: string;
 detectedLabel: string;
 resultLabel: string;
 resultLines: string[];
 resultTone?: "green" | "cyan";
};

export function TextTransformationPreviewCard({
 messyLabel,
 messyLines,
 actionLabel,
 detectedLabel,
 resultLabel,
 resultLines,
 resultTone = "cyan",
}: TextTransformationPreviewCardProps) {
 const resultColor =
 resultTone === "green" ? "text-emerald-300" : "text-cyan-300";

 return (
 <div className="group rounded-[1.35rem] border border-[#E5E7EB] bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm sm:p-5">
 <div className="flex items-center justify-between gap-3">
 <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
 {messyLabel}
 </p>
 <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">
 Raw Paste
 </span>
 </div>

 <div className="mt-3 max-h-24 overflow-hidden rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-xs leading-6 text-slate-500">
 {messyLines.map((line) => (
 <div key={line} className="truncate">
 {line}
 </div>
 ))}
 </div>

 <div className="my-3.5 flex items-center justify-center gap-2.5">
 <div className="h-px flex-1 bg-slate-200" />
 <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">
 <ArrowDown className="h-3.5 w-3.5 text-emerald-600 transition-transform duration-200 group-hover:translate-y-0.5" />
 <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
 {actionLabel}
 </span>
 </div>
 <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-emerald-700">
 {detectedLabel}
 </span>
 <div className="h-px flex-1 bg-slate-200" />
 </div>

 <div className="overflow-hidden rounded-[1rem] border border-slate-800 bg-[#0B1020]">
 <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2">
 <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
 {resultLabel}
 </p>
 <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-emerald-300 transition-shadow duration-200 group-hover:shadow-sm">
 <CheckCircle2 className="h-3 w-3" />
 Export Ready
 </span>
 </div>
 <div className={`space-y-2 px-4 py-4 font-mono text-xs leading-6 ${resultColor}`}>
 {resultLines.map((line) => (
 <div key={line} className="break-all">
 {line}
 </div>
 ))}
 </div>
 </div>

 <div className="mt-3.5 grid gap-2 sm:grid-cols-3">
 {[
 { icon: LockKeyhole, label: "Browser only" },
 { icon: Zap, label: "Local processing" },
 { icon: CloudOff, label: "Never uploaded" },
 ].map(({ icon: Icon, label }) => (
 <div
 key={label}
 className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600"
 >
 <Icon className="h-3.5 w-3.5 text-blue-600" />
 {label}
 </div>
 ))}
 </div>
 </div>
 );
}
