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
  import Modal from './Modal.svelte';
  import { ModularInstance, ModularSchema, ModularView } from '@jaspero/modular';

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
  let editing: null | number = null;
  let selectedItem: PageBuilderComponent;
  let container: HTMLDivElement | null = null;
  let hoveredItemIndex = null;
  let showModal = false;
  let attributesContainer: HTMLDivElement;

  $: if (
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

  $: if (attributesContainer) {
    const schema = new ModularSchema({
      properties: {
        color: { type: 'string' },
        'background-color': { type: 'string' }
      }
    });
    const instance = schema.createInstance({});
    const view = new ModularView({
      schema,
      views: [
        {
          justify: 'center',
          container: 'form',
          items: [
            {
              field: '/color',
              component: 'carbon-input'
            },
            {
              field: '/background-color',
              component: 'carbon-input'
            }
          ]
        }
      ]
    });

    const render = view.render({
      parentElement: attributesContainer,
      instance,
    });

    render.addEventListener("change", (value) => {
      console.log("the final", value);
    });
  }

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

  export function save() {
    refreshIframe();
  }

  export function reverseValue() {
    value[editing!] = JSON.parse(JSON.stringify(selectedItem!));
  }

  function formatStyle(styles) {
    return Object.entries(styles)
      .map(([key, value]) => `${key}:${value}`)
      .join(';');
  }

  function refreshIframe() {
    iframeEl.contentWindow!.location.reload();
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
        component: value || component.defaultValue,
        style: formatStyle(value?.attributes) || ''
      }
    }) as any;
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

  function openEdit(ind: number, item: PageBuilderComponent) {
    console.log('item', item);
    editing = ind;
    selectedItem = item;
    showModal = true;
  }

  function updateValue() {
    value = renderedComponents.map((c) => c.value);
  }
</script>

<div>
  <header class="pb-header">
    <div>
      <Button
        variant="icon"
        on:click={() => (previewStyle = 'desktop')}
        active={previewStyle === 'desktop'}
      >
        <span class="material-symbols-outlined"> laptop_mac </span>
      </Button>

      <Button
        variant="icon"
        on:click={() => (previewStyle = 'tablet')}
        active={previewStyle === 'tablet'}
      >
        <span class="material-symbols-outlined"> tablet </span>
      </Button>

      <Button
        variant="icon"
        on:click={() => (previewStyle = 'mobile')}
        active={previewStyle === 'mobile'}
      >
        <span class="material-symbols-outlined"> smartphone </span>
      </Button>
    </div>

    <div>
      <Button on:click={() => (componentGallery = true)}>
        <slot slot="prefix">
          <span class="material-symbols-outlined"> add </span>
        </slot>

        Add Component
      </Button>
    </div>
  </header>

  <div class="pb-grid">
    <div class="pb pb-preview {previewStyle}">
      <iframe bind:this={iframeEl} />
    </div>
    <div class="pb-preview container" bind:this={container}>
      {#if mouseYCoordinate}
        <div class="item ghost" style="top: {mouseYCoordinate + distanceTopGrabbedVsPointer}px;">
          <div class="box">
            <p>{draggingItem.selector}</p>
            <div class="box">
              <Button variant="icon" active={previewStyle === 'tablet'}>
                <span class="material-symbols-outlined"> edit </span>
              </Button>
              <Button variant="icon" active={previewStyle === 'tablet'}>
                <span class="material-symbols-outlined"> delete_forever </span>
              </Button>
            </div>
          </div>
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
          <div class="box">
            <p>{item.selector}</p>
            <div class="box">
              <Button
                variant="icon"
                on:click={() => openEdit(index, item)}
                active={previewStyle === 'tablet'}
              >
                <span class="material-symbols-outlined"> edit </span>
              </Button>
              <Button
                variant="icon"
                on:click={() => removeComponent(index)}
                active={previewStyle === 'tablet'}
              >
                <span class="material-symbols-outlined"> delete_forever </span>
              </Button>
            </div>
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

<Modal bind:showModal on:saveEvent={save} on:reverse={reverseValue}>
  <h2 slot="header">Edit Modal</h2>
  {#if value?.[editing]?.slots}
    {#each value[editing].slots as slot}
      <textarea bind:value={slot.value} />
    {/each}
  {/if}
  {#if value?.[editing]?.attributes}
    <div bind:this={attributesContainer} />
  {/if}
</Modal>

<style>
  .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
  }

  .pb {
    border: 1px solid #ccc;
    position: relative;
  }

  .pb-grid {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }

  .pb-header {
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

  .box {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
  }
</style>
