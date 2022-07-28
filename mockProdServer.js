import { createProdMockServer } from "vite-plugin-mock/es/createProdMockServer";
import { globalConfig } from "@/config/index";
import demoMock from "./src/mock/demo";

export function setupProdMockServer() {
  if (!globalConfig?.isMock) return;
  createProdMockServer([...demoMock]);
}
