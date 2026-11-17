import { Metadata } from "next";
import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = {
    title: "Terms of Use | JCMC SIIT",
    description: "Learn more about Terms of Use at JCMC SIIT.",
};

export default function Page() {
    return <ComingSoon title="Terms of Use" routePath="/terms" />;
}
