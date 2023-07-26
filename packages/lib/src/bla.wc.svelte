<svelte:options
  customElement={{
    tag: 'jp-bla',
    shadow: 'none'
  }}
/>

<script lang="ts">
	export let title = 'aaa';
</script>

<p>Example</p>
<p>{title}</p>