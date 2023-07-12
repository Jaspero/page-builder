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
            color: 'blue',
            'background-color': '#e4ed12'
          }
        }
      },
      {
        selector: `another-component`,
        slots: [
          {
            type: PageBuilderComponentSlotType.InlineEditor
          }
        ],
        defaultValue: {
          slots: [{ value: 'This is new component' }],
          attributes: {
            color: 'red',
            'background-color': '#e4ed12'
          }
        }
      }
    ]
  };

  let value: PageBuilderComponentValue[] = [
    {
      selector: 'example-content',
      attributes: {
        color: 'red',
        'background-color': '#74781c'
      },
      slots: [{ value: 'Cooly' }]
    }
  ];
</script>

<PageBuilder {options} bind:value />
