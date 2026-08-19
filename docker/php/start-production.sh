#!/bin/sh
set -eu

rm -f public/storage
cp -a /usr/local/share/app-public/. public/

current=$(readlink public/build 2>/dev/null || true)
if [ "$current" = ".build-a" ]; then
    next=.build-b
else
    next=.build-a
fi

rm -rf "public/$next" public/.build-link
cp -a /usr/local/share/app-build "public/$next"
ln -s "$next" public/.build-link

if [ -L public/build ]; then
    mv -Tf public/.build-link public/build
else
    rm -rf public/build
    mv public/.build-link public/build
fi

php artisan optimize

exec "$@"
