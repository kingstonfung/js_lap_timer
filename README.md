## Synopsis:
A small utility timer widget to be built using JavaScript ES2015 best practices. A simple stopwatch with multiple counters using Redux Architecture.

## Technical Requirements, Dependencies, Best Practices (WIP):
1. Dev environment requires [Node.js npm](https://docs.npmjs.com/getting-started/installing-node) on machine.
2. Facebook's [Yarn](https://code.facebook.com/posts/1840075619545360) as package manager. (WIP)
3. [Mocha](https://mochajs.org/) framework for unit-tests. (WIP)
4. [Uglify-JS](https://www.npmjs.com/package/uglify-js) for JS Builds. (WIP)
5. [Node-SASS](https://www.npmjs.com/package/node-sass) for CSS Builds. (WIP)
6. [Phantom JS](http://phantomjs.org/) for UI automated testing. (WIP)
7. [jslint](https://github.com/reid/node-jslint) for JS code quality control. (WIP)
7. [stylelint](https://github.com/stylelint/stylelint) to enforce CSS consistent conventions and avoid errors in stylesheets. (WIP)

- This is a simple vanilla [JavaScript ES2015](https://kangax.github.io/compat-table/es6/) project for [modern browsers](http://outdatedbrowser.com/en).
- Will follow [Airbnb JS Best Practices](https://github.com/airbnb/javascript)
- [Composition over Inheritance](https://medium.com/humans-create-software/composition-over-inheritance-cb6f88070205#.1bhyisbul).
- No vendor prefix CSS. [SCSS](http://sass-lang.com/guide) is used here.
- Except dev environment setups, we will try to keep frameworks, libraries, and dependencies to a minimal.

## Motivation:
Sports usage aside, there are many businesses that requires precise measurements of time spent per client (eg: medical clinic, law offices, consultants). Each client require professionals to perform multiple sessions of work:
**A)** Time spent *WITH* the client during visit such as face-to-face consultation, physical diagnosis, or simply gathering requirements.
**B)** Time spent *AFTER* client visit such as paperwork filing, charting, prescription filling, or building cases for business processing.

## Widget Installation (WIP):
- Simply include the JS file in your HTML.
   * `<script type="text/javascript" src="TBD-URL.min.js"></script>`

## Dev Environment Installation (WIP):
1. Ensure Node.JS is installed on your system. [Link to Getting Started](https://docs.npmjs.com/getting-started/installing-node)
2. Clone or download this repository.
3. Perform project dependency installation.
   * `cd` into  project folder, then run `npm install`
4. To run unit tests on source code:
   * run `yarn test`
5. To compile source code for delivery:
   * run `yarn build`
6. (TBD) To run browser tests from source code:
   * run `yarn test-ui`

## API Reference:
Simple initialze the timer, and then call `.getTimersOutput()` to get an array of lap times.

## Tests (WIP):
run `yarn test` and observe unit test results.

## License:
Free for all?
