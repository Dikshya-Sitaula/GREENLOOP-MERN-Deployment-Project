import { getCategory } from './categoryService.js';

// Rule-based Circularity Score (0–100). Every input is a published assumption,
// so the score is explainable to users in the breakdown and "How we calculate".
const CONDITION_POINTS = { New: 30, 'Like new': 26, Good: 20, Fair: 12, 'Needs repair': 6 };
const TYPE_BONUS = { donate: 15, swap: 15, repair: 15, sell: 10 };

export const SCORE_MAX = { condition: 30, longevity: 25, repairability: 15, demand: 15, type: 15 };

export function bandFor(score) {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Moderate';
  return 'Low';
}

export function calculateCircularity({ condition, category, type }) {
  const cat = getCategory(category) || { longevity: 10, repairability: 7, demand: 7 };
  const breakdown = {
    condition: CONDITION_POINTS[condition] ?? 10,
    longevity: cat.longevity,
    repairability: cat.repairability,
    demand: cat.demand,
    type: TYPE_BONUS[type] ?? 10,
  };
  const score = Math.min(100, Object.values(breakdown).reduce((sum, n) => sum + n, 0));
  return { score, band: bandFor(score), breakdown, max: SCORE_MAX };
}

// Applies score fields to an item-shaped object (mutates and returns it).
export function withCircularity(item) {
  const { score, band, breakdown } = calculateCircularity(item);
  item.circularityScore = score;
  item.scoreBand = band;
  item.scoreBreakdown = breakdown;
  return item;
}
