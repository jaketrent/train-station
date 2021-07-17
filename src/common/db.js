export function connect(seed = {}) {
  const db = seed
  return {
    keys() {
      return Object.keys(db)
    },
    fetch(key) {
      return db[key]
    },
    set(key, value) {
      db[key] = value
    },
  }
}
