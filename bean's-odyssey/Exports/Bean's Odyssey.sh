#!/bin/sh
echo -ne '\033c\033]0;Bean's Odyssey\a'
base_path="$(dirname "$(realpath "$0")")"
"$base_path/Bean's Odyssey.x86_64" "$@"
