import { destinations as realDestinations } from "./destinations";
import { activities as realActivities } from "./activities";
import { lodges as realLodges } from "./lodges";
import { vehicles as realVehicles } from "./vehicles";

import { destinations as fixtureDestinations } from "./__fixtures__/destinations";
import { activities as fixtureActivities } from "./__fixtures__/activities";
import { lodges as fixtureLodges } from "./__fixtures__/lodges";
import { vehicles as fixtureVehicles } from "./__fixtures__/vehicles";

const useFixtures = process.env.NEXT_PUBLIC_CONTENT_FIXTURES === "1";
const isProduction = process.env.VERCEL_ENV === "production";

if (useFixtures && isProduction) {
  throw new Error(
    "FATAL: NEXT_PUBLIC_CONTENT_FIXTURES cannot be enabled in production (VERCEL_ENV=production)."
  );
}

export const destinations = useFixtures
  ? fixtureDestinations
  : realDestinations;

export const activities = useFixtures
  ? fixtureActivities
  : realActivities;

export const lodges = useFixtures
  ? fixtureLodges
  : realLodges;

export const vehicles = useFixtures
  ? fixtureVehicles
  : realVehicles;

