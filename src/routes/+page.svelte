<script lang="ts">
	import PageBuilder from '$lib/PageBuilder.svelte';
  import type { PageBuilderOptions } from '$lib/interface/page-builder-options.interface.ts';
  import { PageBuilderComponentSlotType } from '$lib/interface/page-builder-component-slot.interface.ts';

	const options: PageBuilderOptions = {
		components: [
			{
				selector: `example-content`,
				slots: [{
					type: PageBuilderComponentSlotType.InlineEditor
				}]
			}
		],
		value: [
			{
				selector: 'example-content',
				attributes: {
					theme: 'simple'
				},
				slots: [{value: 'Cooly'}]
			}
		]
	};
</script>

<PageBuilder {options} />