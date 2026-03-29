type FeatureLocation = {
  type: 'FeatureCollection';
  features: Feature[];
  attribution: string;
};

type Feature = {
  type: 'Feature';
  id: string;
  geometry: Geometry;
  properties: Properties;
};

type Geometry = {
  type: 'Point';
  coordinates: number[];
};

type Properties = {
  mapbox_id: string;
  feature_type: string;
  full_address: string;
  name: string;
  name_preferred: string;
  coordinates: {
    longitude: number;
    latitude: number;
  };
  place_formatted?: string;
  bbox: number[];
  context: Context;
};

type Context = {
  region?: Region;
  country?: Country;
  place?: Place;
};

type Region = {
  mapbox_id: string;
  name: string;
  wikidata_id?: string;
  region_code: string;
  region_code_full: string;
  translations?: Translations;
};

type Country = {
  mapbox_id: string;
  name: string;
  wikidata_id?: string;
  country_code: string;
  country_code_alpha_3: string;
  translations?: Translations;
};

type Place = {
  mapbox_id: string;
  name: string;
  wikidata_id?: string;
  translations?: Translations;
};

type Translations = {
  [language: string]: {
    language: string;
    name: string;
  };
};

type FormattedLocation = {
  id: string;
  coordinates: number[];
  name: string;
  district?: string;
  address: string;
  country: string;
  countryCode: string;
  region?: string;
};

type Theme = 'cool' | 'mild' | 'hot';

export type { FormattedLocation, FeatureLocation, Feature, Theme };
