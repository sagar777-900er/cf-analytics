import { Shield, AlertTriangle, Lightbulb, Zap } from 'lucide-react';

function SWOTCard({ title, items, icon: Icon, color, delay }) {
  return (
    <div className={`glass-card p-5 flex flex-col gap-4 animate-fade-in animate-fade-in-delay-${delay}`}>
      <div className="flex items-center gap-3 border-b border-white/5 pb-3">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
          style={{ backgroundColor: `${color}15`, boxShadow: `0 0 15px ${color}40` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <h3 className="text-lg font-bold text-white tracking-wide">{title}</h3>
      </div>
      <ul className="space-y-3 flex-1">
        {items.length > 0 ? (
          items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300 leading-snug">
              <span className="text-[10px] mt-1" style={{ color }}>▶</span>
              {item}
            </li>
          ))
        ) : (
          <li className="text-sm text-slate-500 italic">No clear data for this metric.</li>
        )}
      </ul>
    </div>
  );
}

export default function SWOTAnalysis({ userData, submissions, training, ratingHistory }) {
  if (!userData || !submissions) return null;

  // -- Analyze Strengths --
  const strengths = [];
  if (userData.rating && userData.rating >= 1600) {
    strengths.push(`Strong competitor rating (${userData.rating}).`);
  }
  if (submissions.bestRating) {
    strengths.push(`Capable of solving high difficulty problems up to ${submissions.bestRating}.`);
  }
  if (submissions.tagStats?.length > 0) {
    strengths.push(`High proficiency in ${submissions.tagStats[0].tag} (${submissions.tagStats[0].count} solved).`);
  }

  // -- Analyze Weaknesses --
  const weaknesses = [];
  const allTags = submissions.tagStats || [];
  if (allTags.length > 3) {
    const weakest = allTags[allTags.length - 1];
    weaknesses.push(`Low volume of practice in ${weakest.tag} (${weakest.count} solved).`);
  }
  if (submissions.solvedCount < 100) {
    weaknesses.push("Relatively low total problem volume; lacks extensive pattern recognition.");
  }
  
  if (userData.rating && userData.maxRating && userData.rating < userData.maxRating - 100) {
    weaknesses.push(`Current rating is significantly below peak (${userData.maxRating}).`);
  }

  // -- Analyze Opportunities --
  const opportunities = [];
  if (training?.targetRating) {
    opportunities.push(`High ROI potential by focusing on ${training.targetRating}-rated problems.`);
  }
  if (allTags.length > 1) {
    opportunities.push(`Expanding skill in ${allTags[1].tag} can diversify contest strategy.`);
  }
  opportunities.push("Participating in more virtual contests to improve speed and accuracy.");

  // -- Analyze Threats --
  const threats = [];
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const timeSinceLastContest = ratingHistory?.length 
    ? (Date.now() / 1000) - ratingHistory[ratingHistory.length - 1].timestamp 
    : 0;

  if (timeSinceLastContest > 30 * 24 * 60 * 60) {
    threats.push("Extended inactivity (>1 month) may lead to skill decay.");
  }
  if (userData.rating && userData.rating < 1200) {
    threats.push("Susceptible to high rating volatility in lower-rated divisions.");
  }
  if (threats.length === 0) {
    threats.push("Complacency: Constant meta shifts require continuous learning.");
  }

  return (
    <div className="mt-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[rgba(176,38,255,0.1)] flex items-center justify-center glow-purple">
          <Zap className="w-5 h-5 text-[#818cf8]" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">SWOT Analysis</h2>
          <p className="text-sm text-slate-400">Competitive Programming Profiling Engine</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SWOTCard 
          title="Strengths" 
          items={strengths} 
          icon={Shield} 
          color="#22c55e" 
          delay={1} 
        />
        <SWOTCard 
          title="Weaknesses" 
          items={weaknesses} 
          icon={AlertTriangle} 
          color="#ef4444" 
          delay={2} 
        />
        <SWOTCard 
          title="Opportunities" 
          items={opportunities} 
          icon={Lightbulb} 
          color="#00f0ff" 
          delay={3} 
        />
        <SWOTCard 
          title="Threats" 
          items={threats} 
          icon={Zap} 
          color="#fbbf24" 
          delay={4} 
        />
      </div>
    </div>
  );
}
