# PRG Export Scratch VM

This repository assists in keeping the [PRG Extension Boilerplate repo](https://github.com/mitmedialab/prg-extension-boilerplate) up to date with the offical [Scratch VM repo](https://github.com/LLK/scratch-vm).

## How is it used?

### Update with Scratch

```bash
cd prg-export-scratch-vm/

# Check to see if you've already add remote
git remote -v 
# If the following two lines appear in the output, skip to Step 2
# upstream	git@github.com:LLK/scratch-vm.git (fetch)
# upstream	git@github.com:LLK/scratch-vm.git (push)

# Step 1. Add Scratch (official) remote
git remote add upstream git@github.com:LLK/scratch-vm.git

# Step 2. Get latest from Scratch (official) remote and apply changes
git pull upstream
git merge upstream/develop

# Deal with any merge conflicts. There likely won't be any code conflicts, except for:
# - This README.md
# - Both moving/renaming a file (or we moved, and Scratch renamed)

# Ensure that all content remains in packages/scratch-vm
ls -a
```

### Update [prg-extension-boilerplate]
```bash
cd prg-extension-boilderplate/

# Check to see if you've already add remote
git remote -v 
# If the following two lines appear in the output, skip to Step 2
# scratch-vm	git@github.com:pmalacho-mit/prg-export-scratch-vm.git (fetch)
# scratch-vm	git@github.com:pmalacho-mit/prg-export-scratch-vm.git (push)

# Step 1: Add and sync with scratch-vm remote

```

## How was it made? 

The setup of the [PRG Extension Boilerplate repo](https://github.com/mitmedialab/prg-extension-boilerplate) and it's use of the [Lerna utility](https://lerna.js.org/) make it a little tricky to keep up to date with LLKs.

Based on the wisdom of [this post](https://stackoverflow.com/questions/49930314/is-there-a-way-to-refresh-an-imported-repository-with-lerna), we've adapted the following strategy to integrate changes from the offical [Scratch VM repo](https://github.com/LLK/scratch-vm):

```
git remote add scratch-vm git@github.com:pmalacho-mit/prg-export-scratch-vm.git
git pull scratch-vm
git merge
```
