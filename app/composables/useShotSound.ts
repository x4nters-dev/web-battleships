import { useSound } from '@vueuse/sound'

export function useShotSound() {
    return useSound('/media/shot.webm')
}