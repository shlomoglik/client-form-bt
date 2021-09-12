<script>
    import { slide } from "svelte/transition";
    import ArrowToggle from "./ArrowToggle.svelte";
  
    export let title, shrinkable, isShrink;
    export let handleShrink = () => {
        if(shrinkable){
            isShrink = !isShrink
            group.scrollIntoView(true)
        }
    };
    
    const shrinkAction = ()=> {
        if(shrinkable){
            handleShrink()
            group.scrollIntoView(true)
        }
    }
    let group;
  
  </script>
  
  <div class="form-group" tabindex="0" bind:this={group}>
    {#if title}
      <div class="form-group-title" on:click={shrinkAction}>
        <h3>{title}</h3>
        {#if shrinkable}
          <ArrowToggle direction={isShrink ? "up" : "down"} />
        {/if}
      </div>
    {/if}
    {#if !isShrink}
      <div transition:slide class="content">
        <slot/>
      </div>
    {/if}
  </div>
  
  <style>
    .form-group {
      display: grid;
      align-items: center;
      font-size: 18px;
      cursor: pointer;
      border-top: 3px solid #ebebeb;
    }
    .form-group-title {
      padding: 5px;
      display: grid;
      grid-auto-flow: column;
      grid-template-columns: 1fr 5%;
      align-items: center;
    }
    .form-group-title:hover {
      background-color: #eee;
    }
    .content {
      display: grid;
      gap: 5px;
      padding: 5px;
    }
    h3 {
      font-weight: 500;
      font-size: 32px;
    }
  </style>