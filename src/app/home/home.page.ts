import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  items: Observable<any[]>;

  constructor(private firestore: AngularFirestore) {
  }

  ngOnInit() {
    this.items = this.firestore.collection('influencer').valueChanges();
  }
}
