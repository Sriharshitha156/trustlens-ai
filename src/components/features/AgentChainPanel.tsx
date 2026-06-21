import { Radar, Brain, ShieldCheck, ArrowDown, CheckCircle2 } from "lucide-react";
import { RecommendationBundle } from "../../types/datasets";

interface Props {
  bundle: RecommendationBundle;
}

/**
 * Multi-Agent Transparency (stretch goal).
 * Reconstructs the chain of specialised agents behind a single recommendation
 * — Detection -> Analysis -> Remediation — and shows how context is handed off.
 * Data is derived from the existing recommendation bundle, so it always stays
 * in sync with whatever recommendation is being viewed.
 */
export default function AgentChainPanel({ bundle }: Props) {
  const rec = bundle.recommendation;

  const topEvidence = [...bundle.evidenceWeights].sort(
    (a, b) => b.weight_percentage - a.weight_percentage,
  )[0];

  const reliability = bundle.trustLedger?.historical_reliability_score;

  const agents = [
    {
      name: "Detection Agent",
      icon: Radar,
      color: "var(--tl-info)",
      role: "Watches telemetry & logs for anomalies",
      did: topEvidence
        ? `Flagged ${rec.device_name} — strongest signal was "${topEvidence.evidence_type}" (${topEvidence.weight_percentage}% of the evidence).`
        : `Flagged ${rec.device_name} based on incoming telemetry and security logs.`,
      handoff: "Passes the flagged device + evidence bundle to the Analysis Agent.",
    },
    {
      name: "Analysis Agent",
      icon: Brain,
      color: "var(--tl-dell-blue-light)",
      role: "Weighs evidence & assesses confidence",
      did: `Reviewed ${bundle.evidenceWeights.length || "the"} evidence signal(s) and rated this "${rec.confidence}"${
        reliability !== undefined ? `, with ${reliability}% historical reliability on similar cases.` : "."
      }`,
      handoff: "Hands the assessed risk + confidence to the Remediation Agent.",
    },
    {
      name: "Remediation Agent",
      icon: ShieldCheck,
      color: "var(--tl-success)",
      role: "Proposes a safe response action",
      did: `Proposed "${rec.action}" for ${rec.severity} severity — held for human approval, not executed.`,
      handoff: "Routes the proposal to you (human-in-the-loop) for the final decision.",
    },
  ];

  return (
    <section className="tl-panel" aria-labelledby="agent-chain-title">
      <h3 id="agent-chain-title" className="tl-panel-title flex items-center gap-2">
        <Radar className="h-5 w-5 text-[var(--tl-dell-blue-light)]" />
        Multi-Agent Handoff
      </h3>
      <p className="mb-5 text-sm text-[var(--tl-text-secondary)]">
        This recommendation was produced by a chain of specialised AI agents. Here is how each one
        contributed and what it passed to the next.
      </p>

      <ol className="space-y-1">
        {agents.map((agent, i) => {
          const Icon = agent.icon;
          const last = i === agents.length - 1;
          return (
            <li key={agent.name}>
              <div className="rounded-xl border border-[var(--tl-border)] bg-[var(--tl-bg-elevated)] p-4">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `color-mix(in srgb, ${agent.color} 18%, transparent)` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: agent.color }} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--tl-text-muted)]">
                        Step {i + 1}
                      </span>
                      <br />
                      {agent.name}
                    </p>
                    <p className="text-xs text-[var(--tl-text-muted)]">{agent.role}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--tl-text-secondary)]">
                  {agent.did}
                </p>
                <p className="mt-2 flex items-start gap-1.5 text-xs text-[var(--tl-text-muted)]">
                  <span className="font-bold text-[var(--tl-dell-blue-light)]">Handoff →</span>
                  {agent.handoff}
                </p>
              </div>
              {!last && (
                <div className="flex justify-center py-1" aria-hidden="true">
                  <ArrowDown className="h-4 w-4 text-[var(--tl-text-muted)]" />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <p className="mt-4 flex items-center gap-2 rounded-lg bg-[var(--tl-success)]/10 px-4 py-3 text-xs font-semibold text-[var(--tl-success)]">
        <CheckCircle2 className="h-4 w-4" />
        No agent in this chain can execute an action — the final decision is always yours.
      </p>
    </section>
  );
}
