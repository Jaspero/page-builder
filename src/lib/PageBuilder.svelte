<svelte:options customElement="jp-page-builder" />

<script lang="ts">
  import Block from '$lib/Block.svelte';
  import { onMount } from 'svelte';
  import type { PageBuilderOptions } from './interface/page-builder-options.interface.ts';
  import type { PageBuilderComponent } from './interface/page-builder-component.interface.ts';
  import type { PageBuilderComponentValue } from './interface/page-builder-component-value.interface.ts';
  import { iframeEl as iframeElStore } from './context-menu.ts';
  import Button from './Button.svelte';
  import Modal from './Modal.svelte';
  import { ModularSchema, ModularView } from '@jaspero/modular';

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
    selector: string;
    value: PageBuilderComponentValue;
  }> = [];

  let draggingItemHide = null;
  let mouseYCoordinate = null;
  let distanceTopGrabbedVsPointer = null;

  let draggingItem = null;
  let draggingItemIndex = null;
  let editing: null | number = null;
  let selectedItem = null;
  let container: HTMLDivElement | null = null;
  let hoveredItemIndex = null;
  let showModal = false;
  let attributesContainer: HTMLDivElement;
  let render = null;

  $: if (
          draggingItemIndex != null &&
          hoveredItemIndex != null &&
          draggingItemIndex != hoveredItemIndex
  ) {
    [renderedComponents[draggingItemIndex], renderedComponents[hoveredItemIndex]] = [
      renderedComponents[hoveredItemIndex],
      renderedComponents[draggingItemIndex]
    ];
    draggingItemIndex = hoveredItemIndex;
    refreshIframe();
  }

  $: if (attributesContainer) {
    const {selector} = renderedComponents[editing!];
    const component = componentMap[selector];
    const schema = new ModularSchema(component.attributes!.schema);
    const instance = schema.createInstance(selectedItem.value.attributes);
    const view = new ModularView({
      schema,
      views: component.attributes!.views
    });
    render = view.render({
      parentElement: attributesContainer,
      instance,
    });
  }

  onMount(() => {
    if (window) {
      document.addEventListener('dragover', function(e) {e.preventDefault()})
    }
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
    render.getValue().then(res => {
      if (res) {
        renderedComponents[editing!].value.attributes = res;
        refreshIframe();
      }
    })
  }

  export function reverseValue() {
    renderedComponents[editing!].value = JSON.parse(JSON.stringify(selectedItem!.value));
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
      updateValue();
      value.forEach((v: PageBuilderComponentValue) => addComponent(componentMap[v.selector], v, false));
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
        selector: component.selector,
        value: value || {
          selector: component.selector
        }
      });
      updateValue();
    }
  }

  function selectComponent(selector: string) {
    const component = componentMap[selector];
    addComponent(component, { ...(component.defaultValue || {}), selector });
    componentGallery = false;
  }

  function removeComponent(index: number) {
    renderedComponents.splice(index, 1);
    refreshIframe();
  }

  function openEdit(ind: number, item: PageBuilderComponent) {
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
    <div class="flex gap-2">
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
          <div class="flex justify-between items-center">
            <p>{draggingItem.selector}</p>
            <div class="flex gap-2">
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

      {#each renderedComponents as item, index (item)}
        <div
                class="item z-50 {draggingItemHide === item ? 'opacity-0' : 'opacity-100'}"
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
            mouseYCoordinate = null;
            draggingItemHide = null;
            hoveredItemIndex = null;
          }}
        >
          <div class="flex justify-between items-center">
            <p>{item.selector}</p>
            <div class="flex items-center gap-2">
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
  <svelte:fragment slot="header">Edit Modal</svelte:fragment>
  {#if value?.[editing]?.slots}
    {#each value[editing].slots as slot}
      <div style="padding: .5rem 1rem">
        <textarea bind:value={slot.value} />
      </div>
    {/each}
  {/if}
  {#if value?.[editing]?.attributes}
    <div bind:this={attributesContainer} style="padding: .5rem" />
  {/if}
</Modal>

<style lang="postcss">
  .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
  }

  .pb {
    @apply relative border
  }

  .pb-grid {
    @apply flex gap-2
  }

  .pb-header {
    @apply flex justify-between p-4
  }

  .pb-preview.desktop,
  .pb-preview.tablet,
  .pb-preview.mobile {
    @apply flex-1
  }

  .pb-preview.container {
    @apply relative max-w-[400px] flex flex-col gap-2 p-2
  }

  iframe {
    @apply block w-full h-full
  }

  .component-gallery {
    @apply z-50 absolute top-0 left-0 w-full h-full border-b bg-white
  }

  .item {
    @apply w-full bg-white p-2 border border-black cursor-grab max-w-[calc(400px-1rem)] select-none
  }

  .ghost {
    @apply z-10 absolute
  }

  .invisible {
    @apply opacity-0
  }

  .box {
    @apply flex justify-between flex-row
  }
</style>
