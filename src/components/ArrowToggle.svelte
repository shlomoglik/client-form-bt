<script>
    export let direction
</script>
<span class={`arrow ${direction || "up"}`}/>

<style>
  .arrow {
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 20px solid #555;
    transition: all 0.2s ease-in-out;
  }
  .up {
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 20px solid #555;
  }
  .down {
    transform: rotate(-180deg);
  }
</style>