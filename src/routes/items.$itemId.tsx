import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/items/$itemId")({
  component: ItemRouteLayout,
});

function ItemRouteLayout() {
  return <Outlet />;
}
