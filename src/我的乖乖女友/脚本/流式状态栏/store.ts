import { Schema } from '../../schema';
import { defineMvuDataStore } from '@util/mvu';

export function useDataStore(messageId: number) {
  return defineMvuDataStore(Schema, { type: 'message', message_id: messageId })();
}
