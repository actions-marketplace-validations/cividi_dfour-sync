const util = require('util')
const fs = require('fs-extra')
const { exec } = require('child_process')
const core = require('@actions/core')
const config = require('./config')

// General

exports.action = async function () {
  let folder
  let workspace
  let endpoint
  let username
  let password
  let valid = false

  // Set workdir
  try {
    process.chdir(process.env.GITHUB_WORKSPACE)
  } catch (error) {
    core.setFailed(`Cannot set workdir: ${error.message}`)
    return
  }

  // Read parameters

  try {
    folder = core.getInput('folder') || config.DEFAULT_FOLDER
    if (await fs.pathExists(folder)) {
      valid = true
      workspace = core.getInput('dfour_workspace')
      endpoint = core.getInput('dfour_endpoint', { required: true })
      process.env.DFOUR_ENDPOINT = endpoint
      username = core.getInput('dfour_username')
      password = core.getInput('dfour_password')
    }
  } catch (error) {
    core.setFailed(`Cannot define request: ${error.message}`)
    return
  }

  // Read data packages in workspace
  if (valid) {
    try {
      const promExec = util.promisify(exec)
      const { stdout } = await promExec(
        `dfour workspace -y -u ${username} -p ${password} -e ${endpoint} ${workspace} ${process.env.GITHUB_WORKSPACE}/${folder}`
      )
      const notify = core.info
      notify(stdout)
    } catch (error) {
      core.setFailed(`Cannot run request: ${error.message}`)
      return
    }
  }

  // Notify user
  try {
    // const [user, repo] = process.env.GITHUB_REPOSITORY.split('/')
    // const flow = process.env.GITHUB_WORKFLOW
    // const run = process.env.GITHUB_RUN_ID
    const link = endpoint
    const notify = valid ? core.info : core.setFailed
    const state = valid ? 'passed' : 'failed'
    notify(`dfour sync with ${link} has ${state}`)
  } catch (error) {
    core.setFailed(`Cannot notify user: ${error.message}`)
    return // eslint-disable-line
  }
}
