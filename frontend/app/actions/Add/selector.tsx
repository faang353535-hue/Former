import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface SelectorProps {
    selectedField: string;
    onSelectField: (value: string) => void;
}

export function Selector({ selectedField, onSelectField }: SelectorProps) {
    return (
        <Select onValueChange={onSelectField} value={selectedField}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Field" />
            </SelectTrigger>
            <SelectContent >
                <SelectGroup>
                    <SelectLabel>Fields</SelectLabel>
                    <SelectItem value="text">Text </SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="text Area">Text Area</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
