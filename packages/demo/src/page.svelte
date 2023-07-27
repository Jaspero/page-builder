<script lang="ts">
  import PageBuilder from '$lib/PageBuilder.svelte';
  import type { PageBuilderOptions } from '$lib/types/page-builder-options.interface.ts';
  import { PageBuilderComponentSlotType } from '$lib/types/page-builder-component-slot.interface.ts';
  import type { PageBuilderComponentValue } from '../lib/types/page-builder-component-value.interface.ts';
  import { registerComponent } from '@jaspero/modular';
  import { onMount } from 'svelte';
  // import { CarbonTabs } from '@jaspero/modular-components/dist/components/carbon-tabs';
  // import { CarbonAccordion } from '@jaspero/modular-components/dist/components/carbon-accordion';
  // import { CarbonButton } from '@jaspero/modular-components/dist/components/carbon-button';
  // import { CarbonCheckbox } from '@jaspero/modular-components/dist/components/carbon-checkbox';
  // import { CarbonDatepicker } from '@jaspero/modular-components/dist/components/carbon-datepicker';
  // import { CarbonInput } from '@jaspero/modular-components/dist/components/carbon-input';
  // import { CarbonObjectArray } from '@jaspero/modular-components/dist/components/carbon-object-array';
  // import { CarbonRadio } from '@jaspero/modular-components/dist/components/carbon-radio';
  // import { CarbonSelect } from '@jaspero/modular-components/dist/components/carbon-select';
  // import { CarbonSlider } from '@jaspero/modular-components/dist/components/carbon-slider';
  // import { CarbonSubmit } from '@jaspero/modular-components/dist/components/carbon-submit';
  // import { CarbonTable } from '@jaspero/modular-components/dist/components/carbon-table';
  // import { CarbonTextarea } from '@jaspero/modular-components/dist/components/carbon-textarea';
  // import { CarbonToggle } from '@jaspero/modular-components/dist/components/carbon-toggle';
  // import { TabViews } from '@jaspero/modular-components/dist/components/tab-views';
  // import {
  //   CarbonContentswitcher
  // } from '@jaspero/modular-components/dist/components/carbon-contentswitcher';

  export const options: PageBuilderOptions = {
    components: [
      {
        selector: `example-content`,
        slots: [
          {
            type: PageBuilderComponentSlotType.InlineEditor
          }
        ],
        attributes: {
          schema: {
            properties: {
              color: { type: 'string' },
              'background-color': { type: 'string' }
            }
          },
          views: [
            {
              justify: 'center',
              container: 'form',
              items: [
                {
                  field: '/color',
                  component: 'carbon-input',
                  options: {
                    label: 'Color'
                  }
                },
                {
                  field: '/background-color',
                  component: 'carbon-textarea',
                  options: {
                    label: 'Background Color'
                  }
                },
                {
                  field: '/padding',
                  component: 'carbon-input',
                  options: {
                    label: 'Padding'
                  }
                }
              ]
            }
          ]
        },
        defaultValue: {
          slots: [{ value: 'This is default' }],
          attributes: {
            color: 'white',
            'background-color': '#1257ed'
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
        attributes: {
          schema: {
            properties: {
              color: { type: 'string' },
              'background-color': { type: 'string' }
            }
          },
          views: [
            {
              justify: 'center',
              container: 'form',
              items: [
                {
                  field: '/color',
                  component: 'carbon-input',
                  options: {
                    label: 'Color'
                  }
                },
                {
                  field: '/background-color',
                  component: 'carbon-textarea',
                  options: {
                    label: 'Background Color'
                  }
                }
              ]
            }
          ]
        },
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
        'background-color': '#74781c',
        padding: '50px'
      },
      slots: [{ value: 'Cooly' }]
    }
  ];

  onMount(async () => {
    const { CarbonInput } = await import(
      '@jaspero/modular-components/dist/components/carbon-input'
    );
    const { CarbonTextarea } = await import(
      '@jaspero/modular-components/dist/components/carbon-textarea'
    );

    registerComponent('carbon-input', CarbonInput);
    registerComponent('carbon-textarea', CarbonTextarea);
    // registerComponent('carbon-submit', CarbonSubmit);
    // registerComponent('carbon-button', CarbonButton);
    // registerComponent('carbon-accordion', CarbonAccordion);
    // registerComponent('carbon-tabs', CarbonTabs);
    // registerComponent('carbon-select', CarbonSelect);
    // registerComponent('carbon-radio', CarbonRadio);
    // registerComponent('carbon-slider', CarbonSlider);
    // registerComponent('carbon-table', CarbonTable);
    // registerComponent('carbon-checkbox', CarbonCheckbox);
    // registerComponent('carbon-toggle', CarbonToggle);
    // registerComponent('carbon-datepicker', CarbonDatepicker);
    // registerComponent('carbon-object-array', CarbonObjectArray)
    // registerComponent('tab-views', TabViews)
    // registerComponent('carbon-contentswitcher', CarbonContentswitcher)
  });
</script>

<PageBuilder {options} bind:value />
