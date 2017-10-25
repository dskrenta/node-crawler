'use strict';

const fetch = require('node-fetch');
const cheerio = require('cheerio');
const validUrl = require('valid-url');

class Crawler {
  constructor({
    roots,
    maxWorkers = 2,
    maxTries = 4,
    maxRedirects = 10
  }) {
    this.roots = roots;
    this.maxWorkers = maxWorkers;
    this.maxTries = maxTries;
    this.maxRedirects = maxRedirects;
    this.seenUrls = new Set();
    this.crawlQueue = [];

    this.init();
  }

  init() {
    for (let root of this.roots) {
      this.enqueue(root);
    }

    this.startCrawl();
  }

  enqueue(url) {
    if (validUrl.isUri(url) && !this.seenUrls.has(url)) {
      this.crawlQueue.unshift(url);
    }
  }

  dequeue() {
    return this.crawlQueue.length > 0 ? this.crawlQueue.pop() : false;
  }

  async startCrawl() {
    try {
      const workers = this.crawlQueue.slice(0, this.maxWorkers - 1).map(root => this.crawl(root));
      await Promise.all(workers);
    }
    catch (error) {
      console.error(error);
    }
  }

  async crawl(url) {
    try {
      const request = await fetch(url, {
        redirect: 'follow',
        follow: this.maxRedirects
      });
      const body = await request.text();

      console.log(url);

      this.parse(body);
      this.seenUrls.add(url);

      let nextUrl = this.dequeue();
      if (nextUrl) this.crawl(nextUrl);
    }
    catch (error) {
      console.error(error);
    }
  }

  parse(body) {
    const $ = cheerio.load(body);
    $('a').each((i, element) => {
      this.enqueue($(element).attr('href'));
    })
  }
}

module.exports = Crawler;
