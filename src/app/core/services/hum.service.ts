import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class HumService {
  humLinkVisits: Observable<any[]>;
  productLinkClicks: Observable<any[]>;
  humVideoPlayStats: Observable<any[]>;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
    })
  };

  constructor(
    public http: HttpClient,
    private firestore: AngularFirestore,
  ) {
  }

  fetchHumVisitsStats(influencerId: string, videoName = 'test_video'): Observable<any> {
    this.humLinkVisits = this.firestore.collection('visits', ref => ref.where('influencerId', '==', influencerId)).valueChanges();
    console.log('fetching view stats...');
    return this.humLinkVisits;
  }

  fetchProductClickStats(): Observable<any> {
    return this.http.get(`/user/subscriptions`);
  }

  fetchVideoPlaysStats(): Observable<any> {
    return this.http.get(`/user/subscriptions`);
  }
}

