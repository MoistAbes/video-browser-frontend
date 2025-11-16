import { environment } from "../../environments/environment";

const BASE_URL = environment.baseUrl;


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
  },
  show: {
    findById: `${BASE_URL}/show/find/id/`,
    findAll: `${BASE_URL}/show/find/all`,
    findRandom: `${BASE_URL}/show/find/random`,
    findRandomByStructure: `${BASE_URL}/show/find/random/structure`,
    findRandomShowsByStructureAndGroupedByGenre: `${BASE_URL}/show/find/random/allGenres`,
    findByParentTitle: `${BASE_URL}/show/find`,
    findWithRootPath: `${BASE_URL}/show/find/with-root-path`,
    addGenre: `${BASE_URL}/add/genre/`,
    removeGenre: `${BASE_URL}/remove/genre/`,
    deleteShow: `${BASE_URL}/show/`,
    deleteAllShows: `${BASE_URL}/show/deleteAll`
  },
  stream: {
    normal: `${BASE_URL}/stream/normal`,
    normalPreview: `${BASE_URL}/stream/normal/preview`,
    convert: `${BASE_URL}/stream/convert`,
    authorize: `${BASE_URL}/stream/authorize`,
  },
  user: {
    friends: `${BASE_URL}/users/friends`,
    userInfo: `${BASE_URL}/users/userInfo`,
    updateIcon: `${BASE_URL}/users/update/icon/`,
    findAll: `${BASE_URL}/users/`,
  },
  userIcon: {
    findAll: `${BASE_URL}/user-icon/find-all`,
  },
  genre: {
    findAllNames: `${BASE_URL}/genre/find/all/names`,
    findAll: `${BASE_URL}/genre/find/all`,
    update: `${BASE_URL}/genre/update`,
  },
  mediaItem: {
    convertAudioCodec: `${BASE_URL}/mediaItem/convert/audio`
  }
};
