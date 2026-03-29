type FeatureLocation = {
  type: 'FeatureCollection';
  query: string[];
  features: Feature[];
  attribution: string;
};

type Feature = {
  id: string;
  type: 'Feature';
  place_type: string[];
  relevance: number;
  properties: Properties;
  text_en: string;
  language_en: string;
  place_name_en: string;
  text: string;
  language: string;
  place_name: string;
  bbox: number[];
  center: number[];
  geometry: Geometry;
  context: Context[];
};

type Properties = {
  mapbox_id: string;
  wikidata: string;
};

type Geometry = {
  type: 'Point';
  coordinates: number[];
};

type Context = {
  id: string;
  mapbox_id: string;
  wikidata: string;
  text_en: string;
  language_en: string;
  text: string;
  language: string;
  short_code?: string;
};

type FormattedLocation = {
  id: string;
  coordinates: number[];
  name: string;
  district?: string;
  address: string;
  country: string;
  region?: string;
};

type Theme = 'cool' | 'mild' | 'hot';

export type { FormattedLocation, FeatureLocation, Feature, Theme };
