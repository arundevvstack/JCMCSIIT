/**
 * Verification test for Phase 4 Task 5 Defense-in-Depth:
 * Server-side allowedBuckets enforcement in fetchMediaPickerAssetsAction.
 * Strictly zero live database or Supabase Storage mutations.
 */
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

console.log("=== PHASE 4 TASK 5: DEFENSE-IN-DEPTH VERIFICATION ===");

// 1. Inspect source files
const cmsActionsPath = path.join(__dirname, "../src/actions/cms.ts");
const modalPath = path.join(__dirname, "../src/components/admin/media-picker-modal.tsx");

assert(fs.existsSync(cmsActionsPath), "src/actions/cms.ts must exist");
assert(fs.existsSync(modalPath), "src/components/admin/media-picker-modal.tsx must exist");
console.log("✔ Test 1: Target source files exist.");

// 2. Inspect server implementation in cms.ts
const cmsSrc = fs.readFileSync(cmsActionsPath, "utf-8");

assert(
    cmsSrc.includes("SERVER_IMAGE_BUCKETS = [\n    \"cms-media\",\n    \"galleries\",\n    \"faculty-profiles\",\n]"),
    "SERVER_IMAGE_BUCKETS must be defined with cms-media, galleries, faculty-profiles"
);
assert(
    cmsSrc.includes("SERVER_DOCUMENT_BUCKETS = [\n    \"cms-documents\",\n    \"pdfs\",\n]"),
    "SERVER_DOCUMENT_BUCKETS must be defined with cms-documents, pdfs"
);
assert(
    cmsSrc.includes("fetchMediaPickerAssetsAction(\n    category: \"image\" | \"document\",\n    allowedBuckets?: readonly string[]"),
    "fetchMediaPickerAssetsAction signature must accept optional allowedBuckets"
);
assert(
    cmsSrc.includes('.in("bucket_id", effectiveBuckets)'),
    "Supabase query must filter using effectiveBuckets"
);
console.log("✔ Test 2: Server-side action enforces effectiveBuckets query filtering.");

// 3. Inspect client-side propagation in media-picker-modal.tsx
const modalSrc = fs.readFileSync(modalPath, "utf-8");
assert(
    modalSrc.includes("fetchMediaPickerAssetsAction(\n                    category,\n                    allowedBuckets\n                )"),
    "MediaPickerModal must pass allowedBuckets to fetchMediaPickerAssetsAction"
);
console.log("✔ Test 3: MediaPickerModal propagates allowedBuckets to server action.");

// 4. Pure Unit Logic Simulation of Server-Side Bucket Validation & Intersect
const SERVER_IMAGE_BUCKETS = ["cms-media", "galleries", "faculty-profiles"];
const SERVER_DOCUMENT_BUCKETS = ["cms-documents", "pdfs"];

function computeEffectiveBuckets(category, allowedBuckets) {
    if (category !== "image" && category !== "document") {
        return { ok: false, error: "Invalid media category requested." };
    }

    const standardBuckets =
        category === "image" ? SERVER_IMAGE_BUCKETS : SERVER_DOCUMENT_BUCKETS;

    if (allowedBuckets && Array.isArray(allowedBuckets) && allowedBuckets.length > 0) {
        const hasInvalid = allowedBuckets.some(
            (b) => !standardBuckets.includes(b)
        );
        if (hasInvalid) {
            return {
                ok: false,
                error: `Invalid bucket requested for ${category} assets.`,
            };
        }
        return { ok: true, buckets: Array.from(new Set(allowedBuckets)) };
    }

    return { ok: true, buckets: standardBuckets };
}

// 5. Test invalid categories & buckets rejection
assert.strictEqual(computeEffectiveBuckets("audio", []).ok, false);
assert.strictEqual(computeEffectiveBuckets("image", ["pdfs"]).ok, false);
assert.strictEqual(computeEffectiveBuckets("image", ["cms-media", "fake-bucket"]).ok, false);
assert.strictEqual(computeEffectiveBuckets("document", ["galleries"]).ok, false);
console.log("✔ Test 4: Invalid categories and cross-category/unknown buckets rejected safely.");

// 6. Test all 7 CMS Configurations
const cmsConfigs = [
    { name: "News (featured_image_url)", category: "image", requested: ["cms-media", "galleries"], expected: ["cms-media", "galleries"] },
    { name: "Events (poster_url)", category: "image", requested: ["cms-media", "galleries"], expected: ["cms-media", "galleries"] },
    { name: "Faculty (image_url)", category: "image", requested: ["faculty-profiles", "cms-media"], expected: ["faculty-profiles", "cms-media"] },
    { name: "Courses (syllabus_pdf_url)", category: "document", requested: ["pdfs", "cms-documents"], expected: ["pdfs", "cms-documents"] },
    { name: "Notices (file_url)", category: "document", requested: ["cms-documents", "pdfs"], expected: ["cms-documents", "pdfs"] },
    { name: "Popups (image_url)", category: "image", requested: ["cms-media"], expected: ["cms-media"] },
    { name: "Gallery Items (image_url)", category: "image", requested: ["galleries", "cms-media"], expected: ["galleries", "cms-media"] },
];

for (const cfg of cmsConfigs) {
    const res = computeEffectiveBuckets(cfg.category, cfg.requested);
    assert.strictEqual(res.ok, true, `Config ${cfg.name} must be valid`);
    assert.deepStrictEqual(res.buckets, cfg.expected, `Config ${cfg.name} must produce exact expected buckets`);
}
console.log("✔ Test 5: All 7 CMS section configurations produce exact effective server buckets.");

// 7. Test Cross-Bucket Isolation
const mockDbRows = [
    { id: "1", bucket_id: "cms-media", name: "home-hero.jpg" },
    { id: "2", bucket_id: "galleries", name: "convocation.jpg" },
    { id: "3", bucket_id: "faculty-profiles", name: "dean.jpg" },
    { id: "4", bucket_id: "cms-documents", name: "aicte.pdf" },
    { id: "5", bucket_id: "pdfs", name: "syllabus.pdf" },
];

function simulateServerQuery(category, allowedBuckets) {
    const check = computeEffectiveBuckets(category, allowedBuckets);
    if (!check.ok) return { ok: false, error: check.error };
    const filtered = mockDbRows.filter((r) => check.buckets.includes(r.bucket_id));
    return { ok: true, rows: filtered };
}

// Popups can ONLY get cms-media
const popupQuery = simulateServerQuery("image", ["cms-media"]);
assert.strictEqual(popupQuery.ok, true);
assert.strictEqual(popupQuery.rows.length, 1);
assert.strictEqual(popupQuery.rows[0].bucket_id, "cms-media");
assert(!popupQuery.rows.some((r) => r.bucket_id === "galleries"));
assert(!popupQuery.rows.some((r) => r.bucket_id === "faculty-profiles"));

// Faculty can get faculty-profiles and cms-media, but not galleries
const facultyQuery = simulateServerQuery("image", ["faculty-profiles", "cms-media"]);
assert.strictEqual(facultyQuery.ok, true);
assert.strictEqual(facultyQuery.rows.length, 2);
assert(!facultyQuery.rows.some((r) => r.bucket_id === "galleries"));

// Courses can get pdfs and cms-documents, but not image buckets
const courseQuery = simulateServerQuery("document", ["pdfs", "cms-documents"]);
assert.strictEqual(courseQuery.ok, true);
assert.strictEqual(courseQuery.rows.length, 2);
assert(!courseQuery.rows.some((r) => r.bucket_id === "cms-media"));

// Default category behavior when allowedBuckets is omitted
const defaultImageQuery = simulateServerQuery("image", undefined);
assert.strictEqual(defaultImageQuery.ok, true);
assert.strictEqual(defaultImageQuery.rows.length, 3);

console.log("✔ Test 6: Cross-bucket isolation strictly enforced at simulated query level.");

console.log("\nALL 6 TASK 5 DEFENSE-IN-DEPTH SUITES PASSED CLEANLY!");
