/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import { Schema, SchemaDefinition, SchemaOptions } from 'mongoose';

type BaseSchemaOptions = Omit<SchemaOptions, 'toObject'>;

export default class BaseSchema extends Schema {
  constructor(schema: SchemaDefinition, options: BaseSchemaOptions) {
    super(schema, options);

    this.set('toObject', {
      virtuals: true,
      transform: (doc, converted) => {
        delete converted._id;
        delete converted.__v;
      },
    });
  }
}
