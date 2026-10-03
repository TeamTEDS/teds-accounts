"use client"

import { useRef } from "react"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

export function EmailUsageCombobox({
  uses,
  value,
  onValueChange,
  onBlur,
  "aria-invalid": ariaInvalid,
}: {
  uses: readonly string[]
  value: string
  onValueChange: (value: string | null) => void
  onBlur: () => void
  "aria-invalid"?: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef}>
      <Combobox
        items={uses}
        required
        id="usage"
        name="usage"
        value={value}
        onValueChange={onValueChange}
      >
        <ComboboxInput
          placeholder="Select a use"
          onBlur={onBlur}
          aria-invalid={ariaInvalid}
        />
        <ComboboxContent container={containerRef}>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
