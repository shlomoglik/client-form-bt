<script>
    import { onMount } from "svelte";

    export let subs, sub, formDoc;

    let replaceHeaders = [];

    const DOC_DATA_PATTERN = /#_([a-zA-Z]+)_#/gm;
    const INDEX_PATTERN = /&_([\d\.]+)_&/gm;
    const replaceDocData = (_, match) =>
        $formDoc.docData[match] ? $formDoc.docData[match] : "____";
    const replaceIndex = (_, match) =>
        subs.find(({ id }) => id == match)?.index || "____";

    $: text = textReplace();

    onMount(() => {
        const regex = DOC_DATA_PATTERN
        const matches = regex.exec(sub.text);
        if (matches && matches[1] && matches[1] in $formDoc.headers) {
            replaceHeaders = [matches[1], ...replaceHeaders];
        }
    });
    $:{
        replaceHeaders.forEach(header=>{
            if($formDoc.docData[header]){
                text = textReplace()
            }
        })
    }

    function textReplace() {
        if (sub.text) {
            return sub.text
                .replaceAll(DOC_DATA_PATTERN, replaceDocData)
                .replaceAll(INDEX_PATTERN, replaceIndex);
        }
        return "";
    }
</script>

<li class="sub" contenteditable={sub.editable}>
    {@html text}
</li>
