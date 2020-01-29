import { Moment } from 'moment';
import { IAuthor } from 'app/shared/model/author.model';

export interface IBook {
  id?: number;
  name?: string;
  description?: string;
  publicationDate?: Moment;
  price?: number;
  author?: IAuthor;
}

export class Book implements IBook {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public publicationDate?: Moment,
    public price?: number,
    public author?: IAuthor
  ) {}
}
