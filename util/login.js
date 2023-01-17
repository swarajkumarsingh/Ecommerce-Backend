/* eslint-disable prefer-promise-reject-errors */
const axios = require("axios").default;
const firebase = require("firebase-admin");
const FirebaseSDKConfig = require("../firebase_sdk.json");

module.exports.verifyAccessToken = async (accessToken, method) => {
  return new Promise(async (resolve) => {
    const url = `https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`;
    console.log(url);

    axios
      .get(url)
      .then((body) => {
        const response = body.data;
        if ("error" in response) {
          console.log(`Error verifying access token: ${response.error}`);
          return resolve();
        }
        resolve({
          email: response.email,
          expires_on: response.exp,
          expires_in: response.expires_in,
        });
      })
      .catch((err) => {
        console.log(`Error verifying access token: ${err}`);
        return resolve();
      });
  });
};

// const accessToken = `ya29.a0AVA9y1s4H5wqPmzFdew5NWlXGJibqE9a6IkLsGWoh3fQDd8F-0yeLbQGWvTr78qti2Nhjo5kCpAtoJrLP1I6t7_caWheE8FbUGdsR68xTTcfi5cN2DGpkJPoKgIvBS_dwhp1yVJmeFXBAVikPsxux9RVJ7NvKAaCgYKATASAQASFQE65dr8s139zCdiGz0zIx6zGGQ0dQ0165`;
// module.exports.verifyAccessToken(accessToken).then((d) => console.log(d));

/**
 * 
 * @param {*} idToken 
 * @returns FirebaseIdentityObject or unefined
 FirebaseIdentityObject: {
  "phone": "+919934000000",
  "name": "Abhishek Singh",
  "iss": "https://securetoken.google.com/samaj-apps",
  "aud": "samaj-apps",
  "auth_time": 1670949562,
  "user_id": "638d560a1ae5ddd743624df8",
  "sub": "638d560a1ae5ddd743624df8",
  "iat": 1670949563,
  "exp": 1670953163,
  "firebase": {
    "identities": {},
    "sign_in_provider": "custom"
  },
  "uid": "638d560a1ae5ddd743624df8"
}
 */

module.exports.verifyIdToken = async (idToken) => {
  return new Promise(async (resolve) => {
    firebase
      .auth()
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        if (
          !decodedToken ||
          !("aud" in decodedToken) ||
          decodedToken.aud !== FirebaseSDKConfig.project_id
        ) {
          throw Error("Invalid token");
        }
        resolve(decodedToken);
      })
      .catch((error) => {
        console.log(`Error Validating id Token, ${error}`);
        resolve();
      });
  });
};

// const idToken =
//   "eyJhbGciOiJSUzI1NiIsImtpZCI6ImE4YmZhNzU2NDk4ZmRjNTZlNmVmODQ4YWY5NTI5ZThiZWZkZDM3NDUiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTXRhcHAgVGVzdGluZyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BSXRidm1udHY0Vk5lTF9yTldrMUNDU2dMWTZzMHhSamZYa1dxb010Vzljdj1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9pbnRlcm5hZGRhLTUyZDQ4IiwiYXVkIjoiaW50ZXJuYWRkYS01MmQ0OCIsImF1dGhfdGltZSI6MTY2MTY5OTc4MywidXNlcl9pZCI6IjN2bFVGMXpad1pnbmlkT252eGdBNGJ1c3E2MTMiLCJzdWIiOiIzdmxVRjF6WndaZ25pZE9udnhnQTRidXNxNjEzIiwiaWF0IjoxNjYxNjk5NzgzLCJleHAiOjE2NjE3MDMzODMsImVtYWlsIjoibWFndGFwcHRlc3RAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMDgyMjY0Nzg1MDgzNTYzODk5MzIiXSwiZW1haWwiOlsibWFndGFwcHRlc3RAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.az3CCZTpzBEk_WeKOVrFDe2KbFeRuG3uaNWvHIyK6-HIsGlW8QvfGKMYwKPv5kDdMJZdZGTpHEl1iRmodPE4pi0QYb1lTfMasG51T889EkR2vFhg79hmwQ89a5z2euw_WJrSf3mD8mheAgoot4T6eHFOgkWwrkqD-z5Fe-T2_odF5DTeySc8b5aHHQ9hwDAEBHAKJtHqxqR2q5HtuDwEPFR2_8PZsjlg_NDvDsln8zRANDwlmvZokg4Dsury3lWiCmzFfaniwm3X74rdfEaIxvedfT8CvGHJHd87KagTNP28ODXNP8mTbNKVxgnXr1N5ET1OaQIt_p1RhzMQFOWJbg";
// module.exports
//   .verifyIdToken(idToken)
//   .then((d) => console.log(JSON.stringify(d, null, 2)));

module.exports.createLoginToken = async (userId, userInfo) => {
  return new Promise(async (resolve, reject) => {
    firebase
      .auth()
      .createCustomToken(userId, userInfo)
      .then((token) => {
        resolve(token);
      })
      .catch((error) => {
        console.log(`Error Creating Logic Token, ${error}`);
        reject();
      });
  });
};

// const userId = "638d560a1ae5ddd743624df8";
// module.exports
//   .createLoginToken(userId, {
//     phone: "+919934987239",
//     name: "Abhishek Singh",
//   })
//   .then((d) => console.log(JSON.stringify(d, null, 2)));
