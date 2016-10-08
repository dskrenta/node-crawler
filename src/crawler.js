'use strict';

const parse = require('url-parse');
const validUrl = require('valid-url');

class Crawler {
  constructor (roots, maxWorkers = 10, maxTries = 4, maxRedirects = 10) {
    this.roots = roots;
    this.maxWorkers = maxWorkers;
    this.maxTries = maxTries;
    this.maxRedirects = maxRedirects;
    this.seenUrls = new Set();
    this.queue = [];
    this.done = [];
    this.startTime = new Date().getTime()
    this.endTime = null;
    this.rootDomains = new Set();

    for (let i = 0; i < self.roots.length; i++) {
      this.addUrl(self.roots[i]);
      let parsed = parse(self.roots[i]);
      if (validUrl.isUri(self.roots[i]) && !this.rootDomains.has(parsed.hostname)) {
        this.rootDomains.add(parsed.hostname);
      }
    }

    this.crawl()
  }

// crawl task should be an async function
  crawlTask (url) {
    return new Promise((resolve, reject) => {
      // do stuff
      resolve(this.queue.shift());
    });
  }

  recurse (url) {
    if (!url) return;
    let next = this.crawlTask(url);
    return next.then(nextUrl => recurse(nextUrl));
  }

  crawl () {
    let startUrls = [];
    for (let i = 0; i < this.queue.length; i++) {
      if (i < (this.maxWorkers - 1)) {
        startUrls.push(recurse(this.queue[i]));
      }
    }
    Promise.all(startUrls);
  }

  addUrl (url) {
    if (!self.seenUrls.has(url) && validUrl.isUri(url)) {
      self.queue.push(url);
    }
  }
}
