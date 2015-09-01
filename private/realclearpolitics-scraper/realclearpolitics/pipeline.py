from scrapy.exceptions import DropItem
import json

class PollPipeline(object):

	def process_item(self, item, spider):
		dateString = item['Date']
		[startDate, endDate] = map(lambda s: s.strip(), dateString.split('-'))
		item['startDate'] = startDate
		item['endDate'] = endDate
		del item['Date']
		line = json.dumps(dict(item))
		print(line)
		return item
