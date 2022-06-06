import { Injectable, NotFoundException } from '@nestjs/common';
import { defer, Observable } from 'rxjs';
import { switchMap, tap, map } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return defer(() => this.repo.save(user));
  }

  fetchAllUsers() {
    return defer(() => this.repo.find());
  }

  findOne(id: number) {
    return defer(() => this.repo.findOne({ where: { id } })).pipe(
      tap((user) => {
        if (!user) throw new NotFoundException('User not found!');
      }),
      map((user) => {
        delete user.password;

        return user;
      }),
    );
  }

  find(email: string) {
    return defer(() => this.repo.find({ where: { email } })).pipe(
      tap((users) => {
        if (users.length === 0) {
          throw new NotFoundException('Users not found!');
        }
      }),
    );
  }

  update(id: number, attrs: Partial<User>): Observable<User> {
    return this.findOne(id).pipe(
      switchMap((user) => {
        Object.assign(user, attrs);

        return defer(() => this.repo.save(user));
      }),
    );
  }

  remove(id: number): Observable<User> {
    return this.findOne(id).pipe(
      switchMap((user) => defer(() => this.repo.remove(user))),
    );
  }
}
