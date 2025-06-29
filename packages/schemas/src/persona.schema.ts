import { Schema, model, Document, Types } from 'mongoose';

export interface IPersona extends Document {
  id: string;
  uuid: string;
  name: string;
  base: string;
  variant: string;
  author: string;
  description: string;
  tags: string[];
  content: {
    yaml: string;
    parsed: any;
  };
  vectorId?: string;
  skills?: any[];
  recipes?: any[];
  knowledge?: any[];
  personality?: any;
  communication?: any;
  identity?: any;
  asset_preferences?: any;
  imports?: string[];
  version?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PersonaSchema = new Schema<IPersona>({
  id: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  uuid: { 
    type: String, 
    required: true,
    index: true 
  },
  name: { 
    type: String, 
    required: true,
    index: true 
  },
  base: { 
    type: String, 
    required: true,
    index: true 
  },
  variant: { 
    type: String, 
    required: true,
    index: true 
  },
  author: { 
    type: String, 
    required: true,
    index: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  tags: [{ 
    type: String,
    index: true 
  }],
  content: {
    yaml: { 
      type: String, 
      required: true 
    },
    parsed: { 
      type: Schema.Types.Mixed 
    }
  },
  vectorId: { 
    type: String
  },
  skills: [{ 
    type: Schema.Types.Mixed 
  }],
  recipes: [{ 
    type: Schema.Types.Mixed 
  }],
  knowledge: [{ 
    type: Schema.Types.Mixed 
  }],
  personality: { 
    type: Schema.Types.Mixed 
  },
  communication: { 
    type: Schema.Types.Mixed 
  },
  identity: { 
    type: Schema.Types.Mixed 
  },
  asset_preferences: { 
    type: Schema.Types.Mixed 
  },
  imports: [{ 
    type: String 
  }],
  version: { 
    type: String 
  },
}, { 
  timestamps: true,
  collection: 'personas'
});

// Create compound indexes for common queries
PersonaSchema.index({ base: 1, variant: 1 });
PersonaSchema.index({ author: 1, createdAt: -1 });
PersonaSchema.index({ tags: 1, base: 1 });
PersonaSchema.index({ vectorId: 1 }, { sparse: true });

// Add text search index for description and name
PersonaSchema.index({ 
  name: 'text', 
  description: 'text' 
});

export const Persona = model<IPersona>('Persona', PersonaSchema);

// Helper functions for persona operations
export class PersonaModelHelper {
  static async findByBase(base: string): Promise<IPersona[]> {
    return Persona.find({ base }).sort({ createdAt: -1 });
  }

  static async findByAuthor(author: string): Promise<IPersona[]> {
    return Persona.find({ author }).sort({ createdAt: -1 });
  }

  static async findByTags(tags: string[]): Promise<IPersona[]> {
    return Persona.find({ tags: { $in: tags } }).sort({ createdAt: -1 });
  }

  static async findByVectorId(vectorId: string): Promise<IPersona | null> {
    return Persona.findOne({ vectorId });
  }

  static async searchByText(query: string): Promise<IPersona[]> {
    return Persona.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });
  }

  static async getPersonaStats(): Promise<{
    total: number;
    byBase: Record<string, number>;
    byAuthor: Record<string, number>;
    withVectors: number;
  }> {
    const total = await Persona.countDocuments();
    const withVectors = await Persona.countDocuments({ vectorId: { $exists: true, $ne: null } });
    
    const byBase = await Persona.aggregate([
      { $group: { _id: '$base', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const byAuthor = await Persona.aggregate([
      { $group: { _id: '$author', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return {
      total,
      byBase: byBase.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
      byAuthor: byAuthor.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
      withVectors,
    };
  }
} 