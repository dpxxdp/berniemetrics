import scrapy
from realclearpolitics.items import TableItem

class RcpSpider(scrapy.Spider):
    name = "realclearpoliticsSpider"
    start_urls = []

    def __init__(self, url, state_code):
        self.url = url
        self.state_code = state_code

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
            values = line.css('td::text, td span::text, td a::text').extract()
            for i in range(nb_fields):
                item[fieldNames[i]] = values[i]
            item['locale'] = self.state_code
            items.append(item)

        return items
