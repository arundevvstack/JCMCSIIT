import { Metadata } from "next";
import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = {
    title: "Non-Discrimination Policy | JCMC SIIT",
    description: "Learn more about Non-Discrimination Policy at JCMC SIIT.",
};

export default function Page() {
    return <ComingSoon title="Non-Discrimination Policy" routePath="/non-discrimination" />;
}
