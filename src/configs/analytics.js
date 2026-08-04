import ReactGA from 'react-ga4';


const MEASUREMENT_ID = 'G-PQ4XFM4TEM'; // Your Google Analytics Measurement ID

export const initGA = () => {
  if(MEASUREMENT_ID && MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
    ReactGA.initialize(MEASUREMENT_ID, {
      gaOptions: {
        anonymizeIp: true, // Anonymize IP addresses
      },
    });
    console.log('✅ Google Analytics initialized:', MEASUREMENT_ID);
  } else {
    console.error('❌ Google Analytics Measurement ID is not configured.');
  }
}

export const logPageView = (path) => {
  ReactGA.send({ hitType: 'pageview', page: path });
}

export const logEvent = (category, action, label='') => {
  ReactGA.event({
    category,
    action,
    label,
  });
}

export const trackButtonClick = (buttonName) => {
  logEvent('Button', 'Click', buttonName);
}

export const trackLinkClick = (linkName, url) => {
  logEvent('Link', 'Click', `${linkName} - ${url}`);
}

export const trackDownload = (fileName) => {
  logEvent('Download', 'PDF', fileName);
}

export const trackSectionView = (sectionName) => {
  logEvent('Section', 'View', sectionName);
}

