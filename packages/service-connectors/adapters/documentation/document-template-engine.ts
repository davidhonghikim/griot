export class DocumentTemplateEngine {
  constructor(config: any) {}
  async generateDocument(request: any, nodeClass: string) {
    return request.content;
  }
} 