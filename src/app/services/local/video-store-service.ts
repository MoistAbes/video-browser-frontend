// import { Injectable } from '@angular/core';
// import {BehaviorSubject, filter, Observable} from 'rxjs';
// import {VideoInfoApiService} from '../api/video-info-api-service';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class VideoStoreService {
//   private videoListSubject = new BehaviorSubject<VideoInfoModel[] | null>(null);
//   public videoList$ = this.videoListSubject.asObservable();
//
//   constructor(private videoInfoApiService: VideoInfoApiService) {}
//
//   // fetchVideos(): void {
//   //   if (this.videoListSubject.getValue() == null) {
//   //     this.videoInfoApiService.findAllVideoInfo().subscribe({
//   //       next: (data) => {
//   //         this.videoListSubject.next(data);
//   //       },
//   //       error: (err) => {
//   //         console.error('Error loading video list:', err);
//   //         this.videoListSubject.next([]); // fallback
//   //       }
//   //     });
//   //   }
//   // }
//
//   getAllVideos(): Observable<VideoInfoModel[]> {
//     if (this.videoListSubject.getValue() === null) {
//       this.videoInfoApiService.findAllVideoInfo().subscribe({
//         next: (data) => this.videoListSubject.next(data),
//         error: (err) => {
//           console.error('Error loading video list:', err);
//           this.videoListSubject.next([]);
//         }
//       });
//     }
//
//     return this.videoList$.pipe(
//       filter((videos): videos is VideoInfoModel[] => videos !== null)
//     );
//   }
//
//
//   getCurrentList(): VideoInfoModel[] | null {
//     return this.videoListSubject.getValue();
//   }
//
//   getById(id: number): VideoInfoModel | null {
//     return this.getCurrentList()?.find(video => video.id === id) || null;
//   }
//
// }
