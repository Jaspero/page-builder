import type {ModularView} from '@jaspero/modular';
import type {PageBuilderComponentSlot} from './page-builder-component-slot.interface.ts';

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
}