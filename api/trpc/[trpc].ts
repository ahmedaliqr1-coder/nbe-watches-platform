import { createHTTPHandler } from "@trpc/server/adapters/standalone";

import { appRouter } from "../../server/routers.js";

import { createContext } from "../../server/_core/context.js";



export default createHTTPHandler({
  
  router: appRouter,
  
  createContext,
  
  basePath: "/api/trpc/",
  
});





