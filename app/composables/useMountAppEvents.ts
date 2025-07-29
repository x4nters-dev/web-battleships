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
    player.value.playerId = payload.playerId
    connectedEvent.value = payload
  })

  on(EventType.created, payload => {
    createdEvent.value = payload
  })

  on(EventType.joined, payload => {
    joinedEvent.value = payload
  })

  on(EventType.ready, payload => {
    readyEvent.value = payload
  })

  on(EventType.started, payload => {
    startedEvent.value = payload
  })

  on(EventType.shot, payload => {
    shotEvent.value = payload
  })

  on(EventType.updated, payload => {
    updatedEvent.value = payload
  })

  on(EventType.finished, payload => {
    finishedEvent.value = payload
  })

  on(EventType.removed, payload => {
    removedEvent.value = payload
  })
})
}