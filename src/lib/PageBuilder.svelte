<svelte:options customElement="jp-page-builder" />

<script lang="ts">
    import Block from '$lib/Block.svelte';
    import Button from '$lib/Button.svelte';
    import { onMount } from 'svelte';
    import type { PageBuilderOptions } from './interface/page-builder-options.interface.ts';
    import type { PageBuilderComponent } from './interface/page-builder-component.interface.ts';
    import type { PageBuilderComponentValue } from './interface/page-builder-component-value.interface.ts';
    import { fly } from 'svelte/transition';
    import { iframeEl as iframeElStore } from './context-menu.ts';

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

<header>
    <nav>
        <div class="change-view">
            <Button variant="icon" on:click={() => (previewStyle = 'desktop')} active={previewStyle === 'desktop'}>
            <span class="material-symbols-outlined">
            laptop_mac
            </span>
            </Button>

            <Button variant="icon" on:click={() => (previewStyle = 'tablet')} active={previewStyle === 'tablet'}>
            <span class="material-symbols-outlined">
            tablet
            </span>
            </Button>

            <Button variant="icon" on:click={() => (previewStyle = 'mobile')} active={previewStyle === 'mobile'}>
            <span class="material-symbols-outlined">
            smartphone
            </span>
            </Button>
        </div>

        <Button on:click={() => (componentGallery = true)}>
            <slot slot="prefix">
            <span class="material-symbols-outlined">
            add
            </span>
            </slot>
            Add Component
        </Button>
    </nav>
</header>

<main>
    <div class="preview {previewStyle}">
        <iframe title="Preview" bind:this={iframeEl} />
    </div>

    <div class="components" bind:this={container}>
        {#if mouseYCoordinate}
            <div class="item ghost" style="top: {mouseYCoordinate - distanceTopGrabbedVsPointer}px;">
                <div class="item-content">
                    {draggingItem.selector}
                </div>
            </div>
        {/if}

        {#each value as item, index (item)}
            <div
                    class="item {draggingItemHide === item ? 'invisible' : ''}"
                    draggable="true"
                    role="listitem"
                    on:dragstart={(e) => {
            mouseYCoordinate = e.clientY;
            draggingItem = item;
            draggingItemIndex = index;
            draggingItemHide = item;
            distanceTopGrabbedVsPointer = e.target.getBoundingClientRect().y - e.clientY + 44;
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
          }}>
                <div class="item-content">
                    {item.selector}
                </div>
                <Button variant="filled" color="primary" on:click={() => removeComponent(index)}>
                    Delete
                </Button>
            </div>
        {/each}
    </div>

    {#if componentGallery}
        <div class="overlay" tabindex="-1"></div>
        <div class="component-gallery"
             in:fly={{ x: 200, duration: 500 }}
             out:fly={{ x: 200, duration: 500 }}
        >
            <header class="dark">
                <Button on:click={() => (componentGallery = false)}>Close</Button>
            </header>

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
</main>

<style>
    main {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: calc(100vh - 4rem);
    }

    header {
        display: flex;
        align-items: center;
        height: 4rem;
        border-bottom: 1px solid rgba(0,0,0,.16);
    }

    header.dark {
        border-bottom: 1px solid rgba(255,255,255,.2);
    }

    nav {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 0 1rem;
        gap: 1rem;
    }

    .change-view {
        display: flex;
        gap: 1rem;
    }

    .components {
        width: 20rem;
        border-left: 1px solid rgba(0,0,0,.16);
        padding: 1rem;
    }

    iframe {
        width: 100%;
        display: block;
        border: none;
        height: 100%;
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.32);
    }

    .component-gallery {
        position: absolute;
        top: 0;
        right: 0;
        width: 20rem;
        height: 100%;
        background-color: black;
    }

    .item {
        display: flex;
        align-items: center;
        width: 100%;
        background: black;
        color: white;
        font-size: .875rem;
        margin-bottom: 10px;
        cursor: grab;
    }

    .item-content {
        flex: 1 1 0;
        padding: 0 .875rem;
        height: 2.5rem;
        line-height: 2.5rem;
    }

    .ghost {
        pointer-events: none;
        z-index: 99;
        position: absolute;
        width: 18rem;
    }

    .invisible {
        opacity: 0;
    }
</style>
