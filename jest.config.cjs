module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom", // Make sure this is set correctly
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  moduleNameMapper: {
    "\\.(css|scss|sass|less)$": "identity-obj-proxy", // Mock CSS imports
  },
};
