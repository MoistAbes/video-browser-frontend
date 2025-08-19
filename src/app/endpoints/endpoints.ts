// const BASE_URL = 'http://192.168.15.13:8080';
// const BASE_URL = 'http://192.168.108.13:8080';
const BASE_URL = '';

export const Endpoints = {
  auth: {
    register: `${BASE_URL}/auth/register`,
    login: `${BASE_URL}/auth/login`,
  },
  videos: {
    base: `${BASE_URL}/videos`,
    subtitles: `${BASE_URL}/videos/subtitles`,
    icon: `${BASE_URL}/videos/icon`,
    scan: `${BASE_URL}/videos/scan`,
    thumbnails: `${BASE_URL}/videos/thumbnails`,
  },
  videoInfo: {
    findAll: `${BASE_URL}/video-info/find-all`,
    findAllSmall: `${BASE_URL}/video-info/find-all-small`,
    findAllParentTitle: `${BASE_URL}/video-info/find-all/parent-title`,
    findAllByParentTitle: `${BASE_URL}/video-info/find-all-by/parent-title`,
  },
  show: {
    findAll: `${BASE_URL}/show/find/all`,
    findRandom: `${BASE_URL}/show/find/random`,
    findByParentTitle: `${BASE_URL}/show/find`,
    findWithRootPath: `${BASE_URL}/show/find/with-root-path`,
  },
  stream: {
    normal: `${BASE_URL}/stream/normal`,
    convert: `${BASE_URL}/stream/convert`,
  },
  category: {
    findAll: `${BASE_URL}/category/find/all`,
  }

};
