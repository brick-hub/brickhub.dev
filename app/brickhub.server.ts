import { StringDecoder } from "string_decoder";
import { markdownToHtml } from "./markdown.server";

const BZip2 = require("seek-bzip");

export class ServerError {
  constructor(
    public code: string,
    public message: string,
    public details?: string
  ) {}
}

export interface Credentials {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
}

export interface BrickSearchResults {
  bricks: [BrickSearchResult];
  total: number;
}

export interface BrickSearchResult {
  name: string;
  description: string;
  version: string;
  publisher: string;
  createdAt: string;
  downloads: number;
}

export interface BrickMetadata {
  name: string;
  description: string;
  version: string;
  publisher: string;
  repository: string;
  environment: Environment;
  vars: Record<string, BrickVariableProperties>;
  hooks: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BrickBundle {
  name: string;
  environment: Environment;
  vars: Record<string, BrickVariableProperties>;
  hooks: string[];
  readme: string;
  changelog: string;
  license: string;
}

export interface BrickDetails extends BrickMetadata, BrickBundle {
  usage: string;
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

export async function refresh({ token }: { token: string }) {
  const response = await fetch(`${baseUrl}/api/v1/oauth/token`, {
    method: "POST",
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: token,
    }),
  });

  const body = await response.json();

  if (response.status !== 200) {
    throw new ServerError(
      body["code"] ?? "unknown",
      body["message"] ?? "An unknown error occurred.",
      body["details"]
    );
  }

  const accessToken = body["access_token"];
  const refreshToken = body["refresh_token"];
  const credentials: Credentials = {
    accessToken,
    refreshToken,
  };
  return credentials;
}

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

  const body = await response.json();

  if (response.status !== 200) {
    throw new ServerError(
      body["code"] ?? "unknown",
      body["message"] ?? "An unknown error occurred.",
      body["details"]
    );
  }

  const accessToken = body["access_token"];
  const refreshToken = body["refresh_token"];
  const credentials: Credentials = {
    accessToken,
    refreshToken,
  };
  return credentials;
}

export async function signup({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const response = await fetch(`${baseUrl}/api/v1/users`, {
    method: "POST",
    body: JSON.stringify({
      email: username,
      password: password,
    }),
  });

  const body = await response.json();

  if (response.status !== 201) {
    throw new ServerError(
      body["code"] ?? "unknown",
      body["message"] ?? "An unknown error occurred.",
      body["details"]
    );
  }

  const accessToken = body["access_token"];
  const refreshToken = body["refresh_token"];
  const credentials: Credentials = {
    accessToken,
    refreshToken,
  };
  return credentials;
}

export async function sendVerificationEmail({ token }: { token: string }) {
  const response = await fetch(`${baseUrl}/api/v1/users/verify`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 204) {
    const body = await response.json();
    throw new ServerError(
      body["code"] ?? "unknown",
      body["message"] ?? "An unknown error occurred.",
      body["details"]
    );
  }
  return null;
}

type Sort = "downloads" | "created";

export async function search({
  query,
  limit,
  offset,
  sort,
}: {
  query: string;
  limit: number;
  offset: number;
  sort: Sort;
}): Promise<BrickSearchResults> {
  const response = await fetch(
    `${baseUrl}/api/v1/search?q=${query}&limit=${limit}&offset=${offset}&sort=${sort}`
  );

  const body = await response.json();

  if (response.status !== 200) {
    throw new ServerError(
      body["code"] ?? "unknown",
      body["message"] ?? "An unknown error occurred.",
      body["details"]
    );
  }

  const total = body.total;
  const bricks = body.bricks.map((brick: any) => {
    return {
      name: brick.name,
      description: brick.description,
      version: brick.version,
      publisher: brick.publisher,
      createdAt: brick.created_at,
      downloads: brick.downloads,
    };
  });
  return { bricks, total };
}

export async function getBrickMetadata({
  name,
  version,
}: {
  name: string;
  version: string;
}): Promise<BrickMetadata> {
  const response = await fetch(
    `${baseUrl}/api/v1/bricks/${name}/versions/${version}`
  );

  const body = await response.json();

  if (response.status !== 200) {
    throw new ServerError(
      body["code"] ?? "unknown",
      body["message"] ?? "An unknown error occurred.",
      body["details"]
    );
  }

  return Object.assign({}, body, {
    createdAt: body["created_at"],
    updatedAt: body["updated_at"],
  });
}

export async function getBrickBundle({
  name,
  version,
}: {
  name: string;
  version: string;
}): Promise<BrickBundle> {
  const response = await fetch(
    `${baseUrl}/api/v1/bricks/${name}/versions/${version}.bundle`
  );

  if (response.status !== 200) {
    const body = await response.json();
    throw new ServerError(
      body["code"] ?? "unknown",
      body["message"] ?? "An unknown error occurred.",
      body["details"]
    );
  }

  const body = await response.arrayBuffer();
  const bundle = JSON.parse(utf8Decoder.write(BZip2.decode(Buffer.from(body))));

  const readme = Buffer.from(bundle.readme.data, "base64").toString("utf8");
  const changelog = Buffer.from(bundle.changelog.data, "base64").toString(
    "utf8"
  );
  const license = Buffer.from(bundle.license.data, "base64").toString("utf8");
  return {
    name: bundle.name,
    environment: bundle.environment,
    vars: bundle.vars,
    hooks: bundle.hooks,
    readme,
    changelog,
    license,
  };
}

export async function getBrickDetails({
  name,
  version,
  metadata,
}: {
  name: string;
  version: string;
  metadata?: BrickMetadata | undefined;
}): Promise<BrickDetails> {
  const responses = await Promise.all([
    (() => (metadata ? metadata : getBrickMetadata({ name, version })))(),
    getBrickBundle({ name, version }),
  ]);

  const brickMetadata = responses[0];
  const bundle = responses[1];
  const readme = bundle.readme;
  const changelog = bundle.changelog;
  const license = bundle.license;
  const variables = Object.keys(bundle.vars);
  const hooks = bundle.hooks.map((hook: any) => hook["path"]);
  const hasPreGenHook = hooks.includes("pre_gen.dart");
  const hasPostGenHook = hooks.includes("post_gen.dart");
  const usage = `
## Setup 🧑‍💻

Ensure you have the [mason_cli](https://github.com/felangel/mason/tree/master/packages/mason_cli) installed.

\`\`\`sh
# 🎯 Activate from https://pub.dev
dart pub global activate mason_cli
\`\`\`

\`\`\`sh
# 🍺 Or install from https://brew.sh
brew tap felangel/mason
brew install mason
\`\`\`

## Installation ☁️ 

\`\`\`sh
# Install locally
mason add ${bundle.name}
\`\`\`

\`\`\`sh
# Install globally
mason add -g ${bundle.name}
\`\`\`

## Usage 🚀

\`\`\`sh
mason make ${bundle.name}
\`\`\`

## Variables ✨

| Name | Description | Default | Type |
| ---- | ------------| --------| -----|
${variables
  .map((v) => {
    const variable = bundle.vars[v];
    return `${v} | ${variable.description ?? "(empty)"} | ${
      variable.default ?? "(empty)"
    } | ${variable.type}`;
  })
  .join("\n")}

## Hooks 🪝

- ${hasPreGenHook ? "✅" : "❌"} &nbsp; Pre-Gen
- ${hasPostGenHook ? "✅" : "❌"} &nbsp; Post-Gen

## Environment 🌎

\`\`\`yaml
mason: "${bundle.environment.mason}"
\`\`\`
`;

  const html = await Promise.all([
    markdownToHtml(readme),
    markdownToHtml(changelog),
    markdownToHtml(license),
    markdownToHtml(usage),
  ]);

  return Object.assign({}, brickMetadata, {
    readme: html[0],
    changelog: html[1],
    license: html[2],
    usage: html[3],
  });
}
