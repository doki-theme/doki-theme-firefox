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
  Stickers,
  StringDictionary,
  toRGBArray,
  walkDir
} from "doki-build-source";
import omit from "lodash/omit";
import fs from "fs";
import path from "path";
import {FireFoxTheme} from "./types";

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
  const colorScheme = dokiThemeDefinition.dark ? "dark" : "light";
  return {
    ...manifestTemplate,
    colors: replaceValues(
      manifestTemplate.colors,
      (key: string, color: string) => toRGBArray(resolveColor(
        colorsOverride[key] || color,
        namedColors
      ))
    ),
    properties: {
      color_scheme: colorScheme,
      content_color_scheme: colorScheme,
    }
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
  templateVariables: StringDictionary<string>
  appThemeDefinition: DokiThemeFirefox,
  fireFoxTheme: FireFoxTheme,
}

const excludedSecondaryContentThemes = new Set([
  'b93ab4ea-ff96-4459-8fa2-0caae5bc7116', // Kanna's are the same
  'ea9a13f6-fa7f-46a4-ba6e-6cefe1f55160' // I lack culture...
]);

function hasExcludedSecondaryContent(masterThemeDefinition: MasterDokiThemeDefinition) {
  return excludedSecondaryContentThemes.has(masterThemeDefinition.id);
}

function sanitizeStickers(masterThemeDefinition: MasterDokiThemeDefinition): Stickers {
  if (hasExcludedSecondaryContent(masterThemeDefinition)) {
    return {
      default: masterThemeDefinition.stickers.default
    }
  }
  return masterThemeDefinition.stickers;
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
        ),
        stickers: sanitizeStickers(masterThemeDefinition),
      },
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

console.log("Preparing to generate themes.");
const fireFoxTemplate = readJson<FireFoxTheme>(path.resolve(appTemplatesDirectoryPath, "firefox.theme.template.json"));

const firefoxBackgroundAssets = path.resolve(
  repoDirectory, "public", "backgrounds"
);

async function walkAndCopyAssets(): Promise<void> {
  const assetDir = path.resolve(repoDirectory, "..", "doki-theme-assets", "backgrounds", "wallpapers");
  const assetsToCopy = await walkDir(
    assetDir
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

  // special case where the wallpaper isn't the one I
  // want to use as the background.
  const bestGirl = 'zero_two_obsidian.png';
  fs.copyFileSync(
    path.resolve(assetDir, '..', bestGirl),
    path.join(
      firefoxBackgroundAssets, bestGirl
    )
  )
}

function scrubDefinition(masterThemeDefinition: MasterDokiThemeDefinition) {
  if(masterThemeDefinition.id === "b0340303-0a5a-4a20-9b9c-fc8ce9880078") {
    masterThemeDefinition.displayName = "Sayori";
  }
  return masterThemeDefinition;
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
        scrubDefinition(masterThemeDefinition),
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
