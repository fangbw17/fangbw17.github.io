#!/usr/bin/env sh
 
# 忽略错误
set -e  #有错误抛出错误
 
# 构建
pnpm docs:build
cd docs/.vitepress/dist

git add -A
git commit -m "auto construct blog"

git push -f https://github.com/fangbw17/fangbw17.github.io.git master:gh-pages
