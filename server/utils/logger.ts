export function logInfo(ctx: string, message: string): void {
    console.info(`[${ctx.toUpperCase()}] ${message}`)
}

export function logError(ctx: string, message: string): void {
    console.error(`[${ctx.toUpperCase()}] ${message}`)
}