import { describe, expect, it } from "vitest"; import { compatibilityScore } from "./ranking.js";
describe("compatibility score",()=>it("rewards stated preference matches and verification",()=>{expect(compatibilityScore({preferenceMatches:8,preferenceTotal:10,verified:true,recentActivityDays:1})).toBeGreaterThan(70)}));
