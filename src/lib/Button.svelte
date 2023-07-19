<script lang="ts">
  export let href = '';
  export let target: '_blank' | '_self' | '_parent' | '_top' | '' = '';
  export let variant: 'filled' | 'stroked' | 'icon' = 'filled';
  export let color: 'primary' | 'secondary' = 'primary';
  export let active = false;

  $: properties = {
    class: [
      variant == 'filled' && 'variant-filled',
      variant == 'stroked' && 'variant-stroked',
      variant == 'icon' && 'variant-icon',
      color == 'primary' && 'primary',
      color == 'secondary' && 'secondary'
    ]
      .filter(Boolean)
      .join(' ')
    /*style: [
            max ? 'max-width:' + max + 'ch;' : undefined,
            lineHeight ? 'line-height:' + lineHeight + ';' : undefined
        ].join(' ')*/
  };
</script>

{#if href}
  <a {...properties} {href} {target} class:active>
    <slot />
  </a>
{:else}
  <button {...properties} class:active class:has-prefix={$$slots.prefix} on:click>
    {#if $$slots.prefix && variant !== 'icon'}
      <slot name="prefix" />
    {/if}

    <slot />
  </button>
{/if}

<style lang="postcss">
  a,
  button {
    @apply flex justify-center items-center
  }

  .variant-filled {
    @apply min-w-[2.5rem] h-10 gap-3 px-4 py-2 rounded
  }

  .variant-filled.primary {
    @apply bg-black text-white
  }

  .has-prefix {
    @apply pl-3
   }

  .variant-icon {
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    margin: 0;
    border-radius: 0.25rem;
    border: 1px solid #666;
    background-color: white;
    cursor: pointer;
    transition: 0.25s;
  }

  /*.variant-icon.active {
    background-color: var(--primary);
    color: var(--secondary);
  }*/
</style>
