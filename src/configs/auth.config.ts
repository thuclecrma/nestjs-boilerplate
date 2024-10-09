import { AuthProvider } from 'src/commons/constants/auth-providers';

export default () => ({
  auth: {
    provider: process.env.AUTH_PROVIDER || AuthProvider.LOCAL,
    passwordHashSecret: process.env.AUTH_PASSWORD_HASH_SECRET,
    jwtSecret: process.env.AUTH_JWT_SECRET,
  },
});
