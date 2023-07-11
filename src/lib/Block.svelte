<script lang="ts">

  export let component;
  let showMenu = false;

  function rightClickContextMenu(event) {
    showMenu = true;
    event.stopPropagation();
    event.preventDefault();
  }
</script>

<div>
  {#each component.defaultValue.slots as slot}
    <div on:contextmenu|preventDefault={rightClickContextMenu}>{slot.value}</div>
  {/each}
</div>

<style lang="scss">
</style>
