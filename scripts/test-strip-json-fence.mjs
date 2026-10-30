#!/usr/bin/env node
import assert from "node:assert/strict";
import { stripJsonFence } from "./strip-json-fence.mjs";

const body = '{"a":1}';
assert.deepEqual(JSON.parse(stripJsonFence(body)), { a: 1 }, "unfenced");
assert.deepEqual(JSON.parse(stripJsonFence("```json\n" + body + "\n```")), { a: 1 }, "fenced");
assert.deepEqual(JSON.parse(stripJsonFence("```json\n" + body + "\n```\n\nHope this helps!")), { a: 1 }, "fence with trailing text");
assert.throws(() => JSON.parse(stripJsonFence("```json\n{not json\n```")), "invalid fenced JSON still fails");
assert.throws(() => JSON.parse(stripJsonFence("not json")), "invalid unfenced JSON still fails");
console.log("strip-json-fence: all cases passed");
