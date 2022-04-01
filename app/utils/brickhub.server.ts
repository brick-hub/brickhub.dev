import { StringDecoder } from "string_decoder";
import { markdownToHtml } from "./markdown.server";

const BZip2 = require("seek-bzip");

export interface Credentials {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
}

export interface BrickSearchResult {
  name: string;
  description: string;
  version: string;
  publisher: string;
  createdAt: string;
}

export interface BrickMetadata extends BrickSearchResult {
  environment: Environment;
  vars: Record<string, BrickVariableProperties>;
  hooks: string[];
}

export interface BrickBundle extends BrickMetadata {
  readme: string;
  changelog: string;
  license: string;
}

export interface Environment {
  mason: string;
}

export interface BrickVariableProperties {
  type: "string" | "number" | "boolean";
  description?: string;
  default?: string;
  prompt?: string;
}

const utf8Decoder = new StringDecoder("utf8");
const baseUrl = process.env.HOSTED_URL;

export async function login({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const response = await fetch(`${baseUrl}/api/v1/oauth/token`, {
    method: "POST",
    body: JSON.stringify({
      grant_type: "password",
      username: username,
      password: password,
    }),
  });

  if (response.status != 200) return null;

  const body = await response.json();
  const accessToken = body["access_token"];
  const refreshToken = body["refresh_token"];
  const credentials: Credentials = {
    accessToken,
    refreshToken,
  };
  return credentials;
}

export async function search({
  query,
}: {
  query: string;
}): Promise<BrickSearchResult> {
  const response = await fetch(`${baseUrl}/api/v1/search?q=${query}`);
  const body = await response.json();
  return body.bricks.map((brick: any) => {
    return {
      name: brick.name,
      description: brick.description,
      version: brick.version,
      publisher: brick.publisher,
      createdAt: brick.created_at,
    };
  });
}

export async function getBundle({
  name,
  version,
}: {
  name: string;
  version: string;
}): Promise<BrickBundle> {
  const responses = await Promise.all([
    fetch(`${baseUrl}/api/v1/bricks/${name}/versions/${version}`),
    fetch(`${baseUrl}/api/v1/bricks/${name}/versions/${version}.bundle`),
  ]);

  const bodies = await Promise.all([
    responses[0].json(),
    responses[1].arrayBuffer(),
  ]);

  const metadata = bodies[0];
  const bundle = JSON.parse(
    utf8Decoder.write(BZip2.decode(Buffer.from(bodies[1])))
  );
  const readme = Buffer.from(bundle.readme.data, "base64").toString("utf8");
  const changelog = Buffer.from(bundle.changelog.data, "base64").toString(
    "utf8"
  );
  const license = Buffer.from(bundle.license.data, "base64").toString("utf8");

  const html = await Promise.all([
    markdownToHtml(readme),
    markdownToHtml(changelog),
    markdownToHtml(license),
  ]);

  return Object.assign({}, metadata, {
    createdAt: metadata.created_at,
    readme: html[0],
    changelog: html[1],
    license: html[2],
  });
}
