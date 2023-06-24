<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageBuilderOptions } from './interface/page-builder-options.interface.ts';
  import type { PageBuilderComponent } from './interface/page-builder-component.interface.ts';
  import type { PageBuilderComponentValue } from './interface/page-builder-component-value.interface.ts';
  import { fly } from 'svelte/transition';
  import { contextMenu, iframeEl as iframeElStore } from './context-menu.ts';
  import ContextMenu from './ContextMenu.svelte';

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
      <button on:click={() => (previewStyle = 'desktop')} class:active={previewStyle === 'desktop'}
        >Desktop</button
      >
      <button on:click={() => (previewStyle = 'tablet')} class:active={previewStyle === 'tablet'}
        >Tablet</button
      >
      <button on:click={() => (previewStyle = 'mobile')} class:active={previewStyle === 'mobile'}
        >Mobile</button
      >
    </div>
    <div>
      <button on:click={() => (componentGallery = true)}>+ Add Component</button>
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
      <button on:click={() => (componentGallery = false)}>Close</button>

      {#each options.components as component}
        <button class="component-gallery-item" on:click={() => selectComponent(component.selector)}>
          <h3>{component.title || component.selector}</h3>
          {#if component.description}
            <p>{component.description}</p>
          {/if}
        </button>
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
