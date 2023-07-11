import type { ModularView } from '@jaspero/modular';
import type { PageBuilderComponentSlot } from './page-builder-component-slot.interface.ts';
import type { PageBuilderComponentValue } from './page-builder-component-value.interface.ts';

export interface PageBuilderComponent {
  selector: string;
  attributes?: ModularView;
  slots?: PageBuilderComponentSlot[];

  /**
   * Used for representation in the
   * component glossery
   */
  title?: string;
  description?: string;

  defaultValue?: {
    slots?: Array<{ name?: string; value: string }>;
    attributes?: any;
  };
}
