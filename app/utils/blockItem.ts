import type { ComputedRef, InjectionKey } from 'vue'
import type { BioBlock } from '~/types/bio'

/** What a block's header can do to the block, provided by BioBlockItem */
export interface BlockItemActions {
  block: ComputedRef<BioBlock>
  canMoveUp: ComputedRef<boolean>
  canMoveDown: ComputedRef<boolean>
  moveUp: () => void
  moveDown: () => void
  duplicate: () => void
  remove: () => void
  toggleHidden: () => void
  addBelow: () => void
}

export const BLOCK_ITEM_KEY: InjectionKey<BlockItemActions> = Symbol('blockItem')
