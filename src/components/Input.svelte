<script>
import { formDoc } from "../stores";
    export let header;
</script>

<div class="input">
    <label for={header}>{$formDoc.headers[header] ? $formDoc.headers[header].label: ""}</label>
    <input type="text" name={header} id="name" bind:value={$formDoc.docData[header]} />
</div>
<style>
    .input{
        display: grid;
        align-items: center;
        justify-content: center;
        font-size: 18px;
    }
    .input label , .input input{
        font-size: 24px;
        min-width: 300px;
    }
</style>
