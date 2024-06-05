import { NoopTinybird, Tinybird } from "@chronark/zod-bird";
import { z } from "zod";

export class Analytics {
  public readonly client: Tinybird | NoopTinybird;

  constructor(opts: {
    tinybirdToken?: string;
    tinybirdProxy?: {
      url: string;
      token: string;
    };
  }) {
    this.client = opts.tinybirdProxy
      ? new Tinybird({ token: opts.tinybirdProxy.token, baseUrl: opts.tinybirdProxy.url })
      : opts.tinybirdToken
        ? new Tinybird({ token: opts.tinybirdToken })
        : new NoopTinybird();
  }

  public get ingestLogs() {
    return this.client.buildIngestEndpoint({
      datasource: "semantic_cache__v6",
      event: eventSchema,
    });
  }
}

export const eventSchema = z.object({
  time: z.number(),
  model: z.string(),
  stream: z.boolean(),
  query: z.string(),
  vector: z.array(z.number()),
  response: z.string(),
  cache: z.boolean(),
  latency: z.number(),
  tokens: z.number(),
  requestId: z.string(),
  workspaceId: z.string(),
  gatewayId: z.string(),
});

export type AnalyticsEvent = z.infer<typeof eventSchema>;

export type InitialAnalyticsEvent = Pick<
  AnalyticsEvent,
  "time" | "model" | "stream" | "query" | "vector"
>;