<script lang="ts">
  export let component;
  export let style;
  let showMenu = false;

  function rightClickContextMenu(event) {
    showMenu = true;
    event.stopPropagation();
    event.preventDefault();
  }
</script>

<div {style}>
  {#each component.slots as slot}
    <div aria-hidden="true" on:contextmenu|preventDefault={rightClickContextMenu}>{slot.value}</div>
  {/each}
</div>

<style lang="scss">
</style>
