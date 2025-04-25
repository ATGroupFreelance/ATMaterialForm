import { Palette } from '@mui/material/styles';

declare module '@mui/material/Checkbox' {
  interface CheckboxPropsColorOverrides {
    ash: true;
  }
}

// Correctly augment the Theme interface
//Please note that you can use createTheme to combine themes, and the combination occurs at deep object levels as well
interface newPalette extends Palette {
  ash: {
    main: string;
    light: string;
    dark: string;
  };
}

declare module '@mui/material/styles' {
  interface Theme {
    atConfig: {
      gridTheme: any,
      id: string;
      appHeader: {
        drawer: {
          width: number,
        };
        appBar: any,
        logo: any,
        menuItems: any,
      },
      columnDefTemplates: {
        editIcon: any,
      },
      uploadButton: {
        showFilesIcon: any,
      },
      fileViewer: {
        labelIcon: any,
        file: {
          downloadButton: any,
        }
      },
      loginPage: {
        header: any,
      }
    };
    palette: newPalette;
  }

  // Allow configuration using `createTheme` (don't remove existing `ThemeOptions` structure)
  interface ThemeOptions {
    atConfig?: {
      gridTheme?: any,
      id?: string;
      appHeader?: {
        appBar?: any,
        logo?: any,
        menuItems?: any,
        drawer?: {
          width: number,
        }
      },
      columnDefTemplates?: {
        editIcon?: any,
      },
      uploadButton?: {
        showFilesIcon?: any,
      },
      fileViewer?: {
        labelIcon?: any,
        file?: {
          downloadButton?: any,
        }
      },
      loginPage?: {
        header?: any,
      }
    };

  }
}
