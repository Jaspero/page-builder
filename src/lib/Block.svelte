<script lang="ts">
  import { contextMenu } from '$lib/context-menu.js';
  import ContextMenu from '$lib/ContextMenu.svelte';

  export let component;
  let showMenu = false;
  function rightClickContextMenu(e) {
    console.log(222);
    showMenu = true
    e.stopPropagation();
    e.preventDefault();

    <!--contextMenu.set({-->
    <!--  e,-->
    <!--  items: [-->
    <!--    {-->
    <!--      label: 'Settings',-->
    <!--      callback: () => {-->
    <!--        console.log(366);-->
    <!--      }-->
    <!--    },-->
    <!--    {-->
    <!--      label: 'Remove',-->
    <!--      callback: () => {-->
    <!--        const droppedDivIndex = renderedComponents.findIndex(x => x.el === el);-->
    <!--        console.log('removeCompssonent', el, component.selector, droppedDivIndex);-->
    <!--        removeComponent(droppedDivIndex)-->
    <!--        updateValue();-->
    <!--      }-->
    <!--    }-->
    //   ]
    // });
  }

</script>

<div>
    {#each component.defaultValue.slots as slot}
        <div on:contextmenu|preventDefault={rightClickContextMenu}>{slot.value}</div>
    {/each}
</div>

<ContextMenu />

<style lang="scss">

</style>
