# AngRecords

- Front-facing Web App that uses express-records as a back-end REST API. Running on Angular 2+ (7.2.0). Hosted by Heroku

## Currently Working

- All routes related to the Profession model currently run (locally, a production build will come soon)

## In Progress

- Remaining routes related to other models built in the Express App. Most other pages will follow similar HTML and routing.

## Important Tasks

- Update Ng all together or switch to React + Flask/Django stack.

- Employees and Reports routes. Once these go up, report creation and data collection (biggest functionality of the app)
can begin. From there, build upon data analysis and data reporting.

## Questions/Problems

- IMPORTANT! Resolve-url-loader issue is VERY common problem at the moment so fix as soon as the new package is ready!

- Currently using express in-app to have the angular app serve itself the static files required. Having a separate backend
app, it feels worth looking into creating a monolith. More importantly, it's probably best to get rid of Express, possibly in favor of Django or Flask.

- Ng-Bootstrap currently doesn't support Ang 12 BUT it should soon, specifically 10.x will support Ang 12.0, so in the mean time there's no problems with using Ang 12 and ng-bootstrap 9.x but as soon as possible UPGRADE.

## Future Notice

- How to serve up the files: Since we're using express, server.js is where it'll look for the config. This config file (server.js) looks for the dist folder that `ng build` produces. BEFORE in the angular.json `ng build` was configured in projects: `{ ang-records: { architects: { build: { options: { outputPath: 'dist/ang-records' ...} } } } }` BUT NOW we changed it to `outputPath: 'dist'` so we can do a simple `npm run build` rather than what we originally did with `npm run postinstall` which specified the --output-path option like so, `ng build --output-path dist` under the hood.
    - Once `npm run build` or `npm run postinstall` is run, the server will now have an updated dist folder to latch on and serve up fresh files!

- Worth noting, angular.json can change from time to time. As an example, es5Support key was deprecated and caused a bit of trouble with basic updating. Since angular has a compiler and handy CLI, so running the command `ng update @angular/core@11 @angular/cli@11` followed by `ng update` should usually do the trick (besides the usual `npm audit fix`)
    - If a major version update (i.e. 12.x to 13.x) or even multiple major versions upgrade, then worth checking out https://update.angular.io/
