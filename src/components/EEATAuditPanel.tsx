import React from 'react';
import { EEATAudit, EEATDimensionScore } from '../types';
import { ShieldCheck, UserCheck, Award, Lock, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

interface EEATAuditPanelProps {
  audit: EEATAudit;
  onQuickImprove?: (dimension: string) => void;
  isImproving?: boolean;
}

export const EEATAuditPanel: React.FC<EEATAuditPanelProps> = ({
  audit,
  onQuickImprove,
  isImproving = false,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 75) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  const getBarColor = (score: number) => {
    if (score >= 90) return 'from-emerald-500 to-teal-600';
    if (score >= 75) return 'from-blue-500 to-indigo-600';
    return 'from-amber-500 to-orange-600';
  };

  const dimensions = [
    {
      key: 'experience',
      title: 'Experience (Pengalaman Nyata)',
      icon: UserCheck,
      description: 'Bukti penggunaan langsung, studi kasus lapangan, simulasi langkah, dan pemecahan kendala nyata.',
      data: audit.experience,
    },
    {
      key: 'expertise',
      title: 'Expertise (Keahlian Mendalam)',
      icon: Award,
      description: 'Presisi konsep, terminologi terstruktur, framework berpikir logis, dan kedalaman materi.',
      data: audit.expertise,
    },
    {
      key: 'authoritativeness',
      title: 'Authoritativeness (Otoritas & Reputasi)',
      icon: ShieldCheck,
      description: 'Rujukan standar industri, data ilmiah/survei kredibel, dan posisi komparatif objektif.',
      data: audit.authoritativeness,
    },
    {
      key: 'trustworthiness',
      title: 'Trustworthiness (Kepercayaan & Transparansi)',
      icon: Lock,
      description: 'Transparansi batasan metode, disclaimer etis/keamanan, keterbukaan pro-kontra, bebas clickbait.',
      data: audit.trustworthiness,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overall Score Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Google Search Quality Rating Audit
              </span>
            </div>
            <h3 className="text-xl font-bold">Skor Kepatuhan E-E-A-T Keseluruhan</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Artikel ini telah dievaluasi berdasarkan pedoman resmi Google Quality Rater untuk memastikan nilai tambah asli bagi pembaca manusia.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 border border-white/10 px-5 py-3 rounded-2xl shrink-0">
            <div className="text-right">
              <span className="block text-[10px] uppercase font-bold text-slate-300">Total EEAT</span>
              <span className="text-xs font-bold text-emerald-300">Grade: Excellent</span>
            </div>
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-2xl font-black text-emerald-300">
              {audit.overallScore}
            </div>
          </div>
        </div>

        {/* Key Included Elements */}
        {audit.keyEEATElementsIncluded && audit.keyEEATElementsIncluded.length > 0 && (
          <div className="mt-5 pt-4 border-t border-white/10">
            <span className="text-[11px] font-bold text-slate-300 block mb-2">
              Unsur Utama E-E-A-T yang Terkandung di Artikel:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {audit.keyEEATElementsIncluded.map((elem, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs text-slate-200 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{elem}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4 Dimension Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dimensions.map((dim) => {
          const Icon = dim.icon;
          const score = dim.data?.score || 90;
          const status = dim.data?.status || 'Excellent';

          return (
            <div
              key={dim.key}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{dim.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{dim.description}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-md border ${getScoreColor(
                        score
                      )}`}
                    >
                      {score}/100
                    </span>
                  </div>
                </div>

                {/* Score bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 mb-3 overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${getBarColor(score)} h-full rounded-full`}
                    style={{ width: `${score}%` }}
                  />
                </div>

                {/* Highlights */}
                {dim.data?.highlights && dim.data.highlights.length > 0 && (
                  <div className="space-y-1.5 mb-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Kekuatan Unsur:
                    </span>
                    {dim.data.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Improve action */}
              {onQuickImprove && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Ingin memperdalam dimensi ini?
                  </span>
                  <button
                    type="button"
                    disabled={isImproving}
                    onClick={() => onQuickImprove(dim.key)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 disabled:opacity-50 transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Perkuat {dim.key}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
