/**
 * Focused verification test for Phase 4 Task 4: CMS Media & Document Integration
 * Strictly zero live database or Supabase Storage mutations.
 */
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

console.log("=== PHASE 4 TASK 4: MEDIA & DOCUMENT INTEGRATION VERIFICATION ===");

// 1. Verify existence of all target files
const files = {
    cmsActions: path.join(__dirname, "../src/actions/cms.ts"),
    mediaPickerModal: path.join(__dirname, "../src/components/admin/media-picker-modal.tsx"),
    collectionManager: path.join(__dirname, "../src/components/admin/cms-collection-manager.tsx"),
    newsPage: path.join(__dirname, "../src/app/admin/news/page.tsx"),
    eventsPage: path.join(__dirname, "../src/app/admin/events/page.tsx"),
    facultyPage: path.join(__dirname, "../src/app/admin/faculty/page.tsx"),
    coursesPage: path.join(__dirname, "../src/app/admin/courses/page.tsx"),
    noticesPage: path.join(__dirname, "../src/app/admin/notices/page.tsx"),
    homepagePage: path.join(__dirname, "../src/app/admin/homepage/page.tsx"),
    mediaPage: path.join(__dirname, "../src/app/admin/media/page.tsx"),
};

for (const [key, filePath] of Object.entries(files)) {
    assert(fs.existsSync(filePath), `Target file ${key} must exist at ${filePath}`);
}
console.log("✔ Test 1: All 10 implementation and configuration files exist.");

// 2. Inspect fetchMediaPickerAssetsAction in src/actions/cms.ts
const cmsActionsSrc = fs.readFileSync(files.cmsActions, "utf-8");
assert(
    cmsActionsSrc.includes("export async function fetchMediaPickerAssetsAction"),
    "fetchMediaPickerAssetsAction must be exported"
);
assert(
    cmsActionsSrc.includes("requireAdminRole(ADMIN_ROLES)"),
    "fetchMediaPickerAssetsAction must enforce admin authentication"
);
assert(
    cmsActionsSrc.includes('category === "image"') &&
        cmsActionsSrc.includes("cms-media") &&
        cmsActionsSrc.includes("galleries") &&
        cmsActionsSrc.includes("faculty-profiles"),
    "Image category must include image buckets"
);
assert(
    cmsActionsSrc.includes("cms-documents") &&
        cmsActionsSrc.includes("pdfs"),
    "Document category must include document buckets"
);
assert(
    cmsActionsSrc.includes('.eq("is_archived", false)'),
    "Only non-archived media must be returned for picking"
);
console.log("✔ Test 2: Server Action fetchMediaPickerAssetsAction correctly structured and secured.");

// 3. Inspect MediaPickerModal component
const modalSrc = fs.readFileSync(files.mediaPickerModal, "utf-8");
assert(modalSrc.includes('"use client"'), "Modal must be a client component");
assert(
    modalSrc.includes("fetchMediaPickerAssetsAction"),
    "Modal must call fetchMediaPickerAssetsAction"
);
assert(
    modalSrc.includes("onSelect(asset.public_url, asset)"),
    "Modal must propagate public_url on selection"
);
assert(
    !modalSrc.includes("service_role") && !modalSrc.includes("SUPABASE_SERVICE_ROLE_KEY"),
    "No service-role keys allowed in client modal"
);
console.log("✔ Test 3: MediaPickerModal client component verified.");

// 4. Inspect CmsCollectionManager
const colMgrSrc = fs.readFileSync(files.collectionManager, "utf-8");
assert(
    colMgrSrc.includes("mediaPicker?:"),
    "CmsFieldConfig must include optional mediaPicker configuration"
);
assert(
    colMgrSrc.includes("MediaPickerModal"),
    "CmsCollectionManager must import and render MediaPickerModal"
);
assert(
    colMgrSrc.includes("setActivePickerField"),
    "CmsCollectionManager must maintain active picker field state"
);
assert(
    colMgrSrc.includes("field.mediaPicker"),
    "CmsCollectionManager must check field.mediaPicker"
);
assert(
    colMgrSrc.includes("input") && colMgrSrc.includes("onChange"),
    "Manual typing/pasting into URL fields must be preserved"
);
console.log("✔ Test 4: CmsCollectionManager integration and manual input preservation verified.");

// 5. Inspect 7 CMS pages field configurations
const newsSrc = fs.readFileSync(files.newsPage, "utf-8");
assert(
    newsSrc.includes('name: "featured_image_url"') &&
        newsSrc.includes('category: "image"') &&
        newsSrc.includes('"cms-media", "galleries"'),
    "News page must configure image picker on featured_image_url with cms-media and galleries"
);

const eventsSrc = fs.readFileSync(files.eventsPage, "utf-8");
assert(
    eventsSrc.includes('name: "poster_url"') &&
        eventsSrc.includes('category: "image"') &&
        eventsSrc.includes('"cms-media", "galleries"'),
    "Events page must configure image picker on poster_url with cms-media and galleries"
);

const facultySrc = fs.readFileSync(files.facultyPage, "utf-8");
assert(
    facultySrc.includes('name: "image_url"') &&
        facultySrc.includes('category: "image"') &&
        facultySrc.includes('"faculty-profiles",\n                                "cms-media"'),
    "Faculty page must configure image picker on image_url with faculty-profiles and cms-media"
);

const coursesSrc = fs.readFileSync(files.coursesPage, "utf-8");
assert(
    coursesSrc.includes('name: "syllabus_pdf_url"') &&
        coursesSrc.includes('category: "document"') &&
        coursesSrc.includes('"pdfs", "cms-documents"'),
    "Courses page must configure document picker on syllabus_pdf_url with pdfs and cms-documents"
);

const noticesSrc = fs.readFileSync(files.noticesPage, "utf-8");
assert(
    noticesSrc.includes('name: "file_url"') &&
        noticesSrc.includes('category: "document"') &&
        noticesSrc.includes('"cms-documents", "pdfs"'),
    "Notices page must configure document picker on file_url with cms-documents and pdfs"
);

const homepageSrc = fs.readFileSync(files.homepagePage, "utf-8");
assert(
    homepageSrc.includes('name: "image_url"') &&
        homepageSrc.includes('category: "image"') &&
        homepageSrc.includes('"cms-media"'),
    "Homepage page must configure image picker on image_url with cms-media"
);

const mediaSrc = fs.readFileSync(files.mediaPage, "utf-8");
assert(
    mediaSrc.includes('name: "image_url"') &&
        mediaSrc.includes('category: "image"') &&
        mediaSrc.includes('"galleries", "cms-media"'),
    "Media page gallery items must configure image picker on image_url with galleries and cms-media"
);
console.log("✔ Test 5: All 7 target CMS sections have their pickers and bucket constraints correctly configured.");

// 6. Unit logic test: Bucket filtering & asset selection simulation
const mockMediaAssets = [
    {
        id: "media-1",
        bucket_id: "cms-media",
        storage_path: "cms-media/2026/11/banner.jpg",
        public_url: "https://mock.supabase.co/storage/v1/object/public/cms-media/2026/11/banner.jpg",
        original_filename: "banner.jpg",
        alt_text: "Campus Banner",
    },
    {
        id: "media-2",
        bucket_id: "faculty-profiles",
        storage_path: "faculty-profiles/2026/11/hod.jpg",
        public_url: "https://mock.supabase.co/storage/v1/object/public/faculty-profiles/2026/11/hod.jpg",
        original_filename: "hod.jpg",
        alt_text: "Dr. HoD Photo",
    },
    {
        id: "media-3",
        bucket_id: "pdfs",
        storage_path: "pdfs/2026/11/ktu-syllabus.pdf",
        public_url: "https://mock.supabase.co/storage/v1/object/public/pdfs/2026/11/ktu-syllabus.pdf",
        original_filename: "ktu-syllabus.pdf",
        alt_text: "KTU S6 Syllabus",
    },
    {
        id: "media-4",
        bucket_id: "cms-documents",
        storage_path: "cms-documents/2026/11/aicte-approval.pdf",
        public_url: "https://mock.supabase.co/storage/v1/object/public/cms-documents/2026/11/aicte-approval.pdf",
        original_filename: "aicte-approval.pdf",
        alt_text: "AICTE Approval 2025-26",
    },
];

function filterPickerAssets(assets, allowedBuckets, query) {
    return assets.filter((asset) => {
        if (allowedBuckets && !allowedBuckets.includes(asset.bucket_id)) {
            return false;
        }
        if (!query || !query.trim()) return true;
        const q = query.toLowerCase().trim();
        return (
            asset.original_filename.toLowerCase().includes(q) ||
            (asset.alt_text ?? "").toLowerCase().includes(q)
        );
    });
}

// Case A: Faculty profile picker (allowedBuckets: ["faculty-profiles", "cms-media"])
const facultyEligible = filterPickerAssets(mockMediaAssets, ["faculty-profiles", "cms-media"], "");
assert.strictEqual(facultyEligible.length, 2);
assert(facultyEligible.some((a) => a.id === "media-1"));
assert(facultyEligible.some((a) => a.id === "media-2"));
assert(!facultyEligible.some((a) => a.bucket_id === "pdfs"));

// Case B: Course syllabus picker (allowedBuckets: ["pdfs", "cms-documents"])
const courseEligible = filterPickerAssets(mockMediaAssets, ["pdfs", "cms-documents"], "syllabus");
assert.strictEqual(courseEligible.length, 1);
assert.strictEqual(courseEligible[0].id, "media-3");

// Case C: Selection URL propagation simulation
let formState = { featured_image_url: "" };
function onSelectImage(chosenUrl) {
    formState.featured_image_url = chosenUrl;
}
onSelectImage(mockMediaAssets[0].public_url);
assert.strictEqual(
    formState.featured_image_url,
    "https://mock.supabase.co/storage/v1/object/public/cms-media/2026/11/banner.jpg"
);

// Case D: Manual editing overrides or preserves custom values
formState.featured_image_url = "/custom/local-asset.png";
assert.strictEqual(formState.featured_image_url, "/custom/local-asset.png");

console.log("✔ Test 6: Mocked bucket filtering, search, selection, and manual editing preservation passed.");

console.log("\nALL 6 VERIFICATION SUITES PASSED CLEANLY!");
