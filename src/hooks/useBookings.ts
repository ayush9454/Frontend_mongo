import { useCallback } from "react";
import { parkingService } from "../services/api";
import { useResource, invalidateResources } from "./useResource";
export function useBookings(
  page = 1,
  mode: "all" | "current" | "history" = "all",
) {
  const loader = useCallback(async () => {
    const response =
      mode === "history"
        ? await parkingService.getBookingHistory(page)
        : await parkingService.getBookings(
            page,
            mode === "current" ? "current" : undefined,
          );
    return response.data;
  }, [page, mode]);
  return useResource(loader);
}
export async function cancelBooking(id: string) {
  const response = await parkingService.cancelBooking(id);
  invalidateResources();
  return response.data;
}
export function useBookingSummary() {
  return useResource(
    useCallback(async () => (await parkingService.getSummary()).data, []),
  );
}
