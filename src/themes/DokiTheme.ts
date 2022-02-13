export interface DokiThemeDefinition {


}

export class CharacterThemes {

  constructor(private readonly dokiDefinitions: DokiThemeDefinition[]) {
  }

}

export class DokiTheme {

  constructor(private readonly dokiDefinitions: DokiThemeDefinition) {
  }

  public get themeId(): string {
    return "ayy lmao"
  }
}


class ThemeManager {

  getDefaultTheme(): DokiTheme {
    return new DokiTheme([]);
  }

  getCurrentThemeId() {
    return "8c99ec4b-fda0-4ab7-95ad-a6bf80c3924b";

  }

  getThemeById(themeId: string): DokiTheme {
    return new DokiTheme([]);
  }
}

export const ThemeManagerService = new ThemeManager();
