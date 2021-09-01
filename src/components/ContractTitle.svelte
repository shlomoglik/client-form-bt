<script>
    export let text = "כותרת";
    export let subText = "";
    export let size = "M";
</script>

<div>
    <h3 class={size}>{text}</h3>
    {#if subText}
        <h5><i>{subText}</i></h5>
    {/if}
</div>

<style>
    div {
        display: grid;
        align-items: center;
        justify-content: center;
    }
    h3 {
        font-family: tahoma, geneva, sans-serif;
        font-weight: 700;
        padding: 5px;
    }
    h3.L {
        color: white;
        background-image: linear-gradient(
            270deg,
            rgb(89, 28, 213) 95%,
            transparent
        );
        padding: 5px 15px 5px 25px;
    }
    h3.M {
        color: rgb(89, 28, 213);
    }
    h5 {
        padding: 2px;
        font-size: smaller;
    }
</style>
