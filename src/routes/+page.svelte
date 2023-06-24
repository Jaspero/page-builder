<script lang="ts">
  import PageBuilder from '$lib/PageBuilder.svelte';
  import type { PageBuilderOptions } from '$lib/interface/page-builder-options.interface.ts';
  import { PageBuilderComponentSlotType } from '$lib/interface/page-builder-component-slot.interface.ts';
  import type { PageBuilderComponentValue } from '../lib/interface/page-builder-component-value.interface.ts';

  const options: PageBuilderOptions = {
    components: [
      {
        selector: `example-content`,
        slots: [
          {
            type: PageBuilderComponentSlotType.InlineEditor
          }
        ],
        defaultValue: {
          slots: [{ value: 'This is default' }],
          attributes: {
            theme: 'blup'
          }
        }
      }
    ]
  };

  let value: PageBuilderComponentValue[] = [
    {
      selector: 'example-content',
      attributes: {
        theme: 'simple'
      },
      slots: [{ value: 'Cooly' }]
    }
  ];

	$: console.log('Value changes', value);
</script>

<PageBuilder {options} bind:value={value} />
