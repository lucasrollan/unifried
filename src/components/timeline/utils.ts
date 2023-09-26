export function scale(size: number, daysInView: number): string {
    const dayScreenProportion = 100 / daysInView // how much of the screen width a day takes
    return `${size * dayScreenProportion}vw`
}

export function classes(...classNames: string[]): string {
    return classNames.filter(Boolean).join(' ')
}