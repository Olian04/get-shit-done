const ghpages = require('gh-pages');
const path = require('path');

const buildPath = path.join(__dirname, '..', 'dist');
ghpages.publish(buildPath, (err) => {
  if (err) {
    throw err;
  };
});
