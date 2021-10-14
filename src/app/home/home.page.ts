import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {ActivatedRoute} from '@angular/router';
import {switchMap, takeUntil} from 'rxjs/operators';
import {UtilService} from '../core/services/util.service';
import {HumService} from '../core/services/hum.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  items: Observable<any[]>;
  isLoading = true;
  destroy$ = new Subject<void>();

  constructor(private firestore: AngularFirestore,
              private route: ActivatedRoute,
              private util: UtilService,
              private hum: HumService
  ) {
  }

  ngOnInit() {
    console.log('stats home page');
    this.items = this.firestore.collection('influencer').valueChanges();
    this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      switchMap((paramMap) => {
        if (!paramMap.has('id')) {
          this.util.goToNew('/not-found');
          return of(false);
        }
        const influencerId = paramMap.get('id');
        console.log(`param - ${influencerId}`);
        return this.hum.fetchHumVisitsStats(influencerId);
      })
    ).subscribe((humVisits: any[]) => {
      const uniqueVideos = new Set();
      console.log(humVisits);
      if (humVisits.length) {
        humVisits.forEach((visitItem) => {
          uniqueVideos.add(visitItem.videoName);
        });
        const videoNames = uniqueVideos.values();
        const videoVisits = Array.from(videoNames).map((videoName: string) => {
          console.log(videoName);
          return humVisits.filter((visit) => visit.videoName === videoName);
        });
        console.log(videoVisits);
      }
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
