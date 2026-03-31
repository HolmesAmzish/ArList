import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from "react-oidc-context";
import type { User } from "oidc-client-ts";
import { WebStorageStateStore } from "oidc-client-ts";

const onSigninCallback = (_user: User | void): void => {
  // 清理 URL 中的 code 和 state 参数
  window.history.replaceState(
    {},
    document.title,
    window.location.pathname
  );
};

const oidcConfig = {
  authority: "http://localhost:9000",
  client_id: "arlist-frontend",
  redirect_uri: "http://localhost:5173/callback",
  response_type: "code",
  scope: "openid profile",
  automaticSilentRenew: true,
  onSigninCallback,
  // 使用 localStorage 存储 state，避免 sessionStorage 在重定向后丢失
  stateStore: new WebStorageStateStore({ store: window.localStorage }),
  // 启用 PKCE，这是与授权服务器通信所必需的
  loadUserInfo: true,
  // Provide metadata manually to avoid CORS preflight request to .well-known/openid-configuration
  metadata: {
    issuer: "http://localhost:9000",
    authorization_endpoint: "http://localhost:9000/oauth2/authorize",
    token_endpoint: "http://localhost:9000/oauth2/token",
    userinfo_endpoint: "http://localhost:9000/userinfo",
    end_session_endpoint: "http://localhost:9000/logout",
    jwks_uri: "http://localhost:9000/oauth2/jwks",
    response_types_supported: ["code"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256"],
    scopes_supported: ["openid", "profile"],
    token_endpoint_auth_methods_supported: ["client_secret_basic", "client_secret_post", "none"],
    claims_supported: ["sub", "iss", "auth_time", "name", "given_name", "family_name", "preferred_username"]
  }
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider {...oidcConfig}>
      <App />
    </AuthProvider>
  </StrictMode>,
);
