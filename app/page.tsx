import { db } from "@/lib/firebase";
import { collection, doc, getDoc } from "firebase/firestore";

export const dynamic = "force-dynamic";

export default async function Page() {
    let d = await getDoc(doc(collection(db, "example"), "c648kMelO39uJdVGq2CX"));

    if (!d.exists()) {
        return (
            <>
                <div className="p-4">Document not found.</div>
            </>
        );
    }

    return (
        <>
            <div className="p-4">{d.data()?.name}</div>
        </>
    );
}