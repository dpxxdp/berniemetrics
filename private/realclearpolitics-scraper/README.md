A small tool to scrap www.realclearpolitics.com/ poll datas

Installing
==========

Dependencies
-------------------
The scraper depends on scrapy and python-twisted. Make sure they are installed on your machine before starting.

## Ubuntu

```sh
pip install scrapy
sudo apt-get install python-twisted
```


Integration to the application
==========

To scrape all the data from `http://www.realclearpolitics.com/`, call the `scrapeRCP()` function inside [`/private/pollScraper.js`](../pollScraper.js).

The output will be sent to a callback function defined as an argument of `PythonShell.run()` in [`pollScrapper.js#21`](../pollScraper.js#L21)

Url to specific poll result pages are stored in [`/private/rcp-paths.js`](../rcp-paths.js). 
