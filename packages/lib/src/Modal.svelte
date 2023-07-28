<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Button from './Button.svelte';

  export let showModal: boolean;

  const dispatch = createEventDispatcher();
  function reverseValue() {
    dispatch('reverse');
    dialog.close();
  }

  let dialog;

  $: if (dialog && showModal) dialog.showModal();
</script>

<dialog
  bind:this={dialog}
  on:close={() => (showModal = false)}
  on:click|self={reverseValue}
  class="max-w-lg rounded backdrop:bg-black/30"
>
  {#if showModal}
    <div aria-hidden="true" on:click|stopPropagation>
      <header class="text-2xl font-bold p-4 mb-4 border-b border-b-black/25">
        <slot name="header" />
      </header>
      <slot />
    </div>
  {/if}
</dialog>
