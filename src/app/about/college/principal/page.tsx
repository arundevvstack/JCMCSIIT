import { Metadata } from "next";
import { PrincipalMessageSection } from "@/components/about/principal-message-section";
import { getPrincipalMessageContent } from "@/lib/cms/principal-message";

export const metadata: Metadata = {
    title: "A Message from the Principal | JCMCSIIT",
    description:
        "Official message from Dr. Kim J. Seelan, Principal of John Cox Memorial CSI Institute of Technology.",
};

export default async function PrincipalPage() {
    const { data } = await getPrincipalMessageContent();

    return <PrincipalMessageSection content={data} />;
}
