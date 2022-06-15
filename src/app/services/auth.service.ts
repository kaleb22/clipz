import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import IUser from '../modals/user.modal';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;

  //injecting angularFire services
  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
    this.usersCollection = db.collection('users');
   }


  public async createUser(userData: IUser) {

    if(!userData.password) {
      throw new Error("Password not provided!");
    }
    //using ! (not null operator) to ensure typescript that email and password will always be string.
    const userCredential = await this.auth.createUserWithEmailAndPassword(userData.email, userData.password);
    console.log(userCredential);
    
    await this.usersCollection.add({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber
    });
  }
}
