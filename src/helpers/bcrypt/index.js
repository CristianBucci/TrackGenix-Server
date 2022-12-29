import bcrypt from 'bcrypt';

const saltRounds = 8;

const hashPassword = (password) => bcrypt.hashSync(password, saltRounds);
const compareHashPassword = (password, hash) => bcrypt.compareSync(password, hash);

export {
  hashPassword,
  compareHashPassword,
};
