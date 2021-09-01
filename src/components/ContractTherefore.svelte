<script>
    export let text = "";
    export let prefix = "לפיכך"
    export let editable = false;
</script>

<div>
    <span><strong>{prefix}</strong></span><br>
    <span contenteditable={editable}>{@html text}</span>
</div>
