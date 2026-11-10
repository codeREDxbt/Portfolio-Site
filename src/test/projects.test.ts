import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { projects, projectsChronological } from '@/data/portfolio';

describe('project data', () => {
  it('uses unique project ids (they are route slugs)', () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every project a sortable timeline date and a display label', () => {
    for (const p of projects) {
      expect(p.timeline.date, `${p.id}.timeline.date`).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
      expect(p.timeline.label.length, `${p.id}.timeline.label`).toBeGreaterThan(0);
      // the coarse year shown across the site must agree with the timeline
      expect(
        p.timeline.date.startsWith(p.year),
        `${p.id}: year ${p.year} vs ${p.timeline.date}`
      ).toBe(true);
    }
  });

  it('sorts the trail chronologically with unique dates', () => {
    const dates = projectsChronological.map((p) => p.timeline.date);
    expect(dates).toEqual([...dates].sort());
    expect(new Set(dates).size, 'timeline dates must be unique for a stable trail').toBe(
      dates.length
    );
  });

  it('keeps the trail honest: known anchors in the right order', () => {
    const order = projectsChronological.map((p) => p.id);
    expect(order[0]).toBe('aptos-lms'); // Q4 2025 — the first build
    expect(order.indexOf('medichainai')).toBeLessThan(order.indexOf('veilpay'));
    expect(order.indexOf('veilpay')).toBeLessThan(order.indexOf('avisky'));
    expect(order.indexOf('avisky')).toBeLessThan(order.indexOf('freelancepay'));
    // only Veilpay is still transmitting
    expect(projects.filter((p) => p.timeline.ongoing).map((p) => p.id)).toEqual(['veilpay']);
  });

  it('gives every featured project a complete case study', () => {
    const featured = projects.filter((p) => p.featured);
    expect(featured.length).toBeGreaterThan(0);

    for (const p of featured) {
      const study = p.caseStudy;
      expect(study, `${p.id} is featured but has no caseStudy`).toBeDefined();
      if (!study) continue;

      expect(study.lede.length, `${p.id}.lede`).toBeGreaterThan(40);
      for (const key of ['challenge', 'decision', 'outcome'] as const) {
        expect(study[key].length, `${p.id}.${key}`).toBeGreaterThan(0);
        for (const paragraph of study[key]) {
          expect(paragraph.length, `${p.id}.${key} paragraph`).toBeGreaterThan(40);
        }
      }
    }
  });

  it('resolves every referenced project image in public/', () => {
    for (const p of projects) {
      if (!p.image) continue;
      expect(existsSync(join(process.cwd(), 'public', p.image)), p.image).toBe(true);
    }
  });
});
