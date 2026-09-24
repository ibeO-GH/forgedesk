import { afterEach, describe, expect, it, vi } from "vitest";
import { apiRequest } from "./client";

function createMockResponse(
  body: unknown,
  ok: boolean,
  contentType = "application/json",
): Response {
  return {
    ok,
    headers: new Headers({
      "content-type": contentType,
    }),
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response;
}

describe("apiRequest", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("returns JSON data for a successful response", async () => {
    const mockResponse = createMockResponse({ message: "Success" }, true);

    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockResponse);

    const result = await apiRequest<{ message: string }>("/test");

    expect(result).toEqual({
      message: "Success",
    });
  });

  it("throws the API error message when the server returns an error", async () => {
    const mockResponse = createMockResponse(
      { message: "Authentication required" },
      false,
    );

    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockResponse);

    await expect(apiRequest("/test")).rejects.toThrow(
      "Authentication required",
    );
  });

  it("uses a fallback message when an error response has no message", async () => {
    const mockResponse = createMockResponse({}, false);

    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockResponse);

    await expect(apiRequest("/test")).rejects.toThrow(
      "Something went wrong. Please try again.",
    );
  });

  it("handles network failures with a user-friendly error", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      new Error("Failed to fetch"),
    );

    await expect(apiRequest("/test")).rejects.toThrow(
      "Unable to connect to ForgeDesk. Please check your connection and try again.",
    );
  });

  it("handles an invalid JSON error response", async () => {
    const mockResponse = createMockResponse({}, false);

    vi.spyOn(mockResponse, "json").mockRejectedValue(new Error("Invalid JSON"));

    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockResponse);

    await expect(apiRequest("/test")).rejects.toThrow(
      "Something went wrong. Please try again.",
    );
  });

  it("adds the authentication token to the request", async () => {
    localStorage.setItem("forgedesk_token", "test-token");

    const mockResponse = createMockResponse({ message: "Success" }, true);

    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(mockResponse);

    await apiRequest("/test");

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/test"),
      expect.objectContaining({
        headers: expect.any(Headers),
      }),
    );

    const requestOptions = fetchMock.mock.calls[0][1];
    const headers = requestOptions?.headers as Headers;

    expect(headers.get("Authorization")).toBe("Bearer test-token");
  });
});
