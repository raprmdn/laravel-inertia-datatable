"use client"

import * as React from "react"
import { Direction } from "radix-ui"

function DirectionProvider({
                               dir,
                               direction,
                               children
                           }) {
    return (
        <Direction.DirectionProvider dir={direction ?? dir}>
            {children}
        </Direction.DirectionProvider>
    );
}

const useDirection = Direction.useDirection

export { DirectionProvider, useDirection }
