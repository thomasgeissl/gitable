# gitable


## Description
gitable is node cli tool which watches your ableton live project. Every time it detects a change, it will create a new commit.

## Usage
* installation: `npm install -g @thomasgeissl/gitable`
* cd into your project: `cd /Users/thomasgeissl/Desktop/gitabletest\ Project`
* start the cli: `gitable`
* quit the current task with ctrl + c
* the folling tasks are avaible
    * config: initialises a git repo
    * watch: automatically commits when live set is saved
    * commit: manually creates a commit
    * push: pushes to origin master
    * back2live: generates the ableton readable als file

## License
This project is released under MIT license, please note that dependencies might be released differently.

Copyright (c) 2019 Thomas Geissl

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.