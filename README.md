# gitable

## Description

gitable is node.js cli tool which watches your ableton live project. Every time it detects a change, it will create a new commit.
This workflow currently ignores your audio files, git lfs support might be added later.

gitable is still incomplete, use at your own risk.

## Built status
[![Build Status](https://travis-ci.com/thomasgeissl/gitable.svg?branch=master)](https://travis-ci.com/thomasgeissl/gitable)

## Usage

- installation: `npm install -g thomasgeissl/gitable`
- cd into your project: `cd /Users/thomasgeissl/Desktop/gitabletest\ Project`
- the following tasks are avaible
  - init: initialises a git repo
  - watch: automatically creates a commit when a live set is saved
  - back2live: generates an ableton readable .als file

Use default git commands -such as commit, tag, branch, push, ... - if you need a more advanced setup.

In order to switch back to an old version, you will need to stop live. Check out your commit and run the back2live task, which will gzip the xml file.

## Requirements

- nodejs
- git


## License

This project is released under MIT license, please note that dependencies might be released differently.

Copyright (c) 2019 Thomas Geissl

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
