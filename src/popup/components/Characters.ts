import { CharacterTheme, DokiThemeDefinition } from "../../themes/DokiTheme";
import DokiThemeDefinitions from "../../DokiThemeDefinitions";


export const characterThemes: CharacterTheme[] =
  Object.values(
    Object.values(DokiThemeDefinitions)
      .reduce((accum, dokiDefinition: DokiThemeDefinition) => {
        const characterId = dokiDefinition.information.characterId;
        if (!accum[characterId]) {
          accum[characterId] = [];
        }

        accum[characterId].push(dokiDefinition);
        return accum;
      }, {} as { [key: string]: DokiThemeDefinition[] }))
    .map(dokiDefs => new CharacterTheme(dokiDefs));
