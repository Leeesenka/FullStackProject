module.exports = {
    transform: {
      "^.+\\.jsx?$": "babel-jest"
    },
    transformIgnorePatterns: [
      "/node_modules/(?!axios/)",
      'node_modules/(?!(react-router-dom)/)',
    ],
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy"
    },
    transformIgnorePatterns: [
        "/node_modules/(?!axios)"
    ]
};

