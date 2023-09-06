<svelte:options
        customElement={{
    tag: 'jp-page-builder',
    shadow: 'none'
  }}
/>

<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageBuilderOptions } from './types/page-builder-options.interface.ts';
  import type { PageBuilderComponent } from './types/page-builder-component.interface.ts';
  import type { PageBuilderComponentValue } from './types/page-builder-component-value.interface.ts';
  import { iframeEl as iframeElStore } from './context-menu.ts';
  import Button from './Button.svelte';
  import Block from './Block.svelte';
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
    hidden?: boolean;
    value: PageBuilderComponentValue;
  }> = [];

  let draggingItemHide = null;
  let distanceTopGrabbedVsPointer = null;

  let draggingItem = null;
  let draggingItemIndex = null;
  let editing: null | number = null;
  let selectedItem = null;
  let container: HTMLDivElement | null;
  let hoveredItemIndex = null;
  let showModal = false;
  let showConfirmModal = false;
  let editingIndex = null;
  let attributesContainer: HTMLDivElement | null;
  let textSlots = null;
  let render = null;
  let reRenderTIme = null;

  const testVal = [{"label": "test", "value": false}];
  const testVal2 = [{"label": "label1", "selected": false},{"label": "label2", "selected": true},{"label": "label3", "selected": true},{"label": "label4", "selected": false, "disabled": true},{"label": "label5", "selected": false}];
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
    if (!reRenderTIme) {
      refreshIframe();
    }
  }

  $: if (attributesContainer && !render) {
    const { selector } = renderedComponents[editing!];
    const component = componentMap[selector];
    const schema = new ModularSchema(component.attributes!.schema);
    const instance = schema.createInstance(selectedItem.value.attributes);
    console.log('component.attributes', component.attributes.views);
    const view = new ModularView({
      componentPrefix: '',
      schema,
      views: component.attributes!.views
    });
    render = view.render({
      parentElement: attributesContainer,
      instance
    });
  }

  onMount(() => {
    if (window) {
      document.addEventListener('dragover', function (e) {
        e.preventDefault();
      });
    }
    if (options) {
      componentMap = options.components.reduce(
              (acc: { [selector: string]: PageBuilderComponent }, cur: PageBuilderComponent) => {
                acc[cur.selector] = cur;
                return acc;
              },
              {}
      );
    }
    iframeElStore.set(iframeEl);
    iframeDoc = (iframeEl.contentDocument || iframeEl.contentWindow) as Document;

    if (value) {
      value.forEach((v: PageBuilderComponentValue) => addComponent(componentMap[v.selector], v));
    }
  });

  export function save() {
    render.getValue().then((res) => {
      console.log('res', res);
      if (res) {
        renderedComponents[editing!].value.attributes = res;
        renderedComponents[editing!].value.slots = textSlots;
        textSlots = null;
        refreshIframe();
      }
      render = null;
      attributesContainer = null;
      showModal = false;
    });
  }

  export function reverseValue() {
    if (selectedItem) {
      renderedComponents[editing!].value = JSON.parse(JSON.stringify(selectedItem!.value));
    }
    render = null;
    attributesContainer = null;
    showModal = false;
    componentGallery = false;
  }

  function formatStyle(styles) {
    return Object.entries(styles)
            .map(([key, value]) => `${key}:${value}`)
            .join(';');
  }

  function refreshIframe() {
    iframeEl.contentWindow!.location.reload();
    reRenderTIme = setTimeout(() => {
      iframeDoc = (iframeEl.contentDocument || iframeEl.contentWindow) as Document;
      updateValue();
      value.forEach((v: PageBuilderComponentValue) =>
              addComponent(componentMap[v.selector], v, false)
      );
      reRenderTIme = null;
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

  function removeComponent() {
    renderedComponents.splice(editingIndex, 1);
    refreshIframe();
    showConfirmModal = false;
    editingIndex = null;
  }

  function openConfirmationModal(index: number) {
    showConfirmModal = true;
    editingIndex = index;
  }

  function hideComponent(index: number) {
    renderedComponents[index].hidden = !renderedComponents[index].hidden;
    refreshIframe();
  }

  function openEdit(ind: number, item) {
    editing = ind;
    selectedItem = item;
    textSlots = JSON.parse(JSON.stringify(item.value.slots));
    showModal = true;
  }

  function updateValue() {
    value = renderedComponents.reduce((acc, cur) => {
      if (!cur?.hidden) {
        acc.push(cur.value)
      }
      return acc
    }, [])
    renderedComponents = [...renderedComponents];
  }

  function handleClick(e) {
    if (showModal && e.keyCode === 13 && !e.shiftKey) {
      save()
    }
  }
</script>

<div>
  <header class="pb-header">
    <div class="flex gap-2">
      <Button
              variant="icon"
              on:click={() => (previewStyle = 'fullscreen')}
              active={previewStyle === 'fullscreen'}
      >
        <span class="material-symbols-outlined"> fullscreen </span>
      </Button>
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
      <iframe title="frame" bind:this={iframeEl} />
    </div>
    <div class="pb-preview container" bind:this={container}>
      {#each renderedComponents as item, index (item)}
        <div
                class="item z-50 {draggingItemHide === item ? 'opacity-0' : 'opacity-100'}"
                draggable="true"
                aria-hidden="true"
                on:dragstart={(e) => {
            draggingItem = item;
            draggingItemIndex = index;
            draggingItemHide = item;
            distanceTopGrabbedVsPointer = e.target.getBoundingClientRect().y - e.clientY;
          }}
                on:dragover={(e) => {
            hoveredItemIndex = index;
          }}
                on:dragend={(e) => {
            draggingItemHide = null;
            hoveredItemIndex = null;
          }}
        >
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
                    on:click={() => hideComponent(index)}
                    active={previewStyle === 'tablet'}
            >
              {#if item.hidden}
                <span class="material-symbols-outlined"> visibility_off </span>
              {:else if !item.hidden}
                <span class="material-symbols-outlined"> visibility </span>
              {:else}
              {/if}
            </Button>
            <Button
                    variant="icon"
                    on:click={() => openConfirmationModal(index)}
                    active={previewStyle === 'tablet'}
            >
              <span class="material-symbols-outlined"> delete_forever </span>
            </Button>
          </div>
        </div>
      {/each}
    </div>
  </div>

</div>

<div on:keydown={handleClick}>

  {#if showModal}
    <Modal bind:showModal={showModal} on:reverse={reverseValue}>
      <div class="flex jc-end w-full">
        <p>Edit Modal</p>
        <Button variant="stroked" on:click={() => reverseValue()}><span class="material-symbols-outlined">close</span></Button>
      </div>
      {#if textSlots}
        {#each textSlots as slot}
          <div style="padding: .5rem 1rem">
            <textarea bind:value={slot.value}/>
          </div>
        {/each}
      {/if}
      <div bind:this={attributesContainer} style="padding: .5rem" />
      <div class="flex flex-wrap gap-4 p-4 border-t border-t-black/25">
        <Button variant="filled" on:click={save}>Save</Button>
      </div>
    </Modal>
  {/if}

  {#if showConfirmModal}
    <Modal bind:showModal={showConfirmModal}>
      <div class="flex flex-wrap gap-4 p-4 border-t border-t-black/25">
        <p>Are you sure?</p>
        <Button variant="stroked" on:click={() => showConfirmModal = false}>No</Button>
        <Button variant="filled" on:click={removeComponent}>Yes</Button>
      </div>
    </Modal>
  {/if}


</div>
{#if componentGallery}
  <Modal bind:showModal={componentGallery} on:reverse={reverseValue}>
    <div class="flex jc-end w-full">
      <Button on:click={() => (componentGallery = false)}>
        <span class="material-symbols-outlined">close</span>
      </Button>
    </div>
    {#each options.components as component}
      <div>
        <Button on:click={() => selectComponent(component.selector)}>
          <h3>{component.title || component.selector}</h3>
          {#if component.description}
            <p>{component.description}</p>
          {/if}
        </Button>
      </div>
    {/each}
  </Modal>
{/if}

<style lang="postcss">
  .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
  }

  .pb {
    @apply relative border;
  }

  .pb-grid {
    @apply flex gap-2;
  }

  .pb-header {
    @apply flex justify-between p-4;
  }

  .pb-preview.desktop,
  .pb-preview.tablet,
  .pb-preview.mobile {
    @apply flex-1;
  }

  .pb-preview.container {
    @apply relative max-w-[400px] flex flex-col gap-2 p-2;
  }

  iframe {
    @apply block w-full h-full;
  }

  .component-gallery {
    @apply z-50 absolute top-0 left-0 w-full h-full border-b bg-white;
  }

  .item {
    @apply w-full bg-white p-2 border border-black cursor-grab max-w-[calc(400px-1rem)] select-none;
  }

  .ghost {
    @apply z-10 absolute;
  }

  .invisible {
    @apply opacity-0;
  }

  .box {
    @apply flex justify-between flex-row;
  }
</style>
