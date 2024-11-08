PS D:\Workstation\CIU PROJECT\C_I_U_BACKEND\backend> npx prisma migrate dev notification
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database "neondb", schema "public" at "ep-bitter-queen-a5l9slsv.us-east-2.aws.neon.tech"

Error: P3006

Migration `20241028220536_chat_and_notification` failed to apply cleanly to the shadow database. 
Error:
column "examRules" of relation "ManualAssessment" does not exist
   0: sql_schema_connector::validate_migrations
           with namespaces=None
             at schema-engine\connectors\sql-schema-connector\src\lib.rs:335
   1: schema_core::state::DevDiagnostic
             at schema-engine\core\src\state.rs:276-- AlterTable
ALTER TABLE "addAssessment" ALTER COLUMN "isDraft" SET DEFAULT true;
