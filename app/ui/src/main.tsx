import { createRoot } from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <NextUIProvider>
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
      }}
    />
  </NextUIProvider>
);
