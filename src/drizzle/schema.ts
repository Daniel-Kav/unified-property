import { pgTable, pgEnum, serial, text, integer, timestamp, varchar,decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["admin", "user", "userAdminRoleAuth"]);

// Users Table
// export const usersTable = pgTable("users", {
//   user_id: varchar('id').primaryKey(),
//   full_name: text("full_name"),
//   email: varchar("email", { length: 255 }).unique(),
//   contact_phone: text("contact_phone"),
//   address: text("address"),
//   role: roleEnum("role").default("user"),
//   created_at: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
//   updated_at: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
// });


export const usersTable = pgTable('users', {
  user_id: text('user_id').primaryKey(),
  email: text('email'),
  firstName: text('firstName'),
  lastName: text('lastName'),
  full_name: text('full_name'),
  imageUrl: text('imageUrl'),
  createdAt: timestamp('createdAt'),
  updatedAt: timestamp('updatedAt'),
});
// Authentication Table
export const AuthOnUsersTable = pgTable("auth_on_users", {
    auth_id: serial("auth_id").primaryKey(),
    user_id: integer("user_id").notNull().references(() => usersTable.user_id, { onDelete: "cascade" }),
    password: varchar("password", { length: 100 }),
    created_at: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
  });

 //locations and branches
  export const locationTable = pgTable("location", {
    location_id:serial("location_id").primaryKey(),
    address: varchar("address").notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    contact_phone: text("contact_phone"),
    created_at: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
  });

  // Houses Table
  export const housesTable = pgTable("houses", {
    house_id: serial("house_id").primaryKey(),
    location_id: integer("location_id").references(() => locationTable.location_id, { onDelete: "cascade" }),
    number_of_rooms: integer("number_of_rooms").notNull(),
    number_of_bedrooms: integer("number_of_bedrooms").notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    year_built: integer("year_built"),
    status: varchar("status", { length: 50 }).notNull(),
    type:varchar("type",{length:100}).notNull(),
    exterior_image: text("exterior_image"),
    interior_image: text("interior_image"),
    history: text("history"),
    created_at: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
  });

   // Land Table
   export const landTable = pgTable("land", {
    land_id: serial("land_id").primaryKey(),
    location_id: integer("location_id").references(() => locationTable.location_id, { onDelete: "cascade" }),
    size: text("size").notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    status: varchar("status", { length: 50 }).notNull(),
    land_type: varchar("land_type", { length: 50 }).notNull(),
    image: text("image"),
    history: text("history"),
    created_at: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
  });
  
    // Vehicles Table
    export const vehiclesTable = pgTable("vehicles", {
      vehicle_id: serial("vehicle_id").primaryKey(),
      make: varchar("make", { length: 100 }).notNull(),
      model: varchar("model", { length: 100 }).notNull(),
      year: integer("year").notNull(),
      status: varchar("status", { length: 50 }).notNull(),
      price: decimal("price", { precision: 10, scale: 2 }).notNull(),
      fuel_type: varchar("fuel_type", { length: 50 }),
      engine_capacity: text("engine_capacity"),
      transmission: text("transmission"),
      seating_capacity: integer("seating_capacity"),
      color: text("color"),
      location_id: integer("location_id").references(() => locationTable.location_id, { onDelete: "cascade" }),
      exterior_image: text("exterior_image"),
      interior_image: text("interior_image"),
      history: text("history"),
      created_at: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
      updated_at: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
    });


 //purchase Table
 export const purchaseTable = pgTable("purcahse", {
  purchase_id: serial("purchase_id").primaryKey(),
  user_id: integer("user_id").references(() => usersTable.user_id, { onDelete: "cascade" }),
  purchase_date: timestamp("purchase_date").notNull().defaultNow(),
  purchase_status: text("purchase_status").default("pending"),
  location_id: integer("location_id").notNull().references(() => locationTable.location_id, { onDelete: "cascade" }),
  total_amount: integer("total_amount").notNull()
});

 // Transactions Table (covers all property types)
 export const transactionsTable = pgTable("transactions", {
  transaction_id: serial("transaction_id").primaryKey(),
  purchase_id: integer("purchase_id").references(() => purchaseTable.purchase_id, { onDelete: "cascade" }),
  user_id: integer("user_id").references(() => usersTable.user_id, { onDelete: "cascade" }),
  amount: integer("amount"),
  transaction_date: timestamp("transaction_date").notNull().defaultNow(),
  status: varchar("status", { length: 50 }).notNull(),
});

 // Reviews Table (covers all property types)
 export const reviewsTable = pgTable("reviews", {
  review_id: serial("review_id").primaryKey(),
  user_id: integer("user_id").references(() => usersTable.user_id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

  export const AuthOnUsersRelations = relations(usersTable, ({ one }) => ({
    user: one(AuthOnUsersTable, {
        fields: [usersTable.user_id],
        references: [AuthOnUsersTable.user_id]
    }),
    
  }));

  // export const userRelations = relations(usersTable, ({ one,many }) => ({
  //   reviews: many(reviewsTable),
  //   transactions: many(transactionsTable)
  // }));

  export const houseRelations = relations(housesTable, ({one, many }) => ({
    transactions: many(transactionsTable),
    reviews: many(reviewsTable),
    location: one(locationTable,{
      fields: [housesTable.location_id],
      references: [locationTable.location_id]
    })
  }));

  export const landRelations = relations(landTable, ({ one,many }) => ({
    transactions: many(transactionsTable),
    reviews: many(reviewsTable),
    location: one(locationTable,{
      fields: [landTable.location_id],
      references: [locationTable.location_id]
    })
  }));

  export const vehicleRelations = relations(vehiclesTable, ({ one,many }) => ({
    transactions: many(transactionsTable),
    reviews: many(reviewsTable),
    location: one(locationTable,{
      fields: [vehiclesTable.location_id],
      references: [locationTable.location_id]
    })
  }));

  export const locationRelations = relations(locationTable, ({ many }) => ({
    houses: many(housesTable),
    land: many(landTable),
    vehicles: many(vehiclesTable),
  }));
  
  export const transactionsRelations = relations(transactionsTable, ({ one }) => ({
    user: one(usersTable,{
      fields: [transactionsTable.user_id],
      references: [usersTable.user_id]
    }),
    purchaseTable: one(purchaseTable,{
      fields: [transactionsTable.purchase_id],
      references: [purchaseTable.purchase_id]
    }),
  }));

  export const purchaseRelations = relations(purchaseTable, ({ one,many }) => ({
    transaction: one(transactionsTable,{
      fields: [purchaseTable.purchase_id],
      references: [transactionsTable.purchase_id]
    }),
    users: one(usersTable,{
      fields: [purchaseTable.user_id],
      references: [usersTable.user_id]
    }),
  }));

  export const reviewsRelations = relations(reviewsTable, ({ many }) => ({
    users: many(usersTable),
    house: many(housesTable),
    land: many(landTable),
    vehicle: many(vehiclesTable),
  }));

  export type tiUsers = typeof usersTable.$inferInsert;
  export type tsUsers = typeof usersTable.$inferSelect;
  export type tiAuthOnUsers = typeof AuthOnUsersTable.$inferInsert;
  export type tsAuthOnUsers = typeof AuthOnUsersTable.$inferSelect;
  export type tiHouses = typeof housesTable.$inferInsert;
  export type tsHouses = typeof housesTable.$inferSelect;
  export type tiLand = typeof landTable.$inferInsert;
  export type tsLand = typeof landTable.$inferSelect;
  export type tiVehicles = typeof vehiclesTable.$inferInsert;
  export type tsVehicles = typeof vehiclesTable.$inferSelect;
  export type tiLocation = typeof locationTable.$inferInsert;
  export type tsLocation = typeof locationTable.$inferSelect;
  export type tiTransactions = typeof transactionsTable.$inferInsert;
  export type tsTransactions = typeof transactionsTable.$inferSelect;
  export type tiPurchase = typeof purchaseTable.$inferInsert;
  export type tsPurchase = typeof purchaseTable.$inferSelect;
  export type tiReviews = typeof reviewsTable.$inferInsert;
  export type tsReviews = typeof reviewsTable.$inferSelect;