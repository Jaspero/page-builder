<script lang="ts">
	import { contextMenu, iframeEl } from './context-menu.ts';

	export let showMenu = false;
	let top: string;
	let left: string;
	let ctxEl: HTMLElement;

	$: if ($contextMenu) {
		const { clientX, clientY } = $contextMenu.event;
		top = `${clientY + ($iframeEl?.getBoundingClientRect().y || 0)}px`;
		left = `${clientX}px`;

		if ($iframeEl) {
			const iframeDoc = ($iframeEl.contentDocument || $iframeEl.contentWindow) as Document;
			iframeDoc.addEventListener('click', close);
			iframeDoc.addEventListener('contextmenu', close);
		}
	} else {
		showMenu = false
	}

	function close() {
		contextMenu.set(null);
		showMenu = false
	}

	function resolveClick(callback) {
		callback();
		close()
	}
</script>

{#if (showMenu && $contextMenu)}
	<div class="context-menu" bind:this={ctxEl} style:top={top} style:left={left}>
		{#each $contextMenu.items as item}
			<button style:color={item.color} on:click={() => resolveClick(item.callback)}>
				{item.label}sss
			</button>
		{/each}
	</div>
{/if}

<style lang="scss">
	.context-menu {
		position: fixed;
		border-radius: 6px;
		background-color: #212121;
		width: 150px;
		min-height: 100px;
	}

	.context-menu button {
		display: block;
		color: white;
		width: 100%;
		padding: 5px 10px;
		border: none;
		background: none;
		text-align: left;
		cursor: pointer;
	}

	.context-menu button:hover {
		background-color: #545454;
	}
</style>
