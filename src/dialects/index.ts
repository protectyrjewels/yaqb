import { MongoQB } from './mongo'
import { PostgresQB } from './pg'

const dialects = [new MongoQB(), new PostgresQB()]

export { dialects, MongoQB, PostgresQB }

