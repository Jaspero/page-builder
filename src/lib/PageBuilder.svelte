<script lang="ts">
  import Laptop from "svelte-material-icons/Laptop.svelte";
  import Tablet from "svelte-material-icons/Tablet.svelte";
  import Cellphone from "svelte-material-icons/Cellphone.svelte";
  import Plus from "svelte-material-icons/Plus.svelte";
  import { onMount } from 'svelte';
  import type { PageBuilderOptions } from './interface/page-builder-options.interface.ts';
  import type { PageBuilderComponent } from './interface/page-builder-component.interface.ts';
  import type { PageBuilderComponentValue } from './interface/page-builder-component-value.interface.ts';
  import { fly } from 'svelte/transition';
  import { contextMenu, iframeEl as iframeElStore } from './context-menu.ts';
  import ContextMenu from './ContextMenu.svelte';
  import Button from "./Button.svelte";

  export let options: PageBuilderOptions;
  export let value: PageBuilderComponentValue[];

  let componentGallery = false;
  let componentMap: {
    [selector: string]: PageBuilderComponent;
  };
  let previewStyle = 'desktop';
  let iframeEl: HTMLIFrameElement;
  let iframeDoc: Document;

  const renderedComponents: Array<{
    el: HTMLElement;
    value: PageBuilderComponentValue;
  }> = [];

  onMount(() => {
    componentMap = options.components.reduce(
      (acc: { [selector: string]: PageBuilderComponent }, cur: PageBuilderComponent) => {
        acc[cur.selector] = cur;
        return acc;
      },
      {}
    );
    iframeElStore.set(iframeEl);
    iframeDoc = (iframeEl.contentDocument || iframeEl.contentWindow) as Document;

    if (value) {
      value.forEach((v: PageBuilderComponentValue) => addComponent(componentMap[v.selector], v));
    }
  });

  function addComponent(component: PageBuilderComponent, value?: PageBuilderComponentValue) {
    const el = document.createElement(component.selector);

    el.addEventListener('contextmenu', (event: MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();

      console.log('index', event);

      contextMenu.set({
        event,
        items: [
          {
            label: 'Settings',
            callback: () => {}
          },
          {
            label: 'Remove',
            callback: () => {

            }
          }
        ]
      });
    });

    if (value) {
      if (value.attributes) {
        for (const key in value.attributes) {
          el.setAttribute(key, value.attributes[key]);
        }
      }

      if (value.slots) {
        value.slots.forEach(
          (slot) =>
            (el.innerHTML += `<div ${slot.name ? `slot="${slot.name}"` : ''}>${slot.value}</div>`)
        );
      }
    }

    renderedComponents.push({
      el,
      value: value
        ? value
        : {
            selector: component.selector
          }
    });

    iframeDoc.body.appendChild(el);
  }

  function selectComponent(selector: string) {
    const component = componentMap[selector];
    addComponent(component, { ...(component.defaultValue || {}), selector });
    componentGallery = false;
    updateValue();
  }

  function removeComponent(index: number) {
    renderedComponents.splice(index, 1);
    updateValue();
  }

  function updateValue() {
    value = renderedComponents.map((c) => c.value);
  }
</script>

<div class="pb">
  <header class="pb-header">
    <div>
      <Button variant="icon" on:click={() => (previewStyle = 'desktop')} active={previewStyle === 'desktop'}>
        <Laptop size="24" />
      </Button>

      <Button variant="icon" on:click={() => (previewStyle = 'tablet')} active={previewStyle === 'tablet'}>
        <Tablet size="24" />
      </Button>

      <Button variant="icon" on:click={() => (previewStyle = 'mobile')} active={previewStyle === 'mobile'}>
        <Cellphone size="24" />
      </Button>
    </div>

    <div>
      <Button on:click={() => (componentGallery = true)}>
        <slot slot="prefix">
          <Plus size="24" />
        </slot>

        Add Component
      </Button>
    </div>
  </header>

  <div class="pb-preview {previewStyle}">
    <iframe bind:this={iframeEl} />
  </div>

  {#if componentGallery}
    <div
      in:fly={{ x: 200, duration: 500 }}
      out:fly={{ x: -200, duration: 500 }}
      class="component-gallery"
    >
      <Button on:click={() => (componentGallery = false)}>Close</Button>

      {#each options.components as component}
        <Button on:click={() => selectComponent(component.selector)}>
          <h3>{component.title || component.selector}</h3>
          {#if component.description}
            <p>{component.description}</p>
          {/if}
        </Button>
      {/each}
    </div>
  {/if}
</div>

<ContextMenu />

<style>
  .pb {
    border: 1px solid #ccc;
    position: relative;
  }

  .pb-header {
    border-bottom: 1px solid #ccc;
    display: flex;
    justify-content: space-between;
    padding: 1rem;
  }

  .pb-header div:first-child {
    display: flex;
    gap: .5rem;
  }

  iframe {
    width: 100%;
    display: block;
    border: none;
    height: 100%;
  }

  .component-gallery {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    border-bottom: 1px solid #ccc;
    min-height: 300px;
    background-color: white;
    z-index: 1;
  }
</style>