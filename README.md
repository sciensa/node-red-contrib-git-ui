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
1. When Start Node-Red do not forget to pass the git repository  directory as start parameter eg. node-red -u '/some/path'
2. Install the git-ui node from the pallete or via npm install. An empty git repo will be created at the user directory if not already present.
3. Open the config tab on git-ui and set the SSH URL for the remote repo. Currently only accepts URLs in the format git@\<server\>:\<user\>/\<repo\>.git
4. Click 'Save and Update'. A 'staging' branch will be created on both local and remote repos if not already present.
5. Done!

## Usage

1 - Configure your remote repository in the Config tab

![aba config.PNG](https://bitbucket.org/repo/kM5R6aM/images/1730269655-aba%20config.PNG)



2 - Choose a branch to list the commits

![aba log.PNG](https://bitbucket.org/repo/kM5R6aM/images/3028231098-aba%20log.PNG)



3 - Click in the especific commit to see the details 

![commit details.PNG](https://bitbucket.org/repo/kM5R6aM/images/2482319753-commit%20details.PNG)



4 - Make some changes to the flow and deploy them  
5 - Open the git-ui tab  
6 - Add a commit message  
7 - Click on commit  

![aba commit.PNG](https://bitbucket.org/repo/kM5R6aM/images/3310050031-aba%20commit.PNG)


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