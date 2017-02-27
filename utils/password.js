import bcrypt from 'bcrypt';

export  function cryptPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function(err, salt) {
      if (err)
        return reject(err);
      bcrypt.hash(password, salt, function(err, hash) {
        if (err)
          return reject(err);
        resolve(hash);
      });

    });
  });
};

export  function comparePasswords(password, userPassword, callback) {
  bcrypt.compare(password, userPassword, function(err, isPasswordMatch) {
    if (err)
      return callback(err);
    return callback(null, isPasswordMatch);
  });
};