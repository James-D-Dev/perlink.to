import type { Ref } from 'vue'

/**
 * For a sheet that shows a value (a product, a message): `open` follows the
 * value and clears it when the sheet is closed; `shown` keeps the last value
 * so the sheet doesn't go blank while it slides away.
 */
export function useSheetValue<T>(source: Ref<T | null>) {
  const shown = shallowRef(source.value) as Ref<T | null>
  watch(source, (value) => {
    if (value) shown.value = value
  })
  const open = computed({
    get: () => !!source.value,
    set: (value: boolean) => {
      if (!value) source.value = null
    },
  })
  return { open, shown }
}
