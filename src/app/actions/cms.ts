"use server";

import {
    savePage as savePageCore,
    deletePage as deletePageCore,
    saveContentBlock as saveContentBlockCore,
    deleteContentBlock as deleteContentBlockCore,
    type CmsActionResult,
} from "@/actions/cms";

export async function savePage(formData: FormData): Promise<CmsActionResult> {
    return savePageCore(formData);
}

export async function deletePage(id: string): Promise<CmsActionResult> {
    return deletePageCore(id);
}

export async function saveContentBlock(
    formData: FormData
): Promise<CmsActionResult> {
    return saveContentBlockCore(formData);
}

export async function deleteContentBlock(id: string): Promise<CmsActionResult> {
    return deleteContentBlockCore(id);
}
