export type MenuItem<T> = T | {
  value: T;
  text: string;
};

export type DynamicMenu<T> = () => MenuItem<T>[];

export type DynamicMenuThatAcceptsReporters<T> = {
  /**
   * A function that dynamically retrieves the options for this argument 
   * whenever the associated block is interacted with.
   */
  getItems: DynamicMenu<T>,
  /**
   * Indicates that this argument is allowed to accept a reporter block for input. 
   */
  acceptsReporters: true,
  /**
   * A function responsible for taking in arbitrary input 
   * and converting it to a form that it will not break your block when passed to it as an argument.
   * 
   * This function is required because this argument acceptsReporters (i.e.` acceptReporters = true`) and therefore it might receive a value it is not prepared to handle. 
   */
  handler: (reported: unknown) => T;
};

export type MenuThatAcceptsReporters<T> = {
  items: MenuItem<T>[],
  /**
   * Indicates that this argument is allowed to accept a reporter block for input. 
   */
  acceptsReporters: true,
  /**
   * A function responsible for taking in arbitrary input 
   * and converting it to a form that it will not break your block when passed to it as an argument.
   * 
   * This function is required because this argument acceptsReporters (i.e. `acceptReporters = true`) and therefore the argument might take on a value your block is not prepared to handle. 
   */
  handler: (reported: unknown) => T;
};

export type Menu<T> = MenuItem<T>[] | MenuThatAcceptsReporters<T> | DynamicMenu<T> | DynamicMenuThatAcceptsReporters<T>;
