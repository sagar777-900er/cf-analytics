import { describe, it, expect, vi } from 'vitest';
import { calculateSWOT } from './analytics';

describe('calculateSWOT', () => {
  it('returns empty structures if no data provided', () => {
    const result = calculateSWOT({ userData: null, submissions: null });
    expect(result).toEqual({ strengths: [], weaknesses: [], opportunities: [], threats: [] });
  });

  it('correctly identifies strengths based on high rating and best problem', () => {
    const result = calculateSWOT({
      userData: { rating: 1700 },
      submissions: { bestRating: 1900, tagStats: [{ tag: 'dp', count: 50 }] },
      training: {},
      ratingHistory: []
    });
    expect(result.strengths).toContain('Strong competitor rating (1700).');
    expect(result.strengths).toContain('Capable of solving high difficulty problems up to 1900.');
    expect(result.strengths).toContain('High proficiency in dp (50 solved).');
  });

  it('correctly identifies volume weaknesses and rating drops', () => {
    const result = calculateSWOT({
      userData: { rating: 1200, maxRating: 1400 },
      submissions: { solvedCount: 50, tagStats: [{tag:'math', count:10}, {tag:'greedy', count:5}, {tag:'dfs', count:2}, {tag:'trees', count:1}] },
      training: {},
      ratingHistory: []
    });
    expect(result.weaknesses).toContain('Relatively low total problem volume; lacks extensive pattern recognition.');
    expect(result.weaknesses).toContain('Low volume of practice in trees (1 solved).');
    expect(result.weaknesses).toContain('Current rating is significantly below peak (1400).');
  });

  it('correctly identifies opportunities for ROI', () => {
    const result = calculateSWOT({
      userData: { rating: 1200 },
      submissions: { tagStats: [{tag:'math', count:10}, {tag:'greedy', count:5}] },
      training: { targetRating: 1400 },
      ratingHistory: []
    });
    expect(result.opportunities).toContain('High ROI potential by focusing on 1400-rated problems.');
    expect(result.opportunities).toContain('Expanding skill in greedy can diversify contest strategy.');
  });

  it('correctly identifies inactivity threats', () => {
    // Mock Date.now() to ensure the test is stable
    const mockNow = new Date('2025-01-01T00:00:00Z').getTime();
    vi.spyOn(global.Date, 'now').mockImplementation(() => mockNow);
    
    const twoMonthsAgo = (mockNow / 1000) - (60 * 24 * 60 * 60);

    const result = calculateSWOT({
      userData: { rating: 1500 },
      submissions: { tagStats: [] },
      training: {},
      ratingHistory: [{ timestamp: twoMonthsAgo }]
    });

    expect(result.threats).toContain('Extended inactivity (>1 month) may lead to skill decay.');
    
    vi.restoreAllMocks();
  });
});
