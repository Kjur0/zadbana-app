import { ComponentExample } from "@/components/component-example";
import { db } from "@/lib/db";
import { collection, doc, getDoc } from "firebase/firestore";

export default async function Page() {
    const d = await getDoc(doc(collection(db, "example"), "c648kMelO39uJdVGq2CX"))
    return <><ComponentExample /><div className="p-4">{d.data()?.name}</div></>;
}