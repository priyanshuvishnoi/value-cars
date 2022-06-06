import {
  AfterInsert,
  AfterUpdate,
  BeforeRemove,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  onInsert() {
    console.log(`User created with id: ${this.id}`);
  }

  @AfterUpdate()
  onUpdate() {
    console.log(`User updated with id: ${this.id}`);
  }

  @BeforeRemove()
  onDelete() {
    console.log(`User deleted with id: ${this.id}`);
  }
}
