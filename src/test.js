'use strict';

const Crawler = require('./crawler');

const rootUrls = [
  'http://news.google.com',
  'http://harvix.com',
  'http://en.wikipedia.com'
];

const crawler = new Crawler({
  roots: rootUrls,
  maxWorkers: 10  
});
