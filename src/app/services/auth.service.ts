import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, map, delay } from 'rxjs';
import IUser from '../modals/user.modal';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;

  //injecting angularFire services
  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
    this.usersCollection = db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(
      map(user => !!user)
    );

    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(1000)
    )
   }


  public async createUser(userData: IUser) {

    if(!userData.password) {
      throw new Error("Password not provided!");
    }
    //using ! (not null operator) to ensure typescript that email and password will always be string.
    const userCredential = await this.auth.createUserWithEmailAndPassword(userData.email, userData.password);
    console.log(userCredential);
    
    if(!userCredential.user) {
      throw new Error("The user cannot be found!");
    }

    await this.usersCollection.doc(userCredential.user.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber
    });

    await userCredential.user.updateProfile({
      displayName: userData.name
    });
  }
}
