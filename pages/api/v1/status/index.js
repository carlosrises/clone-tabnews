import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW SERVER_VERSION;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnnectionsResult = await database.query(
    "SHOW MAX_CONNECTIONS;",
  );
  const databaseMaxConnnectionsValue =
    databaseMaxConnnectionsResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT COUNT(*)::int AS opened_connections FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const openedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].opened_connections;

  response.status(200).json({
    updated_at: updatedAt,
    dependences: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnnectionsValue),
        opened_connections: parseInt(openedConnectionsValue),
      },
    },
  });
}

export default status;
