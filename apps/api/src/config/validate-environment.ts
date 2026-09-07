const DEFAULT_API_PORT = 3001;

export function validateEnvironment(environment: Record<string, unknown>): Record<string, unknown> {
  const rawPort = environment.API_PORT ?? DEFAULT_API_PORT;
  const apiPort = typeof rawPort === 'number' ? rawPort : Number(String(rawPort));
  if (!Number.isInteger(apiPort) || apiPort < 1 || apiPort > 65_535) {
    throw new Error('API_PORT must be an integer between 1 and 65535.');
  }
  return {
    ...environment,
    API_PORT: apiPort,
  };
}
