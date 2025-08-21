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
    image: `${BASE_URL}/videos/image`,
    scan: `${BASE_URL}/videos/scan`,
    thumbnails: `${BASE_URL}/videos/thumbnails`,
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
  user: {
    friends: `${BASE_URL}/users/friends`,
  }

};
