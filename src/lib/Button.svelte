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

<style lang="scss">
  a,
  button {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .variant {
    &-filled {
      min-width: 2.5rem;
      height: 2.5rem;
      gap: 0.75rem;
      padding: var(--button-y-padding) var(--button-x-padding);
      border-radius: var(--button-br);
      border: none;

      /* Colors */
      &.primary {
        background-color: var(--primary);
        color: var(--primary-contrast);
      }
      &.secondary {
        background-color: var(--secondary);
        color: var(--secondary-contrast);
      }

      &.has-prefix {
        padding-left: 0.75rem;
      }
    }
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

  .variant-icon.active {
    background-color: var(--primary);
    color: var(--secondary);
  }
</style>
