import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class AuthProvider {

  constructor() { }

  /**
   * loginUser takes in an email and password and signs the user into the application.
   */
  loginUser(email: string, password: string): firebase.Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  /**
   * signupUser takes in an email and password and does 3 things:
   * 1. It creates the new user.
   * 2. It signs the user into the application.
   * 3. It creates a database node for the user to store the userProfile, which starts with just
   *    the email address.
   */
  signupUser(email: string, password: string): firebase.Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password).then((newUser) => {
      firebase.database().ref('/userProfile').child(newUser.uid).set({
        email: email
      });
    });
  }

  /**
   * sets the display name for the new user and set's it to 
   * firebase
   */
  setDisplayName(displayName: string) {
    return firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        user.updateProfile({
          displayName:displayName
        }).then(function () {
          // Update successful.
        }, function (error) {
          // An error happened.
        });

      } else {
        // No user is signed in.
      }
    });
  }

  /**
   * resetPassword takes the email address as a string and sends the email with the reset password 
   * link.
   */
  resetPassword(email: string): firebase.Promise<any> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  /**
   * logoutUser doesn't take any parameters, it looks into the authentication object and signs out
   * the currently logged in user.
   */
  logoutUser(): firebase.Promise<any> {
    return firebase.auth().signOut();
  }

}
