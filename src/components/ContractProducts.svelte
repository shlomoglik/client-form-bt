<script>
    import Icon from "./Icon.svelte";
    import { fade } from "svelte/transition";
    import { producstList } from "../stores";
    export let categories, formDoc;

    $: {
        if ($formDoc.docData.package) {
            setCurrentPackege();
        }
    }

    const toggleCheckProduct = (product) => {
        const findIndex = $producstList.findIndex((el) => el.id === product.id);
        if (findIndex > -1) {
            $producstList[findIndex] = { ...product, active: !product.active };
        }
    };
    function setCurrentPackege() {
        const currentPackage = $formDoc.docData.package;
        if (currentPackage) {
            $producstList.forEach((product, ind) => {
                if (
                    Array.isArray(product.packages) &&
                    product.packages.includes(currentPackage)
                ) {
                    $producstList[ind] = { ...product, active: true };
                } else $producstList[ind] = { ...product, active: false };
            });
        }
    }
</script>

<div class="wrrapper">
    {#each categories as category (category.id)}
        <h5>{category.text}</h5>
        {#each $producstList.filter((el) => el.category === category.id) as product, ind (product.id)}
            <div class="product">
                <span
                    transition:fade
                    class="check"
                    on:click={() => toggleCheckProduct(product)}
                >
                    {#if product.active}
                        <Icon name="icon-check" />
                    {:else}
                        -
                    {/if}
                </span>
                <span transition:fade class:active={product.active}
                    >{product.text}</span
                >
            </div>
        {/each}
    {/each}
</div>

<style>
    h5:not(:first-child) {
        margin-top: 15px;
    }
    .wrrapper {
        display: grid;
        justify-content: center;
        gap: 3px;
    }
    .product {
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        grid-template-columns: max-content 1fr;
        gap: 5px;
        justify-items: flex-start;
        color: #c6c6c6;
    }
    .active {
        color: initial;
    }
    .check {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2px;
        border: 1px solid lightgray;
        border-radius: 2px;
        width: 2rem;
        height: 2rem;
        color: var(--color-primary);
        cursor: pointer;
    }
</style>
