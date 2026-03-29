export type UnsplashPhotoResponse = {
  id: string;
  slug: string;
  alternative_slugs: AlternativeSlugs;
  created_at: Date;
  updated_at: Date;
  promoted_at: null;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  description: string;
  alt_description: string;
  breadcrumbs: string[];
  urls: Urls;
  links: WelcomeLinks;
  likes: number;
  liked_by_user: boolean;
  current_user_collections: string[];
  sponsorship: null;
  topic_submissions?: WelcomeTopicSubmissions;
  asset_type: string;
  user: User;
  exif: Exif;
  location: Location;
  meta: Meta;
  public_domain: boolean;
  tags: Tag[];
  views: number;
  downloads: number;
  topics: string[];
};

type AlternativeSlugs = {
  en: string;
  es: string;
  ja: string;
  fr: string;
  it: string;
  ko: string;
  de: string;
  pt: string;
};

type Exif = {
  make: string;
  model: string;
  name: string;
  exposure_time: string;
  aperture: string;
  focal_length: string;
  iso: number;
};

type WelcomeLinks = {
  self: string;
  html: string;
  download: string;
  download_location: string;
};

type Location = {
  name: null;
  city: null;
  country: null;
  position: Position;
};

type Position = {
  latitude: null;
  longitude: null;
};

type Meta = {
  index: boolean;
};

type Tag = {
  type: Type;
  title: string;
  source?: Source;
};

type Source = {
  ancestry: Ancestry;
  title: string;
  subtitle: string;
  description: string;
  meta_title: string;
  meta_description: string;
  cover_photo: CoverPhoto;
  affiliate_search_query: null;
};

type Ancestry = {
  type: Category;
  category: Category;
  subcategory: Category;
};

type Category = {
  slug: string;
  pretty_slug: string;
};

type CoverPhoto = {
  id: string;
  slug: string;
  alternative_slugs: AlternativeSlugs;
  created_at: Date;
  updated_at: Date;
  promoted_at: Date;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  description: string;
  alt_description: string;
  breadcrumbs: Breadcrumb[];
  urls: Urls;
  links: WelcomeLinks;
  likes: number;
  liked_by_user: boolean;
  current_user_collections: string[];
  sponsorship: null;
  topic_submissions: CoverPhotoTopicSubmissions;
  asset_type: string;
  premium: boolean;
  plus: boolean;
  user: User;
};

type Breadcrumb = {
  slug: string;
  title: string;
  index: number;
  type: Type;
};

export enum Type {
  LandingPage = 'landing_page',
  Search = 'search',
}

type CoverPhotoTopicSubmissions = {
  wallpapers?: Nature;
  nature?: Nature;
  'textures-patterns'?: TexturesPatterns;
};

type Nature = {
  status: string;
};

type TexturesPatterns = {
  status: string;
  approved_on: Date;
};

type Urls = {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: string;
  small_s3: string;
};

type User = {
  id: string;
  updated_at: Date;
  username: string;
  name: string;
  first_name: string;
  last_name: string;
  twitter_username: null | string;
  portfolio_url: null | string;
  bio: null | string;
  location: null | string;
  links: UserLinks;
  profile_image: ProfileImage;
  instagram_username: null | string;
  total_collections: number;
  total_likes: number;
  total_photos: number;
  total_promoted_photos: number;
  total_illustrations: number;
  total_promoted_illustrations: number;
  accepted_tos: boolean;
  for_hire: boolean;
  social: Social;
};

type UserLinks = {
  self: string;
  html: string;
  photos: string;
  likes: string;
  portfolio: string;
  following: string;
  followers: string;
};

type ProfileImage = {
  small: string;
  medium: string;
  large: string;
};

type Social = {
  instagram_username: null | string;
  portfolio_url: null | string;
  twitter_username: null | string;
  paypal_email: null;
};

type WelcomeTopicSubmissions = {
  topic_submissions: {
    wallpapers: {
      status: string;
    };
    nature: {
      status: string;
    };
    'textures-patterns': {
      status: string;
      approved_on: string;
    };
  };
};

export type BannerImage = {
  url: string;
  creditUser: string;
  creditUserLink: string;
  creditImageLink: string;
};
