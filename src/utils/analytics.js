export function calculateSWOT({ userData, submissions, training, ratingHistory }) {
  if (!userData || !submissions) {
    return { strengths: [], weaknesses: [], opportunities: [], threats: [] };
  }

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

  return { strengths, weaknesses, opportunities, threats };
}
