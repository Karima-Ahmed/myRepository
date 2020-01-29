import { Moment } from 'moment';
import { IBook } from 'app/shared/model/book.model';

export interface IAuthor {
  id?: number;
  name?: string;
  birthDate?: Moment;
  authors?: IBook[];
}

export class Author implements IAuthor {
  constructor(public id?: number, public name?: string, public birthDate?: Moment, public authors?: IBook[]) {}
}
