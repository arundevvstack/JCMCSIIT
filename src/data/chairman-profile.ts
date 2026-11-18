export interface ChairmanProfileData {
    name: string;
    designationLine1: string;
    designationLine2: string;
    quote?: string;
    message: string;
    imagePath: string;
}

export const CHAIRMAN_PROFILE_CMS_BLOCK_KEY = "chairman_profile";

export const OFFICIAL_CHAIRMAN_PROFILE: ChairmanProfileData = {
    name: "Rev. Dr. Princeton Ben Bishop",
    designationLine1: "Bishop, South Kerala Diocese",
    designationLine2: "Chairman & Manager",
    quote: "", // Unverified previous quote removed; editable through Admin CMS
    message:
        "The institution is under the administrative control of the Society for Technical Training (STT) of South Kerala Diocese (SKD) of Church of South India (CSI). The management of the institution is vested with the Governing Body and the Executive Committee headed by the Reverend Chairman & Manager.",
    imagePath: "/images/new chair.jpeg",
};

/**
 * Resolves the public asset URL, ensuring spaces and special characters are URI-encoded
 * for Next.js Image component and HTML tags while keeping the original file intact.
 */
export function resolveChairmanImageSrc(imagePath: string): string {
    const trimmed = (imagePath || "").trim();
    if (!trimmed) {
        return "/images/new%20chair.jpeg";
    }
    try {
        return encodeURI(decodeURI(trimmed));
    } catch {
        return trimmed.replace(/ /g, "%20");
    }
}
