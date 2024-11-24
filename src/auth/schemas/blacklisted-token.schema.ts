import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlacklistedTokenDocument = BlacklistedToken & Document;

@Schema({ timestamps: true })
export class BlacklistedToken {
  @Prop({ required: true })
  token: string;
}

export const BlacklistedTokenSchema = SchemaFactory.createForClass(BlacklistedToken);