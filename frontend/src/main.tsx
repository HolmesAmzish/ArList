import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from "react-oidc-context";
import type { User } from "oidc-client-ts";
import { WebStorageStateStore } from "oidc-client-ts";

const onSigninCallback = (_user: User | void): void => {
  // Clean up code and state parameters from URL
  window.history.replaceState(
    {},
    document.title,
    window.location.pathname
  );
};

const oidcConfig = {
  authority: "https://auth.arorms.cn",
  client_id: "arlist-frontend",
  redirect_uri: "http://localhost:5173/callback",
  response_type: "code",
  scope: "openid profile",
  automaticSilentRenew: true,
  onSigninCallback,
  // Use localStorage to store state, avoiding sessionStorage loss after redirect
  stateStore: new WebStorageStateStore({ store: window.localStorage }),
  // Disable user info loading to avoid extra fetch
  loadUserInfo: false,
  // Provide metadata manually to avoid CORS preflight request to .well-known/openid-configuration
  metadata: {
    issuer: "https://auth.arorms.cn",
    authorization_endpoint: "https://auth.arorms.cn/oauth2/authorize",
    token_endpoint: "https://auth.arorms.cn/oauth2/token",
    userinfo_endpoint: "https://auth.arorms.cn/userinfo",
    end_session_endpoint: "https://auth.arorms.cn/logout",
    jwks_uri: "https://auth.arorms.cn/oauth2/jwks",
    response_types_supported: ["code"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256"],
    scopes_supported: ["openid", "profile"],
    token_endpoint_auth_methods_supported: ["client_secret_basic", "client_secret_post", "none"],
    claims_supported: ["sub", "iss", "auth_time", "name", "given_name", "family_name", "preferred_username"]
  },
  // Skip issuer check to avoid validation issues
  skipIssuerCheck: true,
  // Disable PKCE for now to simplify the flow
  disablePKCE: false,
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider {...oidcConfig}>
      <App />
    </AuthProvider>
  </StrictMode>,
);
