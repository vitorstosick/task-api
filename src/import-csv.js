import fs from 'node:fs'
import { parse } from 'csv-parse'
import { fileURLToPath } from 'node:url'

const csvPath = fileURLToPath(new URL('../tasks.csv', import.meta.url))

const parser = fs
  .createReadStream(csvPath)
  .pipe(
    parse({
      from_line: 2,
      trim: true,
    })
  )

let count = 0

for await (const record of parser) {
  const [title, description] = record

  await fetch('http://localhost:3333/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  })

  count++
}
