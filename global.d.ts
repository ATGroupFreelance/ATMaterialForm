import { Palette } from '@mui/material/styles';

// Correctly augment the Theme interface
//Please note that you can use createTheme to combine themes, and the combination occurs at deep object levels as well
interface newPalette extends Palette {
  grey: Palette['grey'] & {
    main: string;
    light: string;
    dark: string;
  };
}

declare module '@mui/material/styles' {
  interface Theme {
    atConfig: {
      id: string;
      appHeader: {
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
}