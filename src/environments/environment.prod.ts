//! All vars in here CAN be seen so not a 1:1 equivalent of dotenv style vars!
//* Difference comes down to `ng build` which produces the dist folder SO
//* `ng build` can't grab the node process env folder to fill in process.env.hidden_vars!

export const environment = {
  production: true,
  apiHost: "https://infection-prevention-express.herokuapp.com/api"
};
//! Example usage of these vars in profession.service.ts file
