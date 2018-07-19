'use strict';

import Realm from 'realm';

const userSchema = {
  name: 'users',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: {type: 'string', optional: true},
    connected: {type: 'bool', default: false},
    type: {type: 'string', optional: true},
    createdAt: { type: 'date', optional: true },
  }
};

const messageSchema = {
  name: 'messages',
  primaryKey: 'id',
  properties: {
    id: 'int',
    senderId: {type: 'string', optional: true},
    message: 'string',
    name: {type: 'string', optional: true},
    connected: {type: 'bool', default: false},
    type: {type: 'string', optional: true},
    createdAt: { type: 'date', optional: true },
  }
};

export default new Realm({
  schema: [userSchema, messageSchema]
});
