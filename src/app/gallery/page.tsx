import { Metadata } from "next";
import { getPublicGalleryItems, getPublicGalleryAlbums } from "@/lib/cms/gallery";
import GalleryClient from "./gallery-client";

export const metadata: Metadata = {
    title: "Campus Gallery | JCMCSIIT",
    description:
        "A glimpse into the vibrant academic life, cultural events, and celebrations at John Cox Memorial CSI Institute of Technology.",
};

export default async function GalleryPage() {
    const [items, albums] = await Promise.all([
        getPublicGalleryItems(),
        getPublicGalleryAlbums(),
    ]);

    return <GalleryClient items={items} albums={albums} />;
}
