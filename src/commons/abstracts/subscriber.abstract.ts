import { EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export class AbstractSubscriber<T> implements EntitySubscriberInterface<T> {
  private _entityClass: new () => T;

  listenTo() {
    return this._entityClass;
  }

  beforeInsert(event: InsertEvent<T>) {
    if (!(event.entity as any).id) {
      (event.entity as any).id = uuidv4();
    }
  }
}
