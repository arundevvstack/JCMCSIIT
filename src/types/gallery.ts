export const GALLERY_CATEGORIES = [
    "Graduation",
    "Convocation",
    "Arts Day",
    "Sports Day",
    "College Events",
    "Cultural Fest",
    "Workshops",
    "Seminars",
    "Placements",
    "Campus",
    "Other",
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export interface PublicGalleryItem {
    id: string;
    title: string;
    caption?: string | null;
    category: string;
    album_name?: string | null;
    image_url: string;
    sort_order: number;
    status: string;
    event_date?: string | null;
    created_at?: string;
}

export interface PublicGalleryAlbum {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    category: string;
    event_date?: string | null;
    cover_image_url?: string | null;
    sort_order: number;
    status: string;
    photo_count: number;
    photos?: PublicGalleryItem[];
    scheduled_for?: string | null;
    published_at?: string | null;
    updated_at?: string;
}

export const BASELINE_GALLERY_ITEMS: PublicGalleryItem[] = [
    {
        id: "gallery-1",
        title: "Amazon Placement Drive",
        caption: "Campus pool recruitment drive conducted for graduating engineering batches.",
        category: "Placements",
        album_name: "Placement Drives",
        image_url: "https://jcmcsiit.ac.in/Photogallery/2025/Amazon%20Placement%20Drive%20on%2001082025%20Friday/amazon%202025.jpeg",
        sort_order: 1,
        status: "published",
        event_date: "2025-08-01",
    },
    {
        id: "gallery-2",
        title: "Annual Athletic Meet",
        caption: "Track and field events, march-past, and championship trophies.",
        category: "Sports Day",
        album_name: "Annual Athletic Meet 2025",
        image_url: "https://jcmcsiit.ac.in/Photogallery/2025/Annual%20Athletic%20Meet/IMG-20250320-WA0093.jpg",
        sort_order: 2,
        status: "published",
        event_date: "2025-03-20",
    },
    {
        id: "gallery-3",
        title: "Bishops Visit our college",
        caption: "Honorary pastoral visit and blessings for the students and faculty.",
        category: "College Events",
        album_name: "Distinguished Campus Visits",
        image_url: "https://jcmcsiit.ac.in/Photogallery/2025/Bishops%20Visit%20%20our%20college/WhatsApp%20Image%202025-06-04%20at%2016.20.50.jpeg",
        sort_order: 3,
        status: "published",
        event_date: "2025-06-04",
    },
    {
        id: "gallery-4",
        title: "Congratulations POWER QUIZ WINNERS",
        caption: "State-level energy and power quiz competition champions felicitated.",
        category: "College Events",
        album_name: "Academic Achievements",
        image_url: "https://jcmcsiit.ac.in/Photogallery/2025/Congratulations%20POWER%20QUIZ%20WINNERS/WhatsApp%20Image%202025-11-10%20at%2018.41.59-imageonline.co-merged.jpeg",
        sort_order: 4,
        status: "published",
        event_date: "2025-11-10",
    },
    {
        id: "gallery-5",
        title: "Interactive Session on Sustainable Lifestyle",
        caption: "Special workshop on green campus initiatives, energy saving, and sustainability.",
        category: "Seminars",
        album_name: "Seminars & Workshops",
        image_url: "https://jcmcsiit.ac.in/Photogallery/2025/Interactive%20Session%20on%20Sustainable%20Lifestyle/WhatsApp%20Image%202025-02-14%20at%2012.09.19_00c566ec.jpg",
        sort_order: 5,
        status: "published",
        event_date: "2025-02-14",
    },
    {
        id: "gallery-6",
        title: "JIT Campus Pool Recruitment 2026",
        caption: "Multi-company placement interviews and technical screening rounds.",
        category: "Placements",
        album_name: "Placement Drives",
        image_url: "https://jcmcsiit.ac.in/Photogallery/2025/JIT%20Campus%20Pool%20Recruitment%202026/WhatsApp%20Image%202026-01-12%20at%2021.34.10.jpeg",
        sort_order: 6,
        status: "published",
        event_date: "2026-01-12",
    },
    {
        id: "gallery-7",
        title: "JIT ROBOGREET 2026",
        caption: "Robotics club demonstration and interactive greeting robot project exhibition.",
        category: "Workshops",
        album_name: "Seminars & Workshops",
        image_url: "https://jcmcsiit.ac.in/Photogallery/2025/JIT%20ROBOGREET%202026/WhatsApp%20Image%202025-12-31%20at%2018.26.31.jpeg",
        sort_order: 7,
        status: "published",
        event_date: "2025-12-31",
    },
    {
        id: "gallery-8",
        title: "JIT Super League 25",
        caption: "Annual intra-collegiate cricket tournament championship match.",
        category: "Sports Day",
        album_name: "Annual Athletic Meet 2025",
        image_url: "https://jcmcsiit.ac.in/Photogallery/2025/JIT%20Super%20League%2025/CRICKET%20RUNNER-UP%20RUBY%20HOUSE.jpg",
        sort_order: 8,
        status: "published",
        event_date: "2025-03-15",
    },
    {
        id: "gallery-9",
        title: "Liver Foundation of Kerala Health Camp",
        caption: "Community health awareness seminar and free screening camp organised on campus.",
        category: "College Events",
        album_name: "Community & NSS Outreach",
        image_url: "https://jcmcsiit.ac.in/Photogallery/2025/Liver%20Foundation%20of%20Kerala/IMG-20250320-WA0098.jpg",
        sort_order: 9,
        status: "published",
        event_date: "2025-03-20",
    },
    {
        id: "gallery-10",
        title: "Mega Placement Drive 2025",
        caption: "Over 20 corporate recruiting partners visiting the main seminar complex.",
        category: "Placements",
        album_name: "Placement Drives",
        image_url: "https://jcmcsiit.ac.in/Photogallery/2025/Mega%20Placement%20Drive%202025/Campus%20Placement%20Drive'25.jpeg",
        sort_order: 10,
        status: "published",
        event_date: "2025-02-28",
    },
    {
        id: "gallery-11",
        title: "Nabhas 2K25 Cultural Fest",
        caption: "Inter-collegiate arts festival with music, dance, and literary contests.",
        category: "Arts Day",
        album_name: "Nabhas Cultural Fest 2025",
        image_url: "https://jcmcsiit.ac.in/Photogallery/2025/Nabhas%202K25/IMG-20250320-WA0074.jpg",
        sort_order: 11,
        status: "published",
        event_date: "2025-03-20",
    },
    {
        id: "gallery-12",
        title: "SAYONARA 2K25 Farewell",
        caption: "Farewell ceremony and banquet celebrating the graduating class.",
        category: "Cultural Fest",
        album_name: "Nabhas Cultural Fest 2025",
        image_url: "https://jcmcsiit.ac.in/Photogallery/2025/SAYONARA%202K25/20250327_160913.jpg",
        sort_order: 12,
        status: "published",
        event_date: "2025-03-27",
    },
    {
        id: "gallery-13",
        title: "TECHNO VISTA 2025 National Conference",
        caption: "National conference on recent innovations in electrical and computer engineering.",
        category: "Seminars",
        album_name: "Techno Vista 2025",
        image_url: "https://jcmcsiit.ac.in/Photogallery/2025/TECHNO%20VISTA%202025%20%20National%20Conference/IMG-20250324-WA0037.jpg",
        sort_order: 13,
        status: "published",
        event_date: "2025-03-24",
    },
];

export const BASELINE_GALLERY_ALBUMS: PublicGalleryAlbum[] = [
    {
        id: "album-baseline-1",
        title: "Annual Athletic Meet 2025",
        slug: "annual-athletic-meet-2025",
        description: "Highlights of track, field, cricket, and sports championships across all student houses.",
        category: "Sports Day",
        event_date: "2025-03-20",
        cover_image_url: "https://jcmcsiit.ac.in/Photogallery/2025/Annual%20Athletic%20Meet/IMG-20250320-WA0093.jpg",
        sort_order: 1,
        status: "published",
        photo_count: 2,
    },
    {
        id: "album-baseline-2",
        title: "Nabhas Cultural Fest 2025",
        slug: "nabhas-cultural-fest-2025",
        description: "Campus cultural events, music competitions, and the annual Sayonara farewell ceremony.",
        category: "Arts Day",
        event_date: "2025-03-27",
        cover_image_url: "https://jcmcsiit.ac.in/Photogallery/2025/Nabhas%202K25/IMG-20250320-WA0074.jpg",
        sort_order: 2,
        status: "published",
        photo_count: 2,
    },
    {
        id: "album-baseline-3",
        title: "Placement Drives",
        slug: "placement-drives",
        description: "Recruitment rounds, company presentations, and interview sessions with top corporate recruiters.",
        category: "Placements",
        event_date: "2026-01-12",
        cover_image_url: "https://jcmcsiit.ac.in/Photogallery/2025/Amazon%20Placement%20Drive%20on%2001082025%20Friday/amazon%202025.jpeg",
        sort_order: 3,
        status: "published",
        photo_count: 3,
    },
    {
        id: "album-baseline-4",
        title: "Techno Vista 2025",
        slug: "techno-vista-2025",
        description: "National engineering conference showcasing student research, paper presentations, and hardware demos.",
        category: "Seminars",
        event_date: "2025-03-24",
        cover_image_url: "https://jcmcsiit.ac.in/Photogallery/2025/TECHNO%20VISTA%202025%20%20National%20Conference/IMG-20250324-WA0037.jpg",
        sort_order: 4,
        status: "published",
        photo_count: 1,
    },
    {
        id: "album-baseline-5",
        title: "Seminars & Workshops",
        slug: "seminars-and-workshops",
        description: "Technical masterclasses, sustainability forums, and robotics club exhibitions.",
        category: "Workshops",
        event_date: "2025-12-31",
        cover_image_url: "https://jcmcsiit.ac.in/Photogallery/2025/JIT%20ROBOGREET%202026/WhatsApp%20Image%202025-12-31%20at%2018.26.31.jpeg",
        sort_order: 5,
        status: "published",
        photo_count: 2,
    },
];
