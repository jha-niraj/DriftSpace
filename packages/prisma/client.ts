// Re-export everything from Prisma Client
export * from "@prisma/client";

// Explicitly re-export the Role enum and other types
export { 
    Role, 
    Prisma,
    SpaceType,
    PresenceStatus,
    MessageType,
    
} from "@prisma/client";

export type { 
    User
} from "@prisma/client";