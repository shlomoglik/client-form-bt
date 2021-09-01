<script>
    export let text = "";
    export let prefix = "והואיל"
    export let editable = false;
</script>

<div>
    <span><strong>{prefix}</strong></span>
    <p contenteditable={editable}>{@html text}</p>
</div>
