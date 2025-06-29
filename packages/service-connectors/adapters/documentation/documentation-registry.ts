export class DocumentationRegistry {
  constructor(config: any) {}
  async createDocument(doc: any) {
    return { id: 'doc_' + Date.now() };
  }
  async archiveDocument(id: string, reason: string, nodeClass: string) {
    return { success: true };
  }
} 