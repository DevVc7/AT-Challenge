import { NormalizeData } from "./types";

export const TABLE_FIELD_DETAIL = "_detail";

export const normalizeData = <T>(
  data: T[] | undefined | null,
): NormalizeData<T>[] => {
  if (!data) return [];

  return data.map((item) => ({
    ...item,
    [TABLE_FIELD_DETAIL]: false,
  }));
};
