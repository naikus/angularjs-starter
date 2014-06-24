# angular-starter
#### A starter application and structure for angularjs projects



### Building
-----
This project uses [gulpjs](http://gulpjs.com) (that in turn requires nodejs) for build

- Install [nodejs](http://nodejs.org) version v0.10.26 or higher
- Install gulp (See gulp's documentation on how to)
- Open the terminal and type `npm install` (into this project's root dir). This is done only once and will download various build plugins required for this build
- Type `gulp webapp` to build the project. This will build the webapp into the `dist` directory.

### Running on the local web server
-----
- In the project's directory, in the terminal, type `gulp server`. This will run a local server for testing


### Project structure
-----
```
group-starter
       + src/               (Contains all the web ui source)
       + dist/              (Generated, on build contains the actual 
       |                     build web structure)
       + node_modules/      (Generated, once during 'npm install' command)
       - gulpfile.js        (The gulpjs build file)
       - package.json       (package.json for this project)
       - README.md          (This document)
```
The source is organized as individual angularjs modules along with other web assets such as images, stylesheets and other libraries. 

The `css, fonts` and `img` directory contains, as the name suggests, those assets used in the application.

The `lib` directory contains third party libraries used by the app

**Application Shell**
At the root is the shell module `index.html, app.js`. This acts as application container and adds other modules in the `components` diretory as dependencies.

**Application Modules**
The application is composed as a set of modules based on their feature/functionality

* __`common`__ This module contains some common components such as session management and also googlemaps directive. These are used by other modules such as `campaign` and `signin`

* __`api`__ This module contains the REST API client

* __`facebook`__ Facebook module provides angularjs integration with facebook login. Used by `signin` module.

* __`signin`__ This module provides for sign-in sign-up and facebook sign-in features.

* __`ui`__ This module provides various directives/widgets for following:
    - Date picker
    - Video widget
    - File upload widget
    - Notification messages for user
    - Validations
    
    

