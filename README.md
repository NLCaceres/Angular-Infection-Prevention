# AngRecords

Front-facing Web App that uses express-records as a back-end REST API. Running on Angular 2+ (7.2.0). Hosted by Heroku

## Currently Working

All routes related to the Profession model currently run (locally, a production build will come soon)

## In Progress

Remaining routes related to other models built in the Express App. Most other pages will follow similar HTML and routing.

## Important Tasks

Employees and Reports routes. Once these go up, report creation and data collection (biggest functionality of the app)
can begin. From there, build upon data analysis and data reporting.

## Questions/Problems

Currently using express in-app to have the angular app serve itself the static files required. Having a separate backend
app, how can I send the static dist folder from there instead. Proxy seems to only work for local dev, so hmm
