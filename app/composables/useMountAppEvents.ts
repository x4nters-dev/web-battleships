import { EventType } from "~~/shared/enums/events"

export function useMountAppEvents() {
const { on } = useEventSource()
const player = usePlayer()

const connectedEvent = useConnectedEvent()
const createdEvent = useCreatedEvent()
const joinedEvent = useJoinedEvent()
const readyEvent = useReadyEvent()
const startedEvent = useStartedEvent()
const shotEvent = useShotEvent()
const updatedEvent = useUpdatedEvent()
const finishedEvent = useFinishedEvent()
const removedEvent = useRemovedEvent()

onMounted(() => {
  on(EventType.connected, payload => {
    console.log('connected', payload)
    player.value.playerId = payload.playerId
    connectedEvent.value = payload
  })

  on(EventType.created, payload => {
    console.log('created', payload)
    createdEvent.value = payload
  })

  on(EventType.joined, payload => {
    console.log('joined', payload)
    joinedEvent.value = payload
  })

  on(EventType.ready, payload => {
    console.log('ready', payload)
    readyEvent.value = payload
  })

  on(EventType.started, payload => {
    console.log('started', payload)
    startedEvent.value = payload
  })

  on(EventType.shot, payload => {
    console.log('shot', payload)
    shotEvent.value = payload
  })

  on(EventType.updated, payload => {
    console.log('updated', payload)
    updatedEvent.value = payload
  })

  on(EventType.finished, payload => {
    console.log('finished', payload)
    finishedEvent.value = payload
  })

  on(EventType.removed, payload => {
    console.log('removed', payload)
    removedEvent.value = payload
  })
})
}