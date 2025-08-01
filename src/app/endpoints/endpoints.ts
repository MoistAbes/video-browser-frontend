// const BASE_URL = 'http://192.168.15.13:8080';
// const BASE_URL = 'http://192.168.108.13:8080';
const BASE_URL = '';

export const Endpoints = {
  videos: {
    base: `${BASE_URL}/videos`,
    stream: `${BASE_URL}/videos/stream`,
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
}

};
