import {ConfigService} from "@nestjs/config";
import {HealthService} from "./health.service";
import {describe, expect, it} from "vitest";


describe('HealthService', () => {
  it('returns an operational response', () => {
    const config = new ConfigService({APP_ENV: 'test'});
    const service = new HealthService(config);
    const result = service.getHealth();
    expect(result.status).toBe('ok');
    expect(result.service).toBe('store-management-api');
    expect(result.environment).toBe('test');
    expect(Number.isNaN(Date.parse(result.timestamp))).toBe(false);
  });
});
