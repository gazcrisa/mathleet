import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

admin.initializeApp();
const db = admin.firestore();

const customConfig: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: "_",
  length: 2,
};

export const createUserDocument = functions.auth
  .user()
  .onCreate(async (user) => {
    const {uid, email} = user
    const generatedName = uniqueNamesGenerator(customConfig);
    db.collection("users")
      .doc(uid)
      .set({uid, email, displayName: generatedName});
  });
