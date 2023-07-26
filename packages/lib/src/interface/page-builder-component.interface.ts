import type { JSONSchema } from '@jaspero/modular';
import type { PageBuilderComponentSlot } from './page-builder-component-slot.interface.ts';

export interface PageBuilderComponent {
  selector: string;
  attributes?: {
    schema: JSONSchema;
    views: any[];
  };
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
