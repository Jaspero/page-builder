<script lang="ts">
  import { onMount } from 'svelte';
  import '../../../dist/lib/page-builder.wc.js';
  import '../../../dist/lib/bla.wc.js';

  let el: HTMLDivElement;

  onMount(() => {
    const instanceEl = document.createElement('jp-page-builder');

    console.log(222, instanceEl.constructor);

    el.appendChild(instanceEl);
  });
</script>

<div bind:this={el} />
