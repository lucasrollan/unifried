export function scale(size: number, dayWidthPx: number): string {
    return `${size * dayWidthPx}px`
}

export function classes(...classNames: string[]): string {
    return classNames.filter(Boolean).join(' ')
}