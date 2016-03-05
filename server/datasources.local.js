'use strict';
// mongodb
let MONGODB_URL = process.env.MONGODB_URL || null;

if (MONGODB_URL) {
  module.exports = {
    db: {
      name: 'db',
      connector: 'loopback-connector-mongodb',
      url: MONGODB_URL
    }
  };
}

// mailcatcher
if (process.env.MAIL_SMTP_HOST) {
  module.exports = {
    mail: {
      name: 'mail',
      connector: 'mail',
      transports: [
        {
          "type": "smtp",
          "host": process.env.MAIL_SMTP_HOST,
          "port": process.env.MAIL_SMTP_POR,
          "secure": false
        }
      ]
    }
  };
}


// s3ninja
// if (process.env.S3_9191_HOST) {
//   module.exports = {
//     storage: {
//       name: 'storage',
//       "connector": "loopback-component-storage",
//       "provider": "amazon",
//       "key": "AKIAIOSFODNN7EXAMPLE",
//       "keyId": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
//     }
//   };
// } else {
//   module.exports = {
//     storage: {
//       provider: 'filesystem',
//       root: './tmp/storage'
//     }
//   };
// }
