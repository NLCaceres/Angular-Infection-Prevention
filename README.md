# Infection Protection - AngularJS Front-End
- An AngularJS-based front-end Web App running on Angular 2+ (12.0.0) and currently using ExpressJS as a back-end REST API
  - Soon this Angular app will instead interface a Spring Boot backend that serves data over a GraphQL API
  - Firstly, however, this app will be updated to the latest version of Angular (15.2.4) to adopt more modern Angular practices

## Currently Working
- All routes related to the Profession model currently run

## In Progress
- Employees Route, Precaution Route, Location Route, Report Route
  - Question is to see how easily they can each be mapped to a layout similar to the Profession Route for easy reuse.
  - Highest Priorities are: 
    - Employees (+ Profile page) as well as the Reports List page (with report creation and data graphing)
    - Reports List page alongside the Creation page and data graphing, possibly via D3.js
- Receive OAuth2 authorization from Spring Boot app and store token safely across CORS.

## Related Apps
- Android App: https://github.com/NLCaceres/Android-Records
    - Nearing feature parity again (still needs several views missing in iOS)
    - Targets Android 13 Tiramisu (Sdk 33) to 8 Oreo (Sdk 26)
    - Future Developments
        - Begin using Jetpack Compose to create views
        - Add Room Library for local caching
- Back-end resource server: https://github.com/NLCaceres/Ang-records
    - Running Spring Boot with both a REST and GraphQL API available
    - Future Developments
      - OAuth token authentication
- iOS App: https://github.com/NLCaceres/iOS-records 
    - In the process of better separating code for readability and reusability by extracting business logic out 
    of ViewModels and into Repositories/Services + Domain-layer reusable functions 
    - Will need to add search bar to ReportList view for filtering
    - Will need to feed data into SwiftUI Charts

## Questions/Problems
- By using Vercel, is the ExpressJS server still needed in production? Probably not!
  - How does it handle environmental variables though? 
    - Exposing secrets is not a good idea, of course, and dotenv is technically
    available to Angular apps. The idea for me has been to make `process.env.invis_vars` usable in the environment.ts files during the 
    `ng build` process. Doing so allows, Angular to grab environment vars as it normally expects 
      - BUT Vercel seems to be able to inject `process.env.SOME_VAR` pretty easily!

- Drop Ng-Bootstrap in favor of PicoCSS or MaterialUI
  - PicoCSS could provide a simple yet appealing look that doesn't fall easily into the Bootstrap or Tailwind styles commonly seen
  - MaterialUI though could provide a very appealing business aesthetic.

## Future Notice

- How to serve up the files: Since I'm using Express, server.js is where it'll look for the config. This config file (server.js) 
looks for the dist folder that `ng build` produces. 
  - BEFORE in the angular.json `ng build` was configured in projects to be: 
    - `{ ang-records: { architects: { build: { options: { outputPath: 'dist/ang-records' ...} } } } }` 
    - BUT NOW we changed it to `outputPath: 'dist'` so I can do a simple `npm run build` 
    - AND NOT what I originally did with `npm run postinstall` which specified the --output-path option as follows:
      - `ng build --output-path dist`
  - Once `npm run build` or `npm run postinstall` is run, the server will now have an updated dist folder to latch on and serve up fresh files!

- Worth noting, angular.json can have its own breaking changes. 
  - As an example, es5Support key was deprecated and caused a bit of trouble when I was doing a simple update
  - BUT thanks to Angular's handy dandy CLI, I can run the following commands to solve most issues!
    - `ng update @angular/core@11 @angular/cli@11`
      - This updates to the latest patch version of this particular version
    - `ng update` 
      - This updates to the very latest major version of Angular!
  - Generally, the above commands should do the trick (besides the usual `npm audit fix`, of course)
  - BUT whenever a major version is released (i.e. 12.x to 13.x), and especially if multiple major versions needs to be upgraded, 
  then [it's probably worth checking out Angular's updater](https://update.angular.io/)
