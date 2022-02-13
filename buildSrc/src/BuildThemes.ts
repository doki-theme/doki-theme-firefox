import {
  BaseAppDokiThemeDefinition,
  constructNamedColorTemplate,
  DokiThemeDefinitions,
  evaluateTemplates,
  MasterDokiThemeDefinition,
  resolveColor,
  resolvePaths,
  StringDictionary
} from "doki-build-source";
import omit from "lodash/omit";
import fs from "fs";
import path from "path";

type AppDokiThemeDefinition = BaseAppDokiThemeDefinition;

const {
  repoDirectory,
  masterThemeDefinitionDirectoryPath,
} = resolvePaths(__dirname);

type DokiThemeFirefox = BaseAppDokiThemeDefinition;

function buildColors(
  dokiThemeDefinition: MasterDokiThemeDefinition,
  dokiTemplateDefinitions: DokiThemeDefinitions,
  dokiThemeChromeDefinition: DokiThemeFirefox,
): StringDictionary<string> {
  const namedColors = constructNamedColorTemplate(
    dokiThemeDefinition, dokiTemplateDefinitions
  )
  const themeOverrides = dokiThemeChromeDefinition.overrides.theme &&
    dokiThemeChromeDefinition.overrides.theme.colors || {};
  const colorsOverride: StringDictionary<string> = {
    ...namedColors,
    ...themeOverrides,
    ...dokiThemeChromeDefinition.colors,
    editorAccentColor: dokiThemeDefinition.overrides?.editorScheme?.colors.accentColor ||
      dokiThemeDefinition.colors.accentColor
  }
  return Object.entries<string>(colorsOverride).reduce(
    (accum, [colorName, colorValue]) => ({
      ...accum,
      [colorName]: resolveColor(colorValue, namedColors),
    }),
    {}
  );
}


function buildTemplateVariables(
  dokiThemeDefinition: MasterDokiThemeDefinition,
  masterTemplateDefinitions: DokiThemeDefinitions,
  dokiThemeAppDefinition: AppDokiThemeDefinition,
): StringDictionary<string> {
  const namedColors: StringDictionary<string> = constructNamedColorTemplate(
    dokiThemeDefinition,
    masterTemplateDefinitions
  );
  const colorsOverride =
    dokiThemeAppDefinition.overrides.theme?.colors || {};
  const cleanedColors = Object.entries(namedColors)
    .reduce((accum, [colorName, colorValue]) => ({
      ...accum,
      [colorName]: colorValue,
    }), {});
  return {
    ...cleanedColors,
    ...colorsOverride,
  };
}

interface FireFoxDokiThemeBuild {
  path: string,
  definition: MasterDokiThemeDefinition | {colors: StringDictionary<string>},
  stickers: Stickers,
  templateVariables: StringDictionary<string>
  appThemeDefinition: DokiThemeFirefox
}

function createDokiTheme(
  masterThemeDefinitionPath: string,
  masterThemeDefinition: MasterDokiThemeDefinition,
  appTemplateDefinitions: DokiThemeDefinitions,
  appThemeDefinition: DokiThemeFirefox,
  masterTemplateDefinitions: DokiThemeDefinitions,
): FireFoxDokiThemeBuild {
  try {
    return {
      path: masterThemeDefinitionPath,
      definition: {
        ...masterThemeDefinition,
        colors: buildColors(
          masterThemeDefinition,
          masterTemplateDefinitions,
          appThemeDefinition
        )
      },
      stickers: getStickers(masterThemeDefinition, masterThemeDefinitionPath),
      templateVariables: buildTemplateVariables(
        masterThemeDefinition,
        masterTemplateDefinitions,
        appThemeDefinition,
      ),
      appThemeDefinition: appThemeDefinition,
    };
  } catch (e) {
    throw new Error(
      `Unable to build ${masterThemeDefinition.name}'s theme for reasons ${e}`
    );
  }
}

function resolveStickerPath(themeDefinitionPath: string, sticker: string) {
  const stickerPath = path.resolve(
    path.resolve(themeDefinitionPath, ".."),
    sticker
  );
  return stickerPath.substr(
    masterThemeDefinitionDirectoryPath.length + "/definitions".length
  );
}

type Stickers = { default: { path: string; name: string } };
const getStickers: (dokiDefinition: MasterDokiThemeDefinition, themePath: string) => Stickers = (
  dokiDefinition: MasterDokiThemeDefinition,
  themePath: string
) => {
  const secondary =
    dokiDefinition.stickers.secondary || dokiDefinition.stickers.normal;
  return {
    default: {
      path: resolveStickerPath(themePath, dokiDefinition.stickers.default),
      name: dokiDefinition.stickers.default,
    },
    ...(secondary
      ? {
        secondary: {
          path: resolveStickerPath(themePath, secondary),
          name: secondary,
        },
      }
      : {}),
  };
};

console.log("Preparing to generate themes.");
const themesDirectory = path.resolve(repoDirectory, "src", "dokithemejupyter");

evaluateTemplates(
  {
    appName: 'firefox',
    currentWorkingDirectory: __dirname,
  },
  createDokiTheme
)
  .then((dokiThemes) => {
    // write things for extension
    const dokiThemeDefinitions = dokiThemes.map(dokiTheme => {
      const dokiDefinition = dokiTheme.definition;
      return {
        information: {
          ...omit(dokiDefinition, [
            'colors',
            'overrides',
            'ui',
            'icons'
          ]),
        },
        colors: dokiDefinition.colors,
        overrides: dokiTheme.appThemeDefinition.overrides
      };
    }).reduce((accum: StringDictionary<any>, definition: any) => {
      accum[definition.information.id] = definition;
      return accum;
    }, {});
    const finalDokiDefinitions = JSON.stringify(dokiThemeDefinitions);
    fs.writeFileSync(
      path.resolve(repoDirectory, "src", "DokiThemeDefinitions.ts"),
      `export default ${finalDokiDefinitions};`
    );

  })
  .then(() => {
    console.log("Theme Generation Complete!");
  });
