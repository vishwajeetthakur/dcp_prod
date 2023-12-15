interface IConfig {
  prodUrl: string;
  appType: 'portals' | 'internal_apps' | 'video';
  keycloakClientId: string;
}

const appConfig: IConfig = {
  // Used to determine when to send prod Quantum analytics
  prodUrl: 'https://my-app.spectrumtoolbox.com',
  // Used to determine which Quantum URLs to hit
  appType: 'internal_apps',
  // Keycloak client Id, request app client in Keycloak from PDE
  keycloakClientId: 'eset',
};

export default appConfig;