import { useEffect, useReducer, useRef } from "react";

export type AsyncState<T> = {
  data?: T;
  error?: unknown;
  loading: boolean;
  reload: () => void;
};

type State<T> = { data?: T; error?: unknown; loading: boolean; tick: number };
type Action<T> =
  | { type: "start" }
  | { type: "success"; data: T }
  | { type: "error"; error: unknown }
  | { type: "reload" };

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case "start":
      return { ...state, loading: true, error: undefined };
    case "success":
      return { ...state, data: action.data, error: undefined, loading: false };
    case "error":
      return { ...state, error: action.error, loading: false };
    case "reload":
      return { ...state, tick: state.tick + 1 };
  }
}

export function useAsync<T>(
  fn: () => Promise<T>,
  deps: unknown[] = []
): AsyncState<T> {
  const [state, dispatch] = useReducer(reducer<T>, { loading: true, tick: 0 });
  const aborted = useRef(false);

  useEffect(() => {
    aborted.current = false;
    dispatch({ type: "start" });
    fn()
      .then((d) => {
        if (!aborted.current) dispatch({ type: "success", data: d });
      })
      .catch((e) => {
        if (!aborted.current) dispatch({ type: "error", error: e });
      });
    return () => {
      aborted.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, state.tick]);

  return {
    data: state.data,
    error: state.error,
    loading: state.loading,
    reload: () => dispatch({ type: "reload" }),
  };
}
