import { Schema, model, Document } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  description: string;
  category: string;
  code: string; // Could be a script, a command, or a function body
  parameters: {
    name: string;
    type: string;
    description: 'string';
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: String, required: true, index: true },
  code: { type: String, required: true },
  parameters: [{
    name: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
  }],
}, { timestamps: true });

export const Skill = model<ISkill>('Skill', SkillSchema); 