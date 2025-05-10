import type { VercelRequest, VercelResponse } from '@vercel/node'
import { exec } from 'child_process'
import path from 'path'

export default function handler(request: VercelRequest, response: VercelResponse) {
  // In Vercel, process.cwd() is the root of your deployed project files (e.g., /var/task)
  const projectRoot = process.cwd()
  const eudicDirPath = path.join(projectRoot, 'eudic')

  // The "dev" script from eudic/package.json
  const scriptToRun = 'node --loader ts-node/esm index.ts'

  // Full command: change to eudic directory, then execute the script
  const command = `cd "${eudicDirPath}" && ${scriptToRun}`

  console.log(`Executing command: ${command}`)

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script in ${eudicDirPath}: ${error.message}`)
      console.error(`Stdout: ${stdout}`)
      console.error(`Stderr: ${stderr}`)
      return response.status(500).send(`Script execution failed: ${error.message}. Stderr: ${stderr}`)
    }
    console.log(`Stdout from ${eudicDirPath}: ${stdout}`)
    if (stderr) {
      console.warn(`Stderr from ${eudicDirPath} (warnings or other output): ${stderr}`)
    }
    response.status(200).send(`Script executed successfully. Output: ${stdout}`)
  })
}
