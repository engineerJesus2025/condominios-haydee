// styles/theme.js
export const estilosGlobales = {
  colors: {
    primary: '#4361ee',
    primaryDark: '#3a56d4',
    secondary: '#7209b7',
    success: '#4cc9f0',
    danger: '#f72585',
    warning: '#f8961e',
    info: '#4895ef',

    background: '#f8f9fa',
    surface: '#ffffff',
    surfaceVariant: '#e9ecef',

    text: {
      primary: '#212529',
      secondary: '#6c757d',
      light: '#f8f9fa',
      inverse: '#ffffff'
    },

    border: '#dee2e6',
    shadow: 'rgba(0, 0, 0, 0.1)'
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },

  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 50
  },

  typography: {
    h1: { fontSize: 24, fontWeight: 'bold' },
    h2: { fontSize: 20, fontWeight: 'bold' },
    h3: { fontSize: 18, fontWeight: '600' },
    body: { fontSize: 16 },
    caption: { fontSize: 14 },
    small: { fontSize: 12 }
  },

  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8
    }
  }
}
