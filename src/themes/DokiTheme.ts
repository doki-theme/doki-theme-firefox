import ThemeType = browser._manifest.ThemeType;

export interface DokiThemeDefinition {
  information: any;
  fireFoxTheme: any;
  colors: any;
}

export class CharacterThemes {

  constructor(private readonly dokiDefinitions: DokiThemeDefinition[]) {
  }

}

export class DokiTheme {

  constructor(private readonly dokiDefinition: DokiThemeDefinition) {
  }

  public get themeId(): string {
    return this.dokiDefinition.information.id;
  }

  public get colors(): { [key: string]: string } {
    return this.dokiDefinition.colors;
  }

  public get browserTheme(): ThemeType {
    return this.dokiDefinition.fireFoxTheme;
  }
}
