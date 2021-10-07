<script>
    import { useNavigate, useLocation } from "svelte-navigator";
    import { db } from "../services/firestore";
    import { formDoc, formDocID } from "../stores";
    import ClientForm from "./ClientForm.svelte";

    const navigate = useNavigate();
    const location = useLocation();
    async function loadDraft() {
        try {
            const currentPath = $location.pathname;
            const doc = await db.doc(currentPath).get();
            if (!doc.exists) navigate("/");
            else {
                //load data to formDoc
                const docID = currentPath.split("/")[2];
                $formDocID = docID;
                $formDoc.docData = doc.data()
            }
        } catch (error) {
            console.error(error);
        }
    }
</script>

{#await loadDraft()}
    <div>טוען נתונים...</div>
{:then}
    <ClientForm />
{/await}
