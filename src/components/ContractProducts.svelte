<script>
    import Icon from "./Icon.svelte";
    import { fade } from "svelte/transition";
    import { productItems } from "../stores";
    import { onMount } from "svelte";
    import { fetchMondayAPI } from "../services/monday";
    import { reduceColumns } from "../utils/data";
    export let formDoc;

    let categories = [];

    $: {
        if ($formDoc.docData.package) {
            setCurrentPackege();
        }
    }

    const toggleCheckProduct = (product) => {
        const findIndex = $productItems.findIndex((el) => el.id === product.id);
        if (findIndex > -1 && product.text.startsWith("*")) {
            $productItems[findIndex] = { ...product, active: !product.active };
        }
    };
    function setCurrentPackege() {
        const currentPackage = $formDoc.docData.package;
        if (currentPackage) {
            $productItems.forEach((product, ind) => {
                if (
                    product?.attributes?.packages?.value?.includes(currentPackage)
                ) {
                    $productItems[ind] = { ...product, active: true };
                } else $productItems[ind] = { ...product, active: false };
            });
        }
    }
    async function fetchProductItems() {
        const dict = {
            connect_boards: "packages",
            numbers: "price",
            long_text: "description",
            group: "category",
        };
        const qry = `{
            boards(ids:1664213853){
                groups{
                    id
                    title
                }
                items{
                    id
                    name
                    group{
                        title
                        id
                    }
                    column_values(ids:[${Object.keys(dict).toString()}]){
                        id
                        type
                        title
                        text
                        value
                    }
                }
            }
        }`;
        let data = [];
        let groups = [];
        const currentPackage = $formDoc.docData.package;
        let result = await fetchMondayAPI(qry);
        if (result && result.boards[0].items.length > 0) {
            data = result.boards[0].items.map(
                ({ name, id, group, column_values = [] }) => {
                    const groupField = {
                        id: "group",
                        text: group.title,
                        value: group.title,
                    };
                    const attributes = reduceColumns({
                        column_values: [groupField, ...column_values],
                        dict,
                    });
                    const active =
                        currentPackage &&
                        attributes?.packages?.value?.includes(currentPackage);
                    return {
                        text: name,
                        id,
                        category: group.id,
                        active,
                        attributes,
                    };
                }
            );
        }
        if (result && result.boards[0].groups.length > 0) {
            groups = result.boards[0].groups.map(({ title, id }) => ({
                id,
                title,
            }));
        }
        return { data, groups };
    }
    async function fetchData() {
        try {
            const { data, groups } = await fetchProductItems();
            categories = [...groups];
            $productItems = [...data];
        } catch (err) {
            console.error(err);
        }
    }

    onMount(() => {
        fetchData();
    });
</script>

<div class="wrrapper">
    {#each categories as category (category.id)}
        <h5>{category.title}</h5>
        {#each $productItems.filter((el) => el.category === category.id) as product, ind (product.id)}
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
                <span transition:fade class:active={product.active}>
                    {product.text}
                </span>
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
