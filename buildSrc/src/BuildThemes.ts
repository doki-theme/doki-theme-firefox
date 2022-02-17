import {
  BaseAppDokiThemeDefinition,
  constructNamedColorTemplate,
  dictionaryReducer,
  DokiThemeDefinitions,
  evaluateTemplates,
  MasterDokiThemeDefinition,
  readJson,
  resolveColor,
  resolvePaths,
  StringDictionary,
  toRGBArray,
  walkDir
} from "doki-build-source";
import omit from "lodash/omit";
import fs from "fs";
import path from "path";
import { FireFoxTheme } from "./types";

type AppDokiThemeDefinition = BaseAppDokiThemeDefinition;

const {
  repoDirectory,
  masterThemeDefinitionDirectoryPath,
  appTemplatesDirectoryPath
} = resolvePaths(__dirname);

type DokiThemeFirefox = BaseAppDokiThemeDefinition;

function buildColors(
  dokiThemeDefinition: MasterDokiThemeDefinition,
  dokiTemplateDefinitions: DokiThemeDefinitions,
  dokiThemeChromeDefinition: DokiThemeFirefox
): StringDictionary<string> {
  const namedColors = constructNamedColorTemplate(
    dokiThemeDefinition, dokiTemplateDefinitions
  );
  const themeOverrides = dokiThemeChromeDefinition.overrides.theme &&
    dokiThemeChromeDefinition.overrides.theme.colors || {};
  const colorsOverride: StringDictionary<string> = {
    ...namedColors,
    ...themeOverrides,
    ...dokiThemeChromeDefinition.colors,
    editorAccentColor: dokiThemeDefinition.overrides?.editorScheme?.colors.accentColor ||
      dokiThemeDefinition.colors.accentColor
  };
  return Object.entries<string>(colorsOverride).reduce(
    (accum, [colorName, colorValue]) => ({
      ...accum,
      [colorName]: resolveColor(colorValue, namedColors)
    }),
    {}
  );
}

const toPairs = require("lodash/toPairs");

function replaceValues<T, R>(itemToReplace: T, valueConstructor: (key: string, value: string) => R): T {
  return toPairs(itemToReplace)
    .map(([key, value]: [string, string]) => ([key, valueConstructor(key, value)]))
    .reduce(dictionaryReducer, {});
}


function buildFireFoxTheme(
  dokiThemeDefinition: MasterDokiThemeDefinition,
  dokiTemplateDefinitions: DokiThemeDefinitions,
  dokiThemeChromeDefinition: DokiThemeFirefox,
  manifestTemplate: FireFoxTheme
): FireFoxTheme {
  const namedColors = constructNamedColorTemplate(
    dokiThemeDefinition, dokiTemplateDefinitions
  );
  const colorsOverride = dokiThemeChromeDefinition.overrides.theme &&
    dokiThemeChromeDefinition.overrides.theme.colors || {};
  return {
    ...manifestTemplate,
    colors: replaceValues(
      manifestTemplate.colors,
      (key: string, color: string) => toRGBArray(resolveColor(
        colorsOverride[key] || color,
        namedColors
      ))
    )
  };
}


function buildTemplateVariables(
  dokiThemeDefinition: MasterDokiThemeDefinition,
  masterTemplateDefinitions: DokiThemeDefinitions,
  dokiThemeAppDefinition: AppDokiThemeDefinition
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
      [colorName]: colorValue
    }), {});
  return {
    ...cleanedColors,
    ...colorsOverride
  };
}

interface FireFoxDokiThemeBuild {
  path: string,
  definition: MasterDokiThemeDefinition | { colors: StringDictionary<string> },
  stickers: Stickers,
  templateVariables: StringDictionary<string>
  appThemeDefinition: DokiThemeFirefox,
  fireFoxTheme: FireFoxTheme,
}

function createDokiTheme(
  masterThemeDefinitionPath: string,
  masterThemeDefinition: MasterDokiThemeDefinition,
  appTemplateDefinitions: DokiThemeDefinitions,
  appThemeDefinition: DokiThemeFirefox,
  masterTemplateDefinitions: DokiThemeDefinitions,
  firefoxTemplate: FireFoxTheme
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
        appThemeDefinition
      ),
      appThemeDefinition: appThemeDefinition,
      fireFoxTheme: buildFireFoxTheme(
        masterThemeDefinition,
        masterTemplateDefinitions,
        appThemeDefinition,
        fireFoxTemplate
      )
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
      name: dokiDefinition.stickers.default
    },
    ...(secondary
      ? {
        secondary: {
          path: resolveStickerPath(themePath, secondary),
          name: secondary
        }
      }
      : {})
  };
};

console.log("Preparing to generate themes.");
const fireFoxTemplate = readJson<FireFoxTheme>(path.resolve(appTemplatesDirectoryPath, "firefox.theme.template.json"));

const firefoxBackgroundAssets = path.resolve(
  repoDirectory, "public", "backgrounds"
);

async function walkAndCopyAssets(): Promise<void> {
  const assetsToCopy = await walkDir(
    path.resolve(repoDirectory, "..", "doki-theme-assets", "backgrounds", "wallpapers")
  );

  assetsToCopy.filter(assetPath => assetPath.indexOf("transparent") < 0 && assetPath.indexOf("checksum") < 0)
    .forEach(assetPath => {
      fs.copyFileSync(
        assetPath,
        path.join(
          firefoxBackgroundAssets, assetPath.substring(
            assetPath.lastIndexOf(path.sep) + 1
          )
        )
      );
    });
}

walkAndCopyAssets().then(() =>
  evaluateTemplates(
    {
      appName: "firefox",
      currentWorkingDirectory: __dirname
    },
    (
      masterThemeDefinitionPath: string,
      masterThemeDefinition: MasterDokiThemeDefinition,
      appTemplateDefinitions: DokiThemeDefinitions,
      appThemeDefinition: DokiThemeFirefox,
      masterTemplateDefinitions: DokiThemeDefinitions
    ) =>
      createDokiTheme(
        masterThemeDefinitionPath,
        masterThemeDefinition,
        appTemplateDefinitions,
        appThemeDefinition,
        masterTemplateDefinitions,
        fireFoxTemplate
      )
  ))
  .then((dokiThemes) => {
    // write things for extension
    const dokiThemeDefinitions = dokiThemes.map(dokiTheme => {
      const dokiDefinition = dokiTheme.definition;
      return {
        information: {
          ...omit(dokiDefinition, [
            "colors",
            "overrides",
            "ui",
            "icons"
          ])
        },
        colors: dokiDefinition.colors,
        fireFoxTheme: dokiTheme.fireFoxTheme
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
