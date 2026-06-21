import { Database, Radar, ShieldAlert, FileClock, BadgeCheck } from "lucide-react";
import { RecommendationRow } from "../../types/datasets";

interface Props {
  recommendation: RecommendationRow;
}

interface SourceCard {
  name: string;
  tag: string;
  icon: typeof Radar;
  description: string;
  trust: "Very High Trust" | "High Trust" | "Moderate Trust";
}

function trustColor(trust: SourceCard["trust"]): string {
  if (trust === "Very High Trust") return "var(--tl-success)";
  if (trust === "High Trust") return "var(--tl-dell-blue-light)";
  return "var(--tl-warning)";
}

/**
 * Data Source Attribution — shows the underlying systems the AI used,
 * each with a category tag and a trust level. Trust scales with the
 * recommendation's confidence so the display stays consistent with the data.
 */
export default function DataSourceAttributionPanel({ recommendation }: Props) {
  const conf = recommendation.confidence_score;
  const highTrust: SourceCard["trust"] = conf >= 85 ? "Very High Trust" : "High Trust";

  const sources: SourceCard[] = [
    {
      name: "Threat Intelligence Feeds",
      tag: "External Threat Intel",
      icon: Radar,
      description: `Reputation tracking for bad IPs, domains, and known hashes related to ${recommendation.device_name}.`,
      trust: highTrust,
    },
    {
      name: "Malware Detection Engine",
      tag: "Antivirus Scanner",
      icon: ShieldAlert,
      description: "Active file scanner matching signatures against global virus databases.",
      trust: highTrust,
    },
    {
      name: "Historical Incident Records",
      tag: "Incident Registry",
      icon: FileClock,
      description: "Archive of past organizational threats and remediation histories.",
      trust: conf >= 75 ? "High Trust" : "Moderate Trust",
    },
  ];

  return (
    <section className="tl-panel" aria-labelledby="data-source-title">
      <h3 id="data-source-title" className="tl-panel-title flex items-center gap-2">
        <Database className="h-5 w-5 text-[var(--tl-dell-blue-light)]" />
        Data Source Attribution
      </h3>
      <p className="mb-4 text-sm text-[var(--tl-text-secondary)]">
        Underlying data feeds the AI agent used to compute this recommendation's risk and confidence.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sources.map((s) => {
          const Icon = s.icon;
          const color = trustColor(s.trust);
          return (
            <div
              key={s.name}
              className="flex flex-col rounded-xl border border-[var(--tl-border)] bg-[var(--tl-bg-elevated)] p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <Icon className="h-5 w-5 text-[var(--tl-dell-blue-light)]" aria-hidden="true" />
                <span className="rounded-full bg-[var(--tl-bg-card)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[var(--tl-text-muted)]">
                  {s.tag}
                </span>
              </div>
              <p className="mt-2 text-sm font-bold text-white">{s.name}</p>
              <p className="mt-1 flex-1 text-xs leading-relaxed text-[var(--tl-text-secondary)]">
                {s.description}
              </p>
              <p
                className="mt-3 flex items-center gap-1.5 text-xs font-bold"
                style={{ color }}
              >
                <BadgeCheck className="h-4 w-4" />
                {s.trust}
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-4 rounded-lg bg-[var(--tl-bg-elevated)] px-4 py-3 text-xs text-[var(--tl-text-muted)]">
        <strong className="text-white">Attribution:</strong>{" "}
        {recommendation.data_source_attribution}
      </p>
    </section>
  );
}
