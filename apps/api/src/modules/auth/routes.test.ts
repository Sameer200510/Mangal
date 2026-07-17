import { describe, expect, it } from "vitest"; import { hashToken } from "../../lib/auth.js";
describe("token hashing",()=>it("is deterministic and does not expose the token",()=>{expect(hashToken("secret")).not.toBe("secret");expect(hashToken("secret")).toBe(hashToken("secret"));}));
