import { Collection } from "mongodb"

export interface Collections {
  [key: string]: Collection<any>
}
