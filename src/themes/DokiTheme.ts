import ThemeType = browser._manifest.ThemeType;

export interface Colors {
  "caretRow": string;
  "lineNumberColor": string;
  "infoForeground": string;
  "baseIconColor": string;
  "contrastColor": string;
  "nonProjectFileScopeColor": string;
  "secondaryBackground": string;
  "selectionForeground": string;
  "headerColor": string;
  "baseBackground": string;
  "borderColor": string;
  "buttonColor": string;
  "selectionInactive": string;
  "identifierHighlight": string;
  "selectionBackground": string;
  "searchBackground": string;
  "searchForeground": string;
  "buttonFont": string;
  "foregroundColor": string;
  "startColor": string;
  "highlightColor": string;
  "disabledColor": string;
  "accentColorTransparent": string;
  "accentColorLessTransparent": string;
  "accentColorMoreTransparent": string;
  "accentColor": string;
  "accentContrastColor": string;
  "stopColor": string;
  "testScopeColor": string;
  "popupMask": string;
  "codeBlock": string;
  "textEditorBackground": string;
  "foldedTextBackground": string;
  "comments": string;
  "unusedColor": string;
  "constantColor": string;
  "classNameColor": string;
  "htmlTagColor": string;
  "stringColor": string;
  "keyColor": string;
  "keywordColor": string;
  "diff.deleted": string;
  "diff.conflict": string;
  "diff.inserted": string;
  "diff.modified": string;
  "lightEditorColor": string;
  "breakpointColor": string;
  "breakpointActiveColor": string;
  "fileBlue": string;
  "fileGray": string;
  "fileRose": string;
  "fileOrange": string;
  "fileViolet": string;
  "fileYellow": string;
  "fileRed": string;
  "filePurple": string;
  "editorAccentColor": string;

  [key: string]: string;
}

export interface DokiThemeDefinition {
  information: any;
  fireFoxTheme: any;
  colors: Colors;
}

export enum ContentType {
  PRIMARY, SECONDARY
}

export class CharacterTheme {

  constructor(private readonly dokiDefinitions: DokiThemeDefinition[]) {
  }

  public get name(): string {
    return this.dokiDefinitions
      .map(def => def.information.conflictName || def.information.displayName)
      .find(Boolean);
  }

  public get hasSecondaryContent(): string {
    return this.dokiDefinitions
      .map(def => def.information.stickers.secondary)
      .find(Boolean);
  }


}


export class DokiTheme {

  constructor(private readonly dokiDefinition: DokiThemeDefinition) {
  }

  public get themeId(): string {
    return this.dokiDefinition.information.id;
  }

  public get colors(): Colors {
    return this.dokiDefinition.colors;
  }

  public get browserTheme(): ThemeType {
    return this.dokiDefinition.fireFoxTheme;
  }
}
