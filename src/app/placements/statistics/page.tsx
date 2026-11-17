import { Metadata } from "next";
import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = {
    title: "Placement Statistics | JCMC SIIT",
    description: "Learn more about Placement Statistics at JCMC SIIT.",
};

export default function Page() {
    return <ComingSoon title="Placement Statistics" routePath="/placements/statistics" />;
}
