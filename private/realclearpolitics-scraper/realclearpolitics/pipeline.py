from scrapy.exceptions import DropItem
import json

class PoolPipeline(object):

	def process_item(self, item, spider):
		line = json.dumps(dict(item))
		print(line)
		return item
