<script lang="ts">
  import { onMount } from 'svelte';
  import '../../../dist/lib/page-builder.wc.js';
  import '../../../dist/lib/bla.wc.js';
  import type { PageBuilderOptions } from '$lib/types/page-builder-options.interface.ts';
  import type { PageBuilderComponentValue } from '$lib/types/page-builder-component-value.interface.ts';
  // import { PageBuilderComponentSlotType } from '$lib/types/page-builder-component-slot.interface.ts';
  import { registerComponent } from '@jaspero/modular';
  import '@jaspero/web-components/dist/input.wc';
  import '@jaspero/web-components/dist/code-editor.wc';
  import '@jaspero/web-components/dist/button.wc';
  import '@jaspero/web-components/dist/multiselect.wc';
  import '@jaspero/web-components/dist/checkbox.wc';
  import '@jaspero/web-components/dist/textarea.wc';
  import '@jaspero/web-components/dist/select.wc';
  import '@jaspero/web-components/dist/radio.wc';
  import '@jaspero/web-components/dist/quill.wc';
  import '@jaspero/web-components/dist/json-editor.wc';
  import '@jaspero/web-components/dist/progress-spinner.wc';
  import '@jaspero/web-components/dist/paginator.wc';
  import '@jaspero/web-components/dist/link.wc';
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

  let el: HTMLDivElement;

  const options: PageBuilderOptions = {
    components: [
      {
        selector: `example-content`,
        slots: [
          {
            type: 'inline-editor'
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
                  component: 'modular-carbon-input',
                  options: {
                    label: 'Color'
                  }
                },
                {
                  field: '/background-color',
                  component: 'modular-carbon-textarea',
                  options: {
                    label: 'Background Color'
                  }
                },
                {
                  field: '/padding',
                  component: 'modular-carbon-input',
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
            type: 'inline-editor'
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
                  component: 'modular-carbon-input',
                  options: {
                    label: 'Color'
                  }
                },
                {
                  field: '/background-color',
                  component: 'modular-carbon-textarea',
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
      },
      {
        selector: `image-test`,
        slots: [
          {
            type: 'image'
          }
        ],
        attributes: {
          schema: {
            properties: {
              color: { type: 'string' },
              margin: { type: 'string' },
              padding: { type: 'string' },
              'font-weight': { type: 'number' },
              'background-color': { type: 'string' },
            }
          },
          views: [
            {
              justify: 'center',
              container: 'form',
              items: [
                {
                  field: '/color',
                  component: 'jp-input'
                },
                {
                  field: '/margin',
                  component: 'jp-select',
                  options: {
                    label: 'testLabel',
                    name: 'margin',
                    options: [{
                      label: 'XS',
                      value: '10px'
                    },
                      {
                        label: 'M',
                        value: '20px'
                      },
                      {
                        label: 'LX',
                        value: '100px'
                      },]
                  }
                },
                {
                  field: '/font-weight',
                  component: 'jp-radio',
                  options: {
                    options: [{"name": "aaa", "value": 100}, {"name": "bbb", "value": 200}, {"name": "ccc", "value": 300}],
                    name: 'font-weight',
                  }
                },
                {
                  field: '/date',
                  component: 'modular-carbon-datepicker',
                  options: {
                    label: 'Date',
                  }
                },
                {
                  field: '/background-color',
                  component: 'modular-carbon-textarea',
                  options: {
                    label: 'Background Color'
                  }
                },
                // {
                //   field: '/display',
                //   component: 'jp-checkbox',
                //   options: [{"label": "aaa", "value": false}]
                // },
              ]
            }
          ]
        },
        defaultValue: {
          slots: [{ value: 'This is new component' }],
          attributes: {
            color: 'black',
            'background-color': '#12edba',
            'margin': '10px',
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
    const instanceEl = document.createElement('jp-page-builder');
    const { CarbonInput } = await import(
      '@jaspero/modular-components/dist/components/carbon-input'
      );
    const { CarbonTextarea } = await import(
      '@jaspero/modular-components/dist/components/carbon-textarea'
      );
    const { CarbonSelect } = await import(
      '@jaspero/modular-components/dist/components/carbon-select'
      );
    const { CarbonTabs } = await import(
      '@jaspero/modular-components/dist/components/carbon-tabs'
      );
    const { CarbonAccordion } = await import(
      '@jaspero/modular-components/dist/components/carbon-accordion'
      );
    const { CarbonRadio } = await import(
      '@jaspero/modular-components/dist/components/carbon-radio'
      );
    const { CarbonSlider } = await import(
      '@jaspero/modular-components/dist/components/carbon-slider'
      );
    const { CarbonChart } = await import(
      '@jaspero/modular-components/dist/components/carbon-chart'
      );
    const { CarbonDatepicker } = await import(
      '@jaspero/modular-components/dist/components/carbon-datepicker'
      );
    const { CarbonTable } = await import(
      '@jaspero/modular-components/dist/components/carbon-table'
      );
    const { CarbonCheckbox } = await import(
      '@jaspero/modular-components/dist/components/carbon-checkbox'
      );

    // @ts-ignore
    instanceEl.options = options;
    // @ts-ignore
    instanceEl.value = value;

    registerComponent('carbon-input', CarbonInput);
    registerComponent('carbon-textarea', CarbonTextarea);
    registerComponent('carbon-accordion', CarbonAccordion);
    registerComponent('carbon-tabs', CarbonTabs);
    registerComponent('carbon-select', CarbonSelect);
    registerComponent('carbon-radio', CarbonRadio);
    registerComponent('carbon-slider', CarbonSlider);
    registerComponent('carbon-chart', CarbonChart);
    registerComponent('carbon-table', CarbonTable);
    registerComponent('carbon-checkbox', CarbonCheckbox);
    // registerComponent('carbon-toggle', CarbonToggle);
    registerComponent('carbon-datepicker', CarbonDatepicker);
    el.appendChild(instanceEl);
  });
</script>

<div bind:this={el} />
