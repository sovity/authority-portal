#!/bin/sh

set -e

jq -n 'env | with_entries( select(.key | startswith("AUTHORITY_PORTAL_FRONTEND_") ) )' > /tmp/app-config.json
