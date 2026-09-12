jest.mock("../src/api/client", () => ({
  get: jest.fn(),
}));

import apiClient from "../src/api/client";
import { HealthAPI } from "../src/api/endpoints";

describe("HealthAPI", () => {
  it("solicita el endpoint público /health", () => {
    HealthAPI.check();

    expect(apiClient.get).toHaveBeenCalledWith("/health");
  });
});
