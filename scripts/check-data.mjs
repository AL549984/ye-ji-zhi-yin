import { productData } from '../src/data/product-data.js';

const requiredMetricLabels = ['上市公司目录', '业绩指引事件', '来源资料', '产业信号', '覆盖交易所/上市地'];
const metricLabels = productData.metrics.map(item => item.label);
const missingMetrics = requiredMetricLabels.filter(label => !metricLabels.includes(label));
if (missingMetrics.length) throw new Error(`Missing metrics: ${missingMetrics.join(', ')}`);

if (productData.sampleEvents.length < 5) throw new Error('Need at least 5 sample events for commercial page.');
if (!productData.docUrl.includes('feishu.cn/wiki/')) throw new Error('Official document URL should point to the Wiki link.');
if (!productData.baseUrl.includes('feishu.cn/base/')) throw new Error('Base URL should point to Feishu Base.');
if (!productData.lastUpdated) throw new Error('Missing lastUpdated label.');
if (!Array.isArray(productData.methodology) || productData.methodology.length < 3) throw new Error('Need at least 3 methodology cards.');

for (const item of productData.completeness) {
  if (item.value !== '36/36') throw new Error(`Completeness not full for ${item.label}: ${item.value}`);
}

const requiredEventFields = [
  'company',
  'ticker',
  'region',
  'sector',
  'eventType',
  'strength',
  'direction',
  'impactChain',
  'relatedLinks',
  'confidence',
  'date',
  'signal',
  'excerpt',
  'interpretation',
  'source',
  'sourceUrl',
  'recordUrl'
];
for (const item of productData.sampleEvents) {
  const missingFields = requiredEventFields.filter(field => !item[field]);
  if (missingFields.length) throw new Error(`Missing event fields for ${item.company || 'unknown'}: ${missingFields.join(', ')}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date)) throw new Error(`Invalid event date for ${item.company}: ${item.date}`);
  if (!item.sourceUrl.startsWith('https://')) throw new Error(`Invalid source URL for ${item.company}: ${item.sourceUrl}`);
  if (!item.recordUrl.includes('feishu.cn/base/')) throw new Error(`Invalid Base record URL for ${item.company}: ${item.recordUrl}`);
}

console.log('PASS data contract');
