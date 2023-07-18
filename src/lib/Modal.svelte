<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let showModal: boolean;

  const dispatch = createEventDispatcher();

  function saveModal() {
    dispatch('saveEvent');
    dialog.close();
  }

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
  on:click|self={() => reverseValue()}
>
  <div on:click|stopPropagation>
    <slot name="header" />
    <hr />
    <slot />
    <button autofocus on:click={() => reverseValue()}>close</button>
    <button autofocus on:click={saveModal}>save</button>
  </div>
</dialog>

<style>
  dialog {
    max-width: 32em;
    border-radius: 0.2em;
    border: none;
    padding: 0;
  }
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }
  dialog > div {
    padding: 1em;
  }
  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes zoom {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }
  dialog[open]::backdrop {
    animation: fade 0.2s ease-out;
  }
  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  button {
    display: block;
  }
</style>
