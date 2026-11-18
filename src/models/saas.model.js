import {
    integer,
    numeric,
    pgTable,
    serial,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";
import { users } from "./user.model.js";

// saas listings table
export const saas = pgTable("saas", {
    id: serial("id").primaryKey(),
    user_id: integer("user_id")
        .references(() => users.id, { onDelete: "cascade" })
        .notNull(),
    name: varchar("name", { length: 200 }).notNull(),
    url: varchar("url", { length: 500 }).notNull(),
    description: text("description").notNull(),
    revenue: numeric("revenue", { precision: 12, scale: 2 })
        .notNull()
        .default("0"),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
});
