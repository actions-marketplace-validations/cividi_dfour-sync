# dfour Sync

dfour Sync is an experimental GitHub Action to sync data packages between a GitHub repository and dfour storage instance. It is based on [`frictionless-dfour`](https://github.com/cividi/frictionless-dfour). To run manually use the included [command line](https://github.com/cividi/frictionless-dfour#command-line-usage) of `frictionless-dfour`.

Test the [Template/Example Repo](https://github.com/cividi/dfour-sync-example).

## Purpose

- **Data package publication**: simplify the data package publication process via GitHub by continously syncing data packages between a GitHub repository and a dfour workspace on each push, on a schedule or by manual trigger
- **Backup**: Easily add data packages from a workspace to version control and vice versa

## Usage

- Create an empty folder and add a `.gitignore` file
- Add the following as `.github/workflows/main.yaml`
- Add repository secrets

```yaml
on: push
name: publish to dfour
jobs:
  github-action:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    # Upload from repo and fetch data packages in workspace (newer wins)
    - name: sync folder with dfour
      uses: cividi/dfour-sync@v0.1
      with:
        dfour_endpoint: https://sandbox.dfour.space
        dfour_username: ${{ secrets.DFOUR_USERNAME }}
        dfour_password: ${{ secrets.DFOUR_PASSWORD }}
        dfour_workspace: ${{ secrets.DFOUR_WORKSPACE }}
        folder: _out/snapshots # default
    # For committing back downloaded snapshots
    - name: push
      uses: actions-x/commit@v2
```

## Requirements

- A folder with data packages to be synced (defaults to `_out/snapshots`)
- Topics and bfsNumbers stored in a `dfour.yaml` in the same folder 

If the folder is empty and hence all snapshots from workspace are downloaded, a `dfour.yaml` will be created automatically.

Structure of `dfour.yaml`:
```yaml
WORKSPACEHASH:
  endpoint: https://sandbox.dfour.space
  snapshots:
    snapshot-name:
      topic: TOPIC
      bfsNumber: 123
```
