// Global Styles for Columbus Vacations
const GlobalStyles = {
  colors: {
    primary: '#1976D2', // Ocean blue - primary brand color
    secondary: '#FF9800', // Sunset orange - accent color
    tertiary: '#4CAF50', // Forest green - for CTAs/success indicators
    darkBlue: '#0D47A1', // Deep ocean blue - for headers/footers
    lightBlue: '#BBDEFB', // Sky blue - for backgrounds/highlights
    sand: '#FFF8E1', // Sandy beige - for content sections
    coral: '#FF7043', // Coral - for accents/highlights
    white: '#FFFFFF',
    black: '#333333', // Soft black for better readability
    gray: '#757575',
    lightGray: '#EEEEEE',
    danger: '#F44336', // Red for errors/warnings
  },
  
  typography: {
    fontFamily: "'Poppins', 'Roboto', sans-serif",
    headingFontFamily: "'Montserrat', sans-serif",
    baseFontSize: '16px',
    baseLineHeight: '1.6',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
    round: '50%',
  },
  
  boxShadow: {
    sm: '0 2px 4px rgba(0,0,0,0.1)',
    md: '0 4px 8px rgba(0,0,0,0.1)',
    lg: '0 8px 16px rgba(0,0,0,0.1)',
    xl: '0 12px 24px rgba(0,0,0,0.1)',
  },
  
  // Buttons
  button: {
    primary: {
      backgroundColor: '#1976D2',
      color: '#FFFFFF',
      hoverBg: '#0D47A1',
      activeBg: '#0A2F66',
      fontSize: '16px',
      padding: '10px 20px',
      borderRadius: '4px',
      transition: 'all 0.3s ease',
    },
    secondary: {
      backgroundColor: '#FF9800',
      color: '#FFFFFF',
      hoverBg: '#F57C00',
      activeBg: '#E65100',
      fontSize: '16px',
      padding: '10px 20px',
      borderRadius: '4px',
      transition: 'all 0.3s ease',
    },
    success: {
      backgroundColor: '#4CAF50',
      color: '#FFFFFF',
      hoverBg: '#388E3C',
      activeBg: '#2E7D32',
      fontSize: '16px',
      padding: '10px 20px',
      borderRadius: '4px',
      transition: 'all 0.3s ease',
    },
    danger: {
      backgroundColor: '#F44336',
      color: '#FFFFFF',
      hoverBg: '#D32F2F',
      activeBg: '#B71C1C',
      fontSize: '16px',
      padding: '10px 20px',
      borderRadius: '4px',
      transition: 'all 0.3s ease',
    },
  },
  
  // Cards
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    padding: '24px',
    transition: 'all 0.3s ease',
    hoverTransform: 'translateY(-5px)',
    hoverBoxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  },
  
  // Containers
  container: {
    maxWidth: '1200px',
    padding: '0 24px',
    margin: '0 auto',
  },
  
  // Forms
  input: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #DDDDDD',
    borderRadius: '4px',
    padding: '12px 16px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    focusBorder: '#1976D2',
    errorBorder: '#F44336',
  },
  
  // Status indicators
  badge: {
    approved: {
      backgroundColor: '#4CAF50',
      color: '#FFFFFF',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
    },
    pending: {
      backgroundColor: '#FF9800',
      color: '#FFFFFF',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
    },
    rejected: {
      backgroundColor: '#F44336',
      color: '#FFFFFF',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
    },
  },
  
  // Role indicators
  roleStyle: {
    admin: {
      backgroundColor: '#0D47A1',
      color: '#FFFFFF',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
    },
    user: {
      backgroundColor: '#FF9800',
      color: '#FFFFFF',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
    },
  },
  
  // Responsive breakpoints
  breakpoints: {
    xs: '320px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
};

export default GlobalStyles; 