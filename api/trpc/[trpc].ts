import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { appRouter } from "../../server/routers";

import { createContext } from "../../server/_core/context";



const trpcHandler = createExpressMiddleware({
  
  router: appRouter,
  
  createContext,
  
});



export default trpcHandler;




