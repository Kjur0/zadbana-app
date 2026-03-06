import { ComponentExample } from "@/components/component-example";
import { db } from "@/lib/db";
import { collection, doc, getDoc } from "firebase/firestore";

export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";

export default async function Page() {
    const d = await getDoc(doc(collection(db, "example"), "c648kMelO39uJdVGq2CX"));

    if (!d.exists()) {
        return (
            <>
                <ComponentExample />
                <div className="p-4">Document not found.</div>
            </>
        );
    }

    return (
        <>
            <ComponentExample />
            <div className="p-4">{d.data()?.name}</div>
        </>
    );
}