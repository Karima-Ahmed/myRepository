export interface IMyEntity {
  id?: number;
  name?: string;
  age?: number;
  hoppy?: string;
}

export class MyEntity implements IMyEntity {
  constructor(public id?: number, public name?: string, public age?: number, public hoppy?: string) {}
}
