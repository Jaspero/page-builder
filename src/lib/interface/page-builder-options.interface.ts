import type {PageBuilderComponentValue} from './page-builder-component-value.interface.ts';
import type {PageBuilderComponent} from './page-builder-component.interface.ts';

export interface PageBuilderOptions {
	components: PageBuilderComponent[];
	value?: PageBuilderComponentValue[];
}