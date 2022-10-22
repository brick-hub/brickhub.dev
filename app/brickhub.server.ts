import { markdownToHtml } from "./markdown.server";

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
  createdAt: string;
  downloads: number;
}

export interface BrickDetails {
  name: string;
  description: string;
  version: string;
  repository: string;
  environment: Environment;
  vars: Record<string, BrickVariableProperties>;
  hooks: string[];
  createdAt: string;
  downloads: number;
  publishers?: string[];
  readme: string;
  changelog: string;
  license: string;
  usage: string;
}

export interface Environment {
  mason: string;
}

export interface BrickVariableProperties {
  type: "string" | "number" | "boolean" | "array" | "enum";
  description?: string;
  default?: string;
  defaults?: [string];
  values?: [string];
  prompt?: string;
}

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

export async function sendPasswordResetEmail({ email }: { email: string }) {
  const response = await fetch(`${baseUrl}/api/v1/users/password_reset`, {
    method: "POST",
    body: JSON.stringify({
      email,
    }),
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
      createdAt: brick.created_at,
      downloads: brick.downloads,
    };
  });
  return { bricks, total };
}

export async function getBrickDetails({
  name,
  version,
}: {
  name: string;
  version: string;
}): Promise<BrickDetails> {
  const empty = "(empty)";

  const response = await fetch(
    `${baseUrl}/api/v1/bricks/${name}/versions/${version}/details`
  );

  const body = await response.json();

  if (response.status !== 200) {
    throw new ServerError(
      body["code"] ?? "unknown",
      body["message"] ?? "An unknown error occurred.",
      body["details"]
    );
  }

  function getDefaults(variable: BrickVariableProperties): string {
    const isIterable = variable.type === "array" || variable.type === "enum";
    const isEnum = variable.type === "enum";

    if (!isIterable) return variable.default ? variable.default : empty;

    let defaults: string;

    if (isEnum) {
      defaults = variable.default ? variable.default : variable.values?.at(0)!;
    } else {
      defaults = variable.defaults ? `${variable.defaults}` : empty;
    }

    const values = variable.values?.join(", ");
    return `<details><summary>${defaults}</summary>(${values})</details>`;
  }

  const readme = body.readme;
  const changelog = body.changelog;
  const license = body.license;
  const variables = Object.keys(body.vars);
  const hooks = body.hooks;
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
mason add ${body.name}
\`\`\`

\`\`\`sh
# Install globally
mason add -g ${body.name}
\`\`\`

## Usage 🚀

\`\`\`sh
mason make ${body.name}
\`\`\`

## Variables ✨

| Name | Description | Default(s) | Type |
| ---- | ------------| -----------| -----|
${variables
  .map((v) => {
    const variable = body.vars[v];
    const defaults = getDefaults(variable);

    return `${v} | ${variable.description ?? empty} | ${defaults} | ${
      variable.type
    }`;
  })
  .join("\n")}

## Hooks 🪝

- ${hasPreGenHook ? "✅" : "❌"} &nbsp; Pre-Gen
- ${hasPostGenHook ? "✅" : "❌"} &nbsp; Post-Gen

## Environment 🌎

\`\`\`yaml
mason: "${body.environment.mason}"
\`\`\`
`;

  const html = await Promise.all([
    markdownToHtml(readme),
    markdownToHtml(changelog),
    markdownToHtml(license),
    markdownToHtml(usage),
  ]);

  return Object.assign({}, body, {
    readme: html[0],
    changelog: html[1],
    license: html[2],
    usage: html[3],
    createdAt: body.created_at,
  });
}
