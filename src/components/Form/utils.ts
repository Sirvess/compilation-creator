import type { FormData } from "./";

export const formData2Videos = (data: FormData["data"]): Video[] => {
  const playlistobj = data
    .filter((item) => item?.id?.length && item.id.length > 0)
    .map(
      ({ id, startSeconds, endSeconds }): Video => ({
        id,
        startSeconds: Number(startSeconds),
        endSeconds: Number(endSeconds),
      })
    );
  return playlistobj;
};

export const isSameVideoList = (
  a: Video[] | undefined,
  b: Video[] | undefined
): boolean =>
  !(a === undefined || b === undefined) &&
  a.length !== b.length &&
  a
    .map((x, i) => [x, b[i]])
    .reduce(
      (
        acc,
        [
          { id: ida, startSeconds: sa, endSeconds: ea },
          { id: idb, startSeconds: sb, endSeconds: eb },
        ]
      ) => (!acc ? acc : ida === idb && sa === sb && ea === eb),
      true as boolean
    );
