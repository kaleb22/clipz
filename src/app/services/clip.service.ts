import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import IClip from '../modals/clip.modal';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, of, map, BehaviorSubject, combineLatest, combineAll, timestamp } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class ClipService {

  public clipsCollection: AngularFirestoreCollection<IClip>;
  pagesClip: IClip[] = [];
  pendingRequest = false;

  constructor(
    private db: AngularFirestore, 
    private auth: AngularFireAuth,
    private storage: AngularFireStorage) {
    this.clipsCollection = db.collection('clips');
   }

  createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return this.clipsCollection.add(data);
  }

  getUserClips(sort$: BehaviorSubject<string>) {
    return combineLatest([
      this.auth.user,
      sort$
    ]).pipe(
      switchMap(values => {
        const [user, sort] = values;
        if(!user) {
          return of([])
        }

        const query = this.clipsCollection.ref.where(
          'uid', '==', user.uid
        ).orderBy(
          'timeStamp',
          sort === 'd' ? 'desc' : 'asc'
        )

        return query.get();
      }),
      map(snapshot => (snapshot as QuerySnapshot<IClip>).docs)
    )
  }

  updateClip(id: string, title: string) {
    return this.clipsCollection.doc(id).update({
      title
    });
  }

  async deleteClip(clip: IClip) {
    const clipRef = this.storage.ref(`clips/${clip.fileName}`);
    const screenshotRef = this.storage.ref(
      `screenshots/${clip.screenshotFileName}`
    );

    await clipRef.delete();
    
    await screenshotRef.delete();

    await this.clipsCollection.doc(clip.docId).delete();
  }

  async getClips() {

    if(this.pendingRequest) {
      return;
    }

    this.pendingRequest = true;

    let query = this.clipsCollection.ref.orderBy('timeStamp', 'desc').limit(6);

    const { length } = this.pagesClip;

    if(length) {
      const lastDocId = this.pagesClip[length - 1].docId;
      const lastDoc = await this.clipsCollection.doc(lastDocId).get().toPromise();

      query = query.startAfter(lastDoc);
    }

    const snapshot = await query.get();

    snapshot.forEach(doc => {
      this.pagesClip.push({
        docId: doc.id,
        ...doc.data()
      })
    });

    this.pendingRequest = false;
  }
}
