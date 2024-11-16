interface Config {
  locales: Array<string>;
  staticCatalog: {
    [locale: string]: {
      [key: string]: string;
    };
  };
  directory: string;
}

let config: Config;
let directory: {
  [key: string]: string;
};

const PLACEHOLDER = "%s";

const SimpleI18n = {
  configure: (configInput: Config) => {
    config = configInput;
  },

  setLocale: (locale: string) => {
    if (process.env.NODE_ENV === "development") {
      if (!config) {
        throw new Error(
          "SimpleI18n error: The configure function must be called before the setLocale function"
        );
      }
    }
    directory = config.staticCatalog[locale];
  },

  __: (key: string, input?: string): string => {
    // First get the localized string
    const localizedStr = directory[key] || key;
    
    if (localizedStr.indexOf(PLACEHOLDER) < 0) {
      return localizedStr;
    }

    // Need to do a string replacement
    if (process.env.NODE_ENV === "development") {
      if (!input) {
        throw new Error(
          "SimpleI18n error: if " +
            PLACEHOLDER +
            " exists in a string, a replacement string must be provided for " +
            key
        );
      }
    }
    
    const parts = localizedStr.split(PLACEHOLDER);
    return parts[0] + input + parts[1];
  },
};

export default SimpleI18n;
