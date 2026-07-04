# Add Batch Faculty Profiles

This plan outlines the process for extracting, structuring, and integrating 21 faculty profiles from the uploaded documents in `/public/Faculty/Final/`.

## Goal Description
Batch process 21 uploaded faculty profile documents (.pdf, .docx, .doc) to automatically generate structured data, premium faculty cards, and complete individual profile pages. The process will use existing images from `/public/Faculty/Final/` and follow the JCMC SIIT UI guidelines.

## User Review Required
> [!IMPORTANT]
> The `.doc` files (older Word formats) are difficult to parse natively in Node.js without external dependencies like `antiword` or MS Office. I will attempt to extract text, but if parsing fails, they might need to be re-saved as `.docx` or `.pdf`.

## Open Questions
- Is it acceptable to use a heuristic/regex-based Node.js script to extract information from the documents? Doing it manually through chat for 21 profiles would exceed context limits, and we don't have an OpenAI key configured in `.env` for LLM-based extraction. 
- The prompt requests "Create one faculty data file for each faculty". I will split `src/data/faculty.ts` into a directory `src/data/faculty/` with individual files for easier maintenance.

## Proposed Changes

### 1. Data Extraction & Parsing
#### [NEW] `scripts/parse_faculty.js`
A script utilizing `pdf-parse` and `mammoth` to extract text from the documents in `/public/Faculty/Final/`. It will use regex heuristics to structure the data (Education, Experience, Publications, etc.) into the expected `Faculty` JSON schema.

### 2. Faculty Data Model Update
#### [NEW] `src/data/faculty/*.ts`
Create individual data files for each faculty (e.g., `anjana-s-p.ts`, `arathiraj-b-s.ts`) populated with the extracted information.

#### [MODIFY] `src/data/faculty.ts`
Refactor to aggregate and export the list of all individual faculty data files.

### 3. Faculty Profile Page Refactor
#### [MODIFY] `src/app/academics/faculty/[slug]/page.tsx`
Update the dynamic page template to render the newly extracted sections (Career Objective, Subjects Handled, Books, Patents, Workshops, Seminars, Memberships, etc.) conditionally (only if data exists).
Add JSON-LD Structured Data, Breadcrumb Schema, and proper SEO metadata generation.

### 4. Faculty Listing Page Update
#### [MODIFY] `src/components/faculty/faculty-listing.tsx`
Ensure the faculty card matches the requested premium layout displaying: Photo, Name, Designation, Department, Highest Qualification, Experience, Primary Specialization, Email, and View Profile Button.
Ensure pagination and alphabet sorting if requested.

## Verification Plan
### Automated Tests
- Run `npm run lint` and `npm run build` to ensure type safety and build success.

### Manual Verification
- Check the Faculty Directory UI (`/academics/faculty`) for correct listing, filters, and no broken images.
- Navigate to individual faculty pages and verify all sections render correctly based on the document source of truth without empty/hidden sections breaking the layout.
