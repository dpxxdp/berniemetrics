import os, scrapy, argparse
from realclearpolitics.spiders.spider import RcpSpider
from scrapy.crawler import CrawlerProcess
parser = argparse.ArgumentParser('Scrap realclearpolitics polls data')
parser.add_argument('url', action="store")
parser.add_argument('--locale', action="store", default='')
parser.add_argument('--race', action="store", default='primary')
parser.add_argument('--csv', dest='to_csv', action='store_true')
parser.add_argument('--output', dest='output', action='store')
args = parser.parse_args()
url = args.url
extra_fields = { 'locale': args.locale, 'race': args.race }

if (args.to_csv):
    if args.output is None:
        filename = url.split('/')[-1].split('.')[0]
        output = filename + ".csv"
        print("No output file specified : using " + output)
    else:
        output = args.output
        if not output.endswith(".csv"):
            output = output + ".csv"
    if os.path.isfile(output):
        os.remove(output)
    os.system("scrapy crawl realclearpoliticsSpider -a url="+url+" -o "+output)

else:
    settings = {
        'ITEM_PIPELINES' : {
            'realclearpolitics.pipeline.PollPipeline': 300,
        },
        'LOG_LEVEL' : 'ERROR',
        'DOWNLOAD_HANDLERS' : {'s3': None,}
    }

    process = CrawlerProcess(settings);
    process.crawl(RcpSpider, url, extra_fields)
    process.start()
