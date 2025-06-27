/**
 * {{className}}
 *
 * {{description}}
 */
export class {{className}} {
  constructor({{#if constructorArgs}}{{constructorArgs}}{{/if}}) {
    // TODO: initialize
  }

  /**
   * Execute primary action.
   */
  public async execute(params: {{paramsType}}): Promise<{{returnType}}> {
    // TODO: implement
    return {} as any;
  }
}
