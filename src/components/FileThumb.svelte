<script>
    export let handleRemoveFile = () => null;
    export let attachment = { id: "", title: "", type: "", url: "" };
</script>

<div class="file-thumb" on:click|preventDefault|stopPropagation>
    <span
        class="close"
        on:click|preventDefault|stopPropagation={handleRemoveFile(
            attachment.id
        )}>X</span
    >
    <span>{attachment.title}</span>
    {#if attachment.type === "application/pdf"}
        <iframe
            on:click|preventDefault|stopPropagation
            title="תצוגה מקדימה"
            name="תצוגה מקדימה"
            src={attachment.url}
            height="300"
            align="center"
            allow="fullscreen"
            frameborder="0"
        />
    {:else if attachment.type.startsWith("image/")}
        <img src={attachment.url} alt={attachment.title} />
    {/if}
</div>

<style>
    iframe,img {
        max-width: 100%;
    }
    img {
        object-fit: contain;
        height: 320px;
        width: 320px;
    }
    .file-thumb {
        padding: 15px 15px;
        background-color: #e9e9e9;
        border-radius: 10px;
        position: relative;
        display: grid;
        gap: 5px;
        align-items: center;
        justify-items: center;
    }
    .close {
        position: absolute;
        border-radius: 50%;
        left: 3px;
        top: 3px;
        width: 5px;
        height: 5px;
        color: lightgray;
        transition: color 0.2s ease-in-out;
        cursor: pointer;
    }
    .close:hover {
        color: orangered;
        transform: scale(1.1);
    }
    .close:active {
        transform: scale(1);
    }
</style>
