export function findNextTimeMultipleTrainsRun(trains, after) {
  if (!Array.isArray(trains) || trains.length < 2) return

  const times = trains
    .map((train) => train.times)
    .flat()
    .sort()
  if (times.length < 2) return

  let firstDup
  for (let i = 1; i < times.length; ++i) {
    const prev = times[i - 1]
    const curr = times[i]
    const isDup = curr === prev
    if (!firstDup && isDup) firstDup = curr
    if (curr > after && isDup) return curr
  }
  return firstDup
}
