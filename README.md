# GraphicalModelCreator

### Source Code (<a href="https://github.com/AlexOuyang/GraphicModelCreator">Github</a>)
A library API for creating interactive probabilistic graphical models for visualizing the theory of communication using D3.js and ES6. (A project done in Interactive Cognition lab at UCSD)

### Resources

GraphicModelCreator/ 
│ 
├── pgm_lib/                                          This contains the source code
│   ├── build/                                        This contains the build (minified transpiled file)
│   ├── prototypes/                                   This contains old files
│   └── src/                                          This contains the core code in development
├── tutorial/                                         This contains the tutorial files
│
└── documentation/
    └── out/                                          This contains the documentation


### Dependencies

* __JQuery__
* __JQuery UI__
* __D3.js__
* __normalize.css__

### Comptability

ES6 is only supported in Chrome at the moment, use <a href="https://babeljs.io/">Babel</a> to transpile the code to ES5 to achieve full compatability in Firefox and Safari.

### Documentation

The documentation is generated using jsDoc.
To regenerate documentation with a readme in home page and tutorials in the GraphicModelCreator/documentation directory:

    cd GraphicalModelCreator

    jsdoc -u tutorial/ pgm_lib/src/ pgm_lib/src  README.md -d documentation/


### ScreenShots

<img src="https://raw.githubusercontent.com/AlexOuyang/GraphicModelCreator/master/img/pgm_0.png" width="40%">
<img src="https://raw.githubusercontent.com/AlexOuyang/GraphicModelCreator/master/img/pgm_1.png" width="40%">
<img src="https://raw.githubusercontent.com/AlexOuyang/GraphicModelCreator/master/img/pgm_2.png" width="40%">
<img src="https://raw.githubusercontent.com/AlexOuyang/GraphicModelCreator/master/img/pgm_3.png" width="40%">
<img src="https://raw.githubusercontent.com/AlexOuyang/GraphicModelCreator/master/img/pgm_4.png" width="40%">
<img src="https://raw.githubusercontent.com/AlexOuyang/GraphicModelCreator/master/img/pgm_5.png" width="40%">
<img src="https://raw.githubusercontent.com/AlexOuyang/GraphicModelCreator/master/img/1.png" width="40%">

### Author

Alex Chenxing Ouyang (c2ouyang@ucsd.edu)

