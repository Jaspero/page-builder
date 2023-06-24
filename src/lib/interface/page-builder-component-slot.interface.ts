export enum PageBuilderComponentSlotType {
  InlineEditor = 'inline-editor',
  Image = 'image'
}

export interface PageBuilderComponentSlot {
  type: PageBuilderComponentSlotType;
  /**
   * Can be empty if it's not a named slot
   */
  slot?: string;
}
