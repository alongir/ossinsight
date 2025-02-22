import fp from "fastify-plugin";
import FastifyAuth0 from "fastify-auth0-verify";

export interface Auth0UserInfo {
    sub: string;
    nickname: string;
    name: string;
    picture: string;
    updated_at: string;
    email: string;
    email_verified: boolean;
}

export const AUTH0_NAMESPACE = `https://ossinsight.io`;
export const AUTH0_USER_METADATA = `${AUTH0_NAMESPACE}/metadata`;

export type Auth0UserMetadata = {
    email: string;
    github_id?: string;
    github_login?: string;
    provider: string;
};

export interface Auth0User {
    "https://ossinsight.io/metadata": Auth0UserMetadata;
    iss: string;
    sub: string;
    aud: string[];
    iat: number;
    exp: number;
    azp: string;
    scope: string;
}

export function parseAuth0User(user: Auth0User) {
    const { ["https://ossinsight.io/metadata"]: metadata, ...others } = user;
    return {
        ...others,
        metadata,
    };
}

export default fp(async (app) => {
    app.register(FastifyAuth0, {
        domain: app.config.AUTH0_DOMAIN,
        secret: app.config.AUTH0_SECRET,
    });
}, {
    name: 'auth0',
    dependencies: [
        '@fastify/env'
    ],
});