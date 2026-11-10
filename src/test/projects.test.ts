import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { projects } from "@/data/portfolio";

describe("project data", () => {
  it("uses unique project ids (they are route slugs)", () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every featured project a complete case study", () => {
    const featured = projects.filter((p) => p.featured);
    expect(featured.length).toBeGreaterThan(0);

    for (const p of featured) {
      const study = p.caseStudy;
      expect(study, `${p.id} is featured but has no caseStudy`).toBeDefined();
      if (!study) continue;

      expect(study.lede.length, `${p.id}.lede`).toBeGreaterThan(40);
      for (const key of ["challenge", "decision", "outcome"] as const) {
        expect(study[key].length, `${p.id}.${key}`).toBeGreaterThan(0);
        for (const paragraph of study[key]) {
          expect(paragraph.length, `${p.id}.${key} paragraph`).toBeGreaterThan(40);
        }
      }
    }
  });

  it("resolves every referenced project image in public/", () => {
    for (const p of projects) {
      if (!p.image) continue;
      expect(existsSync(join(process.cwd(), "public", p.image)), p.image).toBe(true);
    }
  });
});
