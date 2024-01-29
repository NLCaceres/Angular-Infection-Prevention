# Infection Protection - AngularJS Front-End
- An AngularJS-based front-end Web App running on Angular 2+ (15.2.4) and now using Spring Boot 3 as a back-end REST API 
with the option to use GraphQL instead. By providing a web interface for Healthcare Admins to personalize how their staff accesses
Infection Control data, they can more easily and completely tailor the user experience of the mobile app ecosystem to their facility.

## Currently Working
- All routes related to the Profession model currently run

## Recent Developments
- Upgraded to Angular 17
  - Upgraded to Node 20
  - Upgraded to Typescript 5.3
  - Added PNPM to replace NPM
- Revamp Angular Config to drop unneeded features/options and to upgrade away from the original Angular Builder `build-angular:browser`
  - Split configuration into development and production, `build` defaults to using `production` and `serve` to using `development`
  - First moved to the `build-angular:browser-esbuild` to adopt the new ESM imports, build tools like Vite, and improved build speed
  - NOW: Moved to `build-angular:application` to more easily adopt SSR in the future
- Added Jest test builder to drop Karma+Jasmine testing
- Fully tested in Cypress after dropping Protractor
- Revised ProfessionService typing and error messaging to handle fallback values and improve UX
- Fixed template-driven forms double submitting or submitting unintentionally
- Upgraded RxJS in prep for RxJS 8

## In Progress
- Employees Route, Report Route, Precaution Route, HealthPractice, Location Route
  - Idea for improved reusability using only a few components:
    - Title Page which accepts a Title string and has a slot for content projection
      - ONLY renders a back button, h2 title, and the slot
    - In general, the slot will likely be filled with a data-list component or form component
      - The data-list component CAN be simple BUT it's still likely best to make sure each Model gets its own version of the 
      data-list component, so they each can add features as needed.
        - Probably also helpful for cases like a `<report-list>` where the list can have a button in the top right corner that switches out
        the list for a graph
      - The form component should be individual to each Model, in particular since each should use `ReactiveForms`
      for more explicit, powerful and testable Typescript components with equally simple templates
        - `ReactiveForms` should also make adding Validators simple
  - Highest Priorities are:
    - Employees (and Profile page since it will likely reuse the <employee-details> component)
    - Reports List page alongside the Creation page and data graphing, possibly via D3.js
- Replace NgBootstrap with Angular Material
- Add `Reactive Forms`
- Add Angular SSR package and any necessary adjustments (such as `afterRender()` for browser-based code) as more clarification arrives
regarding the future of `Angular/Universal` as it's added to the new `@angular/ssr` NPM package in the front-end framework
  - [See here for the basics](https://angular.io/guide/ssr)
- Receive OAuth2 authorization from Spring Boot app and store token safely across CORS.

## Questions/Problems
- Given Angular's new Application-Builder AND the possibility of Vercel making deployment simple, is ExpressJS still needed at all?
  - PROBABLY NOT!
    - SSR in Angular uses Express under the hood and uses a `server.ts` file to configure it. As a bonus, it leaves open the possibility of building out an API, 
    setting up alternative redirects, and sending static assets using that underlying Express server
  - Environmental Vars and Secrets are really the main problem EXCEPT Vercel seems to have no problem allowing me to inject and use `process.env.SOME_VAR`
  across the app without writing those secrets into the app itself like `environment.ts` files do after building the app.

- How to drop Ng-Bootstrap in favor of [Angular Material](https://material.angular.io/guide/getting-started)
  - Material 3 looks fantastic BUT for now Angular Material is mostly Material 2. To fix this issue,
  [Material-Components](https://github.com/material-components/material-web/discussions/5004) can be used via Material-Web to bridge the gap while
  Angular Material works on a complete solution
    - Why even bother with Angular Material if using Material-Web? Because some Angular features like `ReactiveForms` will absolutely
    take some wrestling to work without Angular Material's help

### Notes on Deployment
- How to serve up the files: Since I'm using Express, server.js is where it'll look for the config. This config file (server.js) 
looks for the dist folder that `ng build` produces.
  - BEFORE in the angular.json `ng build` was configured in projects to be: 
    - `{ ang-records: { architects: { build: { options: { outputPath: 'dist/ang-records' ...} } } } }`
    - BUT NOW I've changed it to `outputPath: 'dist'` so I can do a simple `npm run build`
    - AND NOT what I originally did with `npm run postinstall` which specified the --output-path option as follows:
      - `ng build --output-path dist`
  - Once `npm run build` or `npm run postinstall` is run, the server will now have an updated dist folder to latch on and serve up fresh files!
  - In the future, Express can be leveraged under Angular's hood to run Angular SSR

### Updating and the Angular.json Config
- Worth noting, angular.json can have its own breaking changes.
  - As an example, es5Support key was deprecated and caused a bit of trouble when I was doing a simple update
  - BUT thanks to Angular's handy dandy CLI, I can run the following commands to solve most issues!
    - `ng update @angular/core@<version-num> @angular/cli@<version-num>`
      - This updates to the latest patch version of this particular version
    - `ng update`
      - This updates to the very latest major version of Angular!
  - Generally, the above commands should do the trick (besides the usual `npm audit fix`, of course)
  - BUT whenever a major version is released (i.e. 12.x to 13.x), and especially if multiple major versions needs to be upgraded, 
  then [it's probably worth checking out Angular's updater](https://update.angular.io/)
  - For more information on options for Angular.json, check out these two links:
    - [Angular CLI's build page](https://angular.io/cli/build)
    - [Angular Workspace Config](https://angular.io/guide/workspace-config)


## Related Apps
- Android App: https://github.com/NLCaceres/Android-Infection-Prevention
  - Nearing feature parity again
    - Profile View is being implemented with Jetpack Compose
    - ReportList and Sorting implemented with Jetpack Compose
  - Targets Android 14 Upside Down Cake (SDK 34) to Android 8 Oreo (SDK 26)
  - Future Developments
      - Finish using Jetpack Compose to replace most current views
      - Add Room Library for local caching
- Back-end resource server: https://github.com/NLCaceres/Spring-Boot-Infection-Prevention
  - Running Spring Boot 3 with both a REST and GraphQL API available, documented using SwaggerUI
  - Future Developments
    - Using Spring-Boot's GraalVM bootBuildImage Gradle Task to create a deployable Docker Image
    - OAuth token authentication
    - Link Employees by Department/Team and Boss/Supervisor
    - Email Notifications across Department and Boss
- iOS App: https://github.com/NLCaceres/iOS-records
  - Better separating code for readability and reusability by extracting business logic out 
  of ViewModels and into Repositories/Services + Domain-layer reusable functions 
  - Search bar needs to be added to ReportList view for filtering
    - Add Sort + Filter options
  - Data displayed in SwiftUI Charts on button click as ReportList alternate view
