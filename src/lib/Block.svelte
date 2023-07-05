<script lang="ts">
  import { contextMenu } from '$lib/context-menu.js';
  import ContextMenu from '$lib/ContextMenu.svelte';

  export let component;
  let showMenu = false;

  function rightClickContextMenu(event) {
    showMenu = true
    event.stopPropagation();
    event.preventDefault();

    contextMenu.set({
      event,
      items: [
        {
          label: 'Settings',
          callback: () => {
            console.log('Settings');
          }
        },
        {
          label: 'Remove',
          callback: () => {
            console.log('Remove');
          }
        }
      ],
      component
    });
  }
</script>


<div>
    {#each component.defaultValue.slots as slot}
        <div on:contextmenu|preventDefault={rightClickContextMenu}>{slot.value}</div>
    {/each}
</div>

<ContextMenu bind:showMenu={showMenu} />

<style lang="scss">

</style>
