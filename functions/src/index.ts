import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()
const db = admin.firestore()

// Create a user in firestore each time a new user signs up
export const createUserDocument = functions.auth
  .user()
  .onCreate(async (user) => {
    // Keeping only data we actually need
    const newUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      providerData: user.providerData,
    }

    db.collection('users').doc(user.uid).set(newUser)
  })
