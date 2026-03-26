import cron from 'node-cron';
import { aggregateDaily } from '../services/visitorService.js';

// Run daily at 00:05 AM
cron.schedule('5 0 * * *', async () => {
  console.log('[Aggregator] Running daily aggregation job...');
  try {
    const result = await aggregateDaily();
    console.log('[Aggregator] Complete:', result);
  } catch (err) {
    console.error('[Aggregator] Error:', err);
  }
}, { timezone: 'Asia/Kolkata' });

console.log('[Aggregator] Daily aggregation job scheduled (00:05 IST)');
