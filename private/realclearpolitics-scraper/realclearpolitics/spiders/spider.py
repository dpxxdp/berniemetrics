import scrapy
from realclearpolitics.items import TableItem

class RcpSpider(scrapy.Spider):
    name = "realclearpoliticsSpider"
    start_urls = []
    columns = ['Poll','Date', 'Sample', 'Spread']

    def __init__(self, url, extra_fields = {}):
        self.url = url
        self.extra_fields = extra_fields

    def start_requests(self):
        return [scrapy.FormRequest(self.url,
                               callback=self.parse)]


    def parse(self, response):
        table = response.css('.data').pop()
        legend = table.css('tr')[0]
        fieldNames = legend.css('th::text').extract()
        nb_fields = len(fieldNames)
        items = []

        contentLines = table.css('tr')[1::]

        for line in contentLines:
            item = TableItem()
            item['field'] = {}
            values = line.css('td::text, td span::text, td a::text').extract()
            for i in range(nb_fields):
                if fieldNames[i] in RcpSpider.columns:
                    item[fieldNames[i]] = values[i]
                elif values[i] != '--':
                    item['field'][fieldNames[i]] = values[i]

            for fieldName, value in self.extra_fields.iteritems():
                item[fieldName] = value

            items.append(item)

        return items
