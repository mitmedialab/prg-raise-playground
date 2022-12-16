/**
* Preffered to: 
* ```ts
* call(); return thenReturn;
* ``` 
* so that the `return` can go first. For example:
* ```ts
* if (shouldEarlyReturn) return oneliner({call, thenReturn});
* ```
* @param param0 
* @returns 
*/
export const oneliner = <T>({ call, thenReturn }: { call: () => void, thenReturn: T }) => {
  call();
  return thenReturn;
}