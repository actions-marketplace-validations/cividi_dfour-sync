# dfour Sync

dfour Sync is an experimental GitHub Action to sync data packages between a GitHub repository and dfour storage instance.

## Purpose

- **Data package publication**: simplify the data package publication process via GitHub by continously syncing data packages between a GitHub repository and a dfour workspace on each push, on a schedule or by manual trigger
- **Backup**: Easily add data packages from a workspace to version control and vice versa

## Usage

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
      uses: devops-infra/action-commit-push@master
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        add_timestamp: true
        commit_prefix: "[AUTO]"
        commit_message: "Automatic commit via dfour-sync"
        target_branch: main
```

## Requirements

- A folder with data packages to be synced (defaults to `_out/snapshots`)
- Files must be prefixed (seperator: dash) with the topic, e.g. `structure-01-buildings.json` -> inferred topic `Structure`
