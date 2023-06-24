<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageBuilderOptions } from './interface/page-builder-options.interface';
  import type { PageBuilderComponent } from './interface/page-builder-component.interface';
  import type { PageBuilderComponentValue } from './interface/page-builder-component-value.interface.ts';

  export let options: PageBuilderOptions;

  let componentGallery = false;
	let componentMap: {
		[selector: string]: PageBuilderComponent;
	};
	let previewStyle = 'desktop';
  let iframeEl: HTMLIFrameElement;
	let iframeDoc: Document;

	const renderedComponents = [];

  onMount(() => {

		componentMap = options.components.reduce((acc: { [selector: string]: PageBuilderComponent }, cur: PageBuilderComponent) => {
			acc[cur.selector] = cur;
			return acc;
		}, {});

		iframeDoc = (iframeEl.contentDocument || iframeEl.contentWindow) as Document;

		if (options.value) {
			options.value.forEach((value: PageBuilderComponentValue) =>
				addComponent(componentMap[value.selector], value)
			);
		}
	});

	function addComponent(component: PageBuilderComponent, value?: PageBuilderComponentValue) {
		console.log(component);
		const el = document.createElement(component.selector);

		if (value) {
			if (value.attributes) {
				for (const key in value.attributes) {
					el.setAttribute(key, value.attributes[key]);
				}
			}

			if (value.slots) {
				value.slots.forEach(slot => 
					el.innerHTML += `<div ${slot.name ? `slot="${slot.name}"` : ''}>${slot.value}</div>`
				)
			}
		}

		renderedComponents.push(el);

		iframeDoc.body.appendChild(el);
	}
</script>

<div class="pb">

	<header class="pb-header">
		<button on:click={() => previewStyle = 'desktop'} class:active={previewStyle === 'desktop'}>Desktop</button>
		<button on:click={() => previewStyle = 'tablet'} class:active={previewStyle === 'tablet'}>Tablet</button>
		<button on:click={() => previewStyle = 'mobile'} class:active={previewStyle === 'mobile'}>Mobile</button>
	</header>

  <div class="pb-preview {previewStyle}">
    <iframe bind:this={iframeEl} />
  </div>

  {#if componentGallery}
    <div class="component-gallery">
      <button on:click={() => (componentGallery = false)}>Close</button>

      {#each options.components as component}
        <div class="component-gallery-item">
          <h3>{component.title || component.selector}</h3>
          {#if component.description}
            <p>{component.description}</p>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>

	.pb {
		border: 1px solid #ccc;
	}

	.pb-header {
		border-bottom: 1px solid #ccc;
	}

  iframe {
    width: 100%;
    display: block;
    border: none;
    height: 100%;
  }
</style>
