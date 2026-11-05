import urllib.request,json,concurrent.futures,hashlib
from pathlib import Path
source='https://dummyjson.com/products?limit=0'
data=json.load(urllib.request.urlopen(urllib.request.Request(source,headers={"User-Agent":"EcoRecommend-demo"}),timeout=25))
def check(p):
 for url in dict.fromkeys([p['images'][0],p['thumbnail']]):
  try:
   with urllib.request.urlopen(urllib.request.Request(url,headers={"User-Agent":"EcoRecommend-demo"}),timeout=15) as r: content=r.read(); kind=r.headers.get('Content-Type','')
   if len(content)>1000 and kind.startswith('image/'):
    return p,url,hashlib.sha256(content).hexdigest(),len(content)
  except Exception: pass
 return None
with concurrent.futures.ThreadPoolExecutor(max_workers=16) as pool:checked=list(pool.map(check,data['products']))
seen=set();records=[]
for item in checked:
 if item and item[2] not in seen:
  p,url,digest,size=item;seen.add(digest);p['_photo']={'url':url,'sha256':digest,'bytes':size,'source':'https://dummyjson.com/docs/products','checkedAt':'2026-11-05'};records.append(p)
Path('src/data').mkdir(exist_ok=True)
Path('src/data/photo-products.json').write_text(json.dumps(records,ensure_ascii=False),encoding='utf-8')
print(json.dumps({'sourceRecords':len(data['products']),'verifiedUniquePhotos':len(records),'rejected':len(data['products'])-len(records)}))

