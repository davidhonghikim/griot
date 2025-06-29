export interface Persona {
    id: string;
    uuid: string;
    name: string;
    base: string;
    variant: string;
    author: string;
    description: string;
    tags: string[];
    skills?: any[];
    recipes?: any[];
    knowledge?: any[];
    personality?: any;
    communication?: any;
    identity?: any;
    asset_preferences?: any;
    imports?: string[];
    version?: string;
}
export declare class PersonaLoader {
    private personasPath;
    private indexPath;
    constructor();
    loadPersona(personaId: string): Promise<Persona | null>;
    listPersonas(): Promise<Persona[]>;
    savePersona(persona: Persona): Promise<void>;
    getPersonaCount(): Promise<number>;
    validatePersona(personaId: string): Promise<boolean>;
}
//# sourceMappingURL=persona_loader.d.ts.map