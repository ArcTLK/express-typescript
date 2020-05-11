import { prop, getModelForClass } from '@typegoose/typegoose';

class User {
  @prop({ required: true })
  name!: string;
  @prop({ unique: true, required: true })
  email!: string;
  @prop({ required: true })
  password!: string;
  @prop({ default: Date.now })
  createdOn!: Date;
}

export default getModelForClass(User);
