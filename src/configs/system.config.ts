export default () => ({
  system: {
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT || '3001',
  },
});
