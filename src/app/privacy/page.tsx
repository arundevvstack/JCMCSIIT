import { Metadata } from "next";
import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = {
    title: "Privacy Policy | JCMC SIIT",
    description: "Learn more about Privacy Policy at JCMC SIIT.",
};

export default function Page() {
    return <ComingSoon title="Privacy Policy" routePath="/privacy" />;
}
