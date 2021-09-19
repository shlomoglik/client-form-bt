<script>
    import ContractSide from "./ContractSide.svelte";

    import Signers from "./Signers.svelte";

    export let client = {
        name: ``,
        id: "",
        type: "חברה בעמ",
        address: "",
        signers: [{ prefix: "", name: "", id: "" }],
    };
    export let company = {};
    const defaultOptions = {
        name: `א.א.י.נ. ביזנס טיים בע"מ`,
        id: "515988376",
        type: "חברה בעמ",
        address: "",
        signers: [{ prefix: "מר", name: "אייל אסולין", id: "03281184" }],
    };
    Object.entries(defaultOptions).forEach(([opt, val]) => {
        if (!company[opt]) company[opt] = val;
    });
</script>

<div>
    <p contenteditable><strong>בין</strong></p>
    <ContractSide {company} editable="true" />
    <Signers contacts={company.signers} editable="true" />
    <p>
        <strong>מצד אחד</strong>
        <span>&nbsp;</span>
        <i>(להלן: החברה ו/או נותנת השירותים)</i>
    </p>
</div>
<div>
    <p contenteditable><strong>לבין</strong></p>
    <ContractSide company={client} />
    <Signers contacts={client.signers} />
    <p>
        <strong>מצד שני</strong>
        <span
            >&nbsp;<span>
                <i>(להלן: הלקוח)</i>
            </span></span
        >
    </p>
</div>

<style>
    div :global([contenteditable="false"]) {
        cursor: default;
    }
</style>
