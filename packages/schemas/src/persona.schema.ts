import { Schema, model, Document, Types } from 'mongoose';
import { ISkill } from './skill.schema';

export interface IPersona extends Document {
  name: string;
  description: string;
  systemPrompt: string;
  skills: Types.ObjectId[] | ISkill[];
  createdAt: Date;
  updatedAt: Date;
}

const PersonaSchema = new Schema<IPersona>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  systemPrompt: { type: String, required: true },
  skills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
}, { timestamps: true });

export const Persona = model<IPersona>('Persona', PersonaSchema); 