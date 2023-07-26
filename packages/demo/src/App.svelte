<script lang="ts">
  import {onMount} from 'svelte';
  import '../../../dist/lib/page-builder.wc.js';

  let el: HTMLDivElement;

  onMount(() => {
    const instanceEl = document.createElement('jp-page-builder');

    el.appendChild(instanceEl);
  })
</script>

<div bind:this={el}></div>
