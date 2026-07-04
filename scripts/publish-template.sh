#!/usr/bin/env bash
# Publish card templates. Templates currently deploy as Workers Assets
# bundled with the dlh-serve worker (the account API token has no R2
# permissions yet; when it does, this script will upload to R2 instead).
set -euo pipefail
cd "$(dirname "$0")/../serve"

echo "Deploying dlh-serve with all templates in ../templates ..."
npx wrangler deploy
