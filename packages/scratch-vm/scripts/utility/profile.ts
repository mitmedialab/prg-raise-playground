let profiling = true;

export const setProfiling = (isProfiling: boolean) => profiling = isProfiling;

export const profile = <TFunc extends (...args: any) => any>(toProfile: TFunc, identifier: string): ReturnType<TFunc> => {
  if (!profiling) return toProfile();
  console.time(identifier);
  const result = toProfile();
  console.timeEnd(identifier);
  return result;
}