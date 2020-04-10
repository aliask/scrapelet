# Scrapelet

Collect data from pages using the active browser session.
Useful for difficult-to-scrape pages where selenium or other traditional scraping methods do not work.

## How it works

Scrapelet runs as a bookmarklet, which executes some Javascript on the page you are viewing. 

This Javascript can read the contents of the page, find the element you're interested in and send this HTML data to a HTTP endpoint for further processing and storage.

This approach is useful for sites with advanced scraping detection & prevenetion mechanisms. Because the bookmarklet piggy-backs on the page the user has already loaded, it doesn't make any further requests. This makes it invisible to the target server, and puts no extra strain on it.

The current implementation only searches the current page, so it's only really useful where a small number of pages are required to be scraped. 

## Real World Example - Sending property information to a Google Spreadsheet

![scrapelet screenshot](/scrapelet.png)

Real estate websites are protective of their information, as they may offer paid services to access this info. Scraping is often against the terms of service, so an alternative method is needed.

Scrapelet grabs the heading with all the property stats, and shoots this across to the spreadsheet script. This picks out the relevant information and adds a row to the table.

## Getting Started

1. Create a Google Spreadsheet to dump data into
    1. Add the example [gsheet.gs](src/gsheet.gs) code to your spreadsheet script (Tools->Script Editor)
    2. [Publish as a Web App](https://developers.google.com/apps-script/guides/web)
2. Build bookmarklet
    1. Update `config.js` to point to your Web App URL `https://script.google.com/.../exec`
    2. Run `npm install`, then `npm run build`
    3. Grab the the output from `dist/scrapelet.js` and create as a bookmark in your browser
3. Browse to the page you want to scrape and click the bookmarklet

If all went well, you should have a new row in your table. Tweak the sheets script to extract the data you need!

```
$ npm install
$ npm run build
```

## Author

Will Robertson <contact@willrobertson.id.au>

## License

This project is licensed under an ISC license - see the [LICENSE.md](LICENSE.md) file for details.