#!/usr/bin/env bash
set -eo pipefail
export DEBIAN_FRONTEND=noninteractive
export SMESH_REPO=${SMESH_REPO:-"https://github.com/binocarlos/smesh.git"}

if ! which apt-get &>/dev/null
then
  echo "This installation script requires apt-get. For manual installation instructions, consult https://github.com/binocarlos/smesh ."
  exit 1
fi

apt-get update
apt-get install -y git make

cd ~ && test -d smesh || git clone $SMESH_REPO
cd smesh
git fetch origin
make install