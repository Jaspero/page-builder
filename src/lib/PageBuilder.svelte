<svelte:options customElement="jp-page-builder" />

<script lang="ts">
  import Block from '$lib/Block.svelte';
  import { onMount } from 'svelte';
  import type { PageBuilderOptions } from './interface/page-builder-options.interface.ts';
  import type { PageBuilderComponent } from './interface/page-builder-component.interface.ts';
  import type { PageBuilderComponentValue } from './interface/page-builder-component-value.interface.ts';
  import { fly } from 'svelte/transition';
  import { iframeEl as iframeElStore } from './context-menu.ts';
  import Button from './Button.svelte';

  export let options: PageBuilderOptions;
  export let value: PageBuilderComponentValue[];

  let componentGallery = false;
  let componentMap: {
    [selector: string]: PageBuilderComponent;
  };
  let previewStyle = 'desktop';
  let iframeEl: HTMLIFrameElement;
  let iframeDoc: Document;

  let renderedComponents: Array<{
    el: HTMLElement;
    value: PageBuilderComponentValue;
  }> = [];

  let draggingItemHide = null;
  let mouseYCoordinate = null;
  let distanceTopGrabbedVsPointer = null;

  let draggingItem = null;
  let draggingItemIndex = null;

  let hoveredItemIndex = null;

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

  function refreshIframe() {
    iframeEl.contentWindow.location.reload();
    setTimeout(() => {
      iframeDoc = (iframeEl.contentDocument || iframeEl.contentWindow) as Document;
      if (value) {
        value.forEach((v: PageBuilderComponentValue) =>
          addComponent(componentMap[v.selector], v, false)
        );
      }
    }, 50);
  }

  function addComponent(
    component: PageBuilderComponent,
    value?: PageBuilderComponentValue,
    repopulate = true
  ) {
    const el = new Block({
      target: iframeDoc.body,
      props: {
        component
      }
    });
    if (repopulate) {
      renderedComponents.push({
        el,
        value: value
          ? value
          : {
              selector: component.selector
            }
      });
    }
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
    refreshIframe();
  }

  function updateValue() {
    value = renderedComponents.map((c) => c.value);
  }

  $: {
    if (
      draggingItemIndex != null &&
      hoveredItemIndex != null &&
      draggingItemIndex != hoveredItemIndex
    ) {
      [value[draggingItemIndex], value[hoveredItemIndex]] = [
        value[hoveredItemIndex],
        value[draggingItemIndex]
      ];
      draggingItemIndex = hoveredItemIndex;
      refreshIframe();
    }
  }

  let container = null;
</script>

<div class="pb">
  <header class="pb-header">
    <div>
      <Button
        variant="icon"
        on:click={() => (previewStyle = 'desktop')}
        active={previewStyle === 'desktop'}
      />

      <Button
        variant="icon"
        on:click={() => (previewStyle = 'tablet')}
        active={previewStyle === 'tablet'}
      />

      <Button
        variant="icon"
        on:click={() => (previewStyle = 'mobile')}
        active={previewStyle === 'mobile'}
      />
    </div>

    <div>
      <Button on:click={() => (componentGallery = true)}>
        <slot slot="prefix" />

        Add Component
      </Button>
    </div>
  </header>

  <div class="pb-grid">
    <div class="pb-preview {previewStyle}">
      <iframe bind:this={iframeEl} />
    </div>
    <div class="pb-preview container" bind:this={container}>
      {#if mouseYCoordinate}
        <div class="item ghost" style="top: {mouseYCoordinate + distanceTopGrabbedVsPointer}px;">
          {draggingItem.selector}
        </div>
      {/if}

      {#each value as item, index (item)}
        <div
          class="item {draggingItemHide === item ? 'invisible' : ''}"
          draggable="true"
          on:dragstart={(e) => {
            mouseYCoordinate = e.clientY;

            draggingItem = item;
            draggingItemIndex = index;
            draggingItemHide = item;

            distanceTopGrabbedVsPointer = e.target.getBoundingClientRect().y - e.clientY - 73;
          }}
          on:drag={(e) => {
            mouseYCoordinate = e.clientY;
          }}
          on:dragover={(e) => {
            hoveredItemIndex = index;
          }}
          on:dragend={(e) => {
            draggingItemHide = null;
            hoveredItemIndex = null;
          }}
        >
          <div>
            {item.selector}
            <Button
              variant="icon"
              on:click={() => removeComponent(index)}
              active={previewStyle === 'tablet'}
            />
          </div>
        </div>
      {/each}
    </div>
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

<style>
  .pb {
    border: 1px solid #ccc;
    position: relative;
  }

  .pb-grid {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }

  .pb-header {
    border-bottom: 1px solid #ccc;
    display: flex;
    justify-content: space-between;
    padding: 1rem;
  }

  .pb-preview.desktop,
  .pb-preview.tablet,
  .pb-review.mobile {
    grid-column: span 8 / span 8;
  }

  .pb-preview.container {
    position: relative;
    grid-column: span 4 / span 4;
    padding: 10px;
  }

  .pb-header div:first-child {
    display: flex;
    gap: 0.5rem;
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

  .item {
    width: 100%;
    background: white;
    padding: 10px;
    border: black solid 1px;
    margin-bottom: 10px;
    cursor: grab;
  }

  .ghost {
    margin-bottom: 10px;
    pointer-events: none;
    z-index: 99;
    position: absolute;
    width: 100%;
  }

  .invisible {
    opacity: 0;
  }
</style>
