# node-red-contrib-git-ui

A simple [Node-Red](http://nodered.org) git ui.

[![NodeRed](https://img.shields.io/badge/Node--Red-0.16.2-red.svg)](http://nodered.org)
[![NodeJS](https://img.shields.io/badge/Node.js-6.10.2-brightgreen.svg)](https://nodejs.org)
[![StandardJS](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Pre-requisites

Requires [Node-Red](http://nodered.org) version 0.16.2 or more recent.

## Installation

    $ npm i -S node-red-contrib-git-ui

## Setup

0. Make sure git is installed and a user with a valid SSH key is already set.
1. Start Node-Red at the desired user directory (via *node-red -u /some/path*)
2. Install the git-ui node from the pallete or via npm install. An empty git repo will be created at the user directory if not already present.
3. Open the config tab on git-ui and set the SSH URL for the remote repo.
4. Click 'Save and Update'. A 'staging' branch will be created on both local and remote repos if not already present.
5. Done!

## Usage

1. Make some changes to the flow and deploy them
2. Open the git-ui tab
3. Add a commit message
4. Click on commit

<img width="308" alt="screen shot 2017-06-09 at 7 15 10 am" src="https://user-images.githubusercontent.com/361140/26971414-6ea1967c-4ce3-11e7-90da-721aeaf2eed0.png">

## Development

##### 1. Clone the project

    $ git clone https://github.com/sciensa/node-red-contrib-git-ui.git

##### 2. Go to the project directory

    $ cd node-red-contrib-git-ui

##### 3. Install the dependencies

    $ npm install

##### 4. Link the project

    $ npm link
    
##### 5. Run the node-red and check the node out

## Contributing

1. Follow the [Semantic Versioning Specification](http://semver.org/).
2. Follow the [GitHub Flow](https://guides.github.com/introduction/flow/).
3. Follow the [5 Useful Tips For A Better Commit Message](https://robots.thoughtbot.com/5-useful-tips-for-a-better-commit-message) article and the [How to Write a Git Commit Message](http://chris.beams.io/posts/git-commit/) post.
4. Install and use [Commitizen](http://commitizen.github.io/cz-cli/).
5. Bug reports and pull requests are welcome on [GitHub](https://github.com/sciensa/node-red-contrib-git-ui/issues).
6. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The node is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
