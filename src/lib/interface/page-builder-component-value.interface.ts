export interface PageBuilderComponentValue {
	selector: string;
	slots?: Array<{name?: string; value: string}>;
	attributes?: any;
}