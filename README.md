gulpGitable
===

Description
---
gulpGitable is a set of configured gulp tasks, which will allow you to manage your ableton live projects with git.
It watches your live sets and automatically commits changes.

It does not add media files.

This is a work in progress and might undergo some changes.

Basic usage
---
* Clone this repo into your ableton project
* Install dependencies: ```npm install```
* Init git: ```gulp init```
* Add a remote repository: ```gulp addRemote```
* Start the watch task, which automatically commits your changes everytime a set gets saved: ```gulp watch```
* Finally push to the remote repo: ```gulp push```

Dependencies
---
* node.js

License
---
MIT

Changelog
---
