const core = require('@actions/core')
const artifact = require('@actions/artifact')
const util = require('util')
const { dir } = require('tmp-promise')
const { action } = require('../lib/action')
const config = require('../lib/config')

// General

describe('General', () => {
  const any = expect.anything()
  const curdir = process.cwd()
  const execute = jest.fn()
  const upload = jest.fn()
  let workdir
  let inputs

  beforeAll(() => {
    // Set environ
    process.env.GITHUB_REPOSITORY = 'user/repo'
    process.env.GITHUB_WORKFLOW = 'flow'
    process.env.GITHUB_RUN_ID = 'id'
    process.env.DFOUR_ENDPOINT = config.DEFAULT_DFOUR_ENDPOINT

    // Mock core
    jest.spyOn(core, 'getInput').mockImplementation((name) => inputs[name])
    jest.spyOn(core, 'setFailed').mockImplementation(jest.fn())
    jest.spyOn(core, 'error').mockImplementation(jest.fn())
    jest.spyOn(core, 'warning').mockImplementation(jest.fn())
    jest.spyOn(core, 'info').mockImplementation(jest.fn())
    jest.spyOn(core, 'debug').mockImplementation(jest.fn())

    // Mock upload
    upload.mockReturnValue({ failedItems: [] })
    jest.spyOn(artifact, 'create').mockImplementation(() => ({ uploadArtifact: upload }))

    // Mock execute
    execute.mockReturnValue({ stdout: '{"valid": false}' })
    jest.spyOn(util, 'promisify').mockImplementation(() => execute)
  })

  beforeEach(async () => {
    inputs = {}
    workdir = await dir({ unsafeCleanup: true })
    process.env.GITHUB_WORKSPACE = workdir.path
  })

  afterEach(() => {
    workdir.cleanup()
    jest.clearAllMocks()
    process.chdir(curdir)
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('no files', async () => {
    await action()
    expect(core.setFailed).toHaveBeenCalledWith('dfour sync with undefined has failed')
  })
})
