/**
 * Decides whether a route change should send a Meta PageView.
 *
 * Pulled out of the effect so it can be tested directly: getting this wrong
 * double-counts every visit, which quietly inflates audiences and skews the
 * cost-per-result the campaign optimises against.
 *
 * Rules:
 *  - The very first path is already covered by the inline pixel snippet in the
 *    root layout, so record it and stay silent.
 *  - Only an actual change of path counts as a new page. Re-running on the same
 *    path (React StrictMode invoking effects twice in development, a remount, a
 *    query-string change) must not fire again.
 */
export const nextPageViewState = (
  lastPath: string | null,
  currentPath: string
): { track: boolean; lastPath: string } => {
  if (lastPath === null) return { track: false, lastPath: currentPath };
  if (lastPath === currentPath) return { track: false, lastPath };
  return { track: true, lastPath: currentPath };
};
