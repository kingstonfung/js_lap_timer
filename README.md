## Synopsis:
A small utility timer widget to be built using JavaScript ES2015 best practices. A simple stopwatch with multiple counters using Redux Architecture.

<!-- ## Technical Requirements, Dependencies, Best Practices (WIP):
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
- Except dev environment setups, we will try to keep frameworks, libraries, and dependencies to a minimal. -->

## Motivation:
Sports usage aside, there are many businesses that requires precise measurements of time spent per client (eg: medical clinic, law offices, consultants). Each client require professionals to perform multiple sessions of work:
- **A)** Time spent *WITH* the client during visit such as face-to-face consultation, physical diagnosis, or simply gathering requirements.
- **B)** Time spent *AFTER* client visit such as paperwork filing, charting, prescription filling, or building cases for business processing.
- **C)** Coding practice to get better; because I care http://bit.ly/21a1xjO

## Widget Implementation (WIP):
Single point of entry `<script>` implementation:

```
<script
  type="text/javascript"
  src="http://cdn.rawgit.com/kingstonfung/js_lap_timer/master/release/js_timer.min.js"
  data-source-origin='http://cdn.rawgit.com/kingstonfung/js_lap_timer/master'
  data-source-style='/release/js_timer.min.css'
  data-toggle-button-selector='#awesomeTimer'
  async>
</script>
```

- `src`: Direct reference to the min.js file.
- `data-source-origin`: The path to the root directory where other assets are held. Leave blank `""` if hosted locally.
- `data-source-style`: Relative path to the stylesheet. This string concatenate itself onto `data-source-origin` to make up the full path.
- `data-toggle-button-selector`: Query selector to the button that would toggle the visibility of this widget.
- `async`: Recommended, so that the loading and execution of this script does not block the rest of your page's rendering.

## Dev Environment Installation (WIP):
<!-- 1. Ensure Node.JS is installed on your system. [Link to Getting Started](https://docs.npmjs.com/getting-started/installing-node)
2. Clone or download this repository.
3. Perform project dependency installation.
   * `cd` into  project folder, then run `npm install`
4. To run unit tests on source code:
   * run `yarn test`
5. To compile source code for delivery:
   * run `yarn build`
6. (TBD) To run browser tests from source code:
   * run `yarn test-ui` -->

## API Reference:
Simple initialze the timer, and then call `Kingular.clientTimer.getStatusJSONString();` to get lap times.

## Known Issues, To-Do:
- LocalStorage (lap times) does not expire. If I pull the JSON out of the timer next weekend, I still get the same timer data from the last run.
- Unit tests
- Complete the documentations

## Tests (WIP):
<!-- run `yarn test` and observe unit test results. -->

## License:
Free for all?
