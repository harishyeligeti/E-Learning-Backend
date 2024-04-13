const pool = require('../config/database');

const getPaginationData = async (page, limit, tableName, filterCondition, filterValues) => {
  try {
    // Check if pagination metadata exists for the given table and filter condition
    const metadataQuery = `
      SELECT * FROM pagination_metadata
      WHERE table_name = $1 AND filter_condition = $2
    `;
    const metadataValues = [tableName, filterCondition];
    const metadataResult = await pool.query(metadataQuery, metadataValues);

    let totalPages, totalItems;

    if (metadataResult.rows.length > 0) {
      // Use existing pagination metadata
      const metadata = metadataResult.rows[0];
      totalPages = metadata.total_pages;
      totalItems = metadata.total_items;
    } else {
      // Calculate pagination metadata and store it
      const totalRowsQuery = `SELECT COUNT(*) FROM ${tableName} ${filterCondition ? `WHERE ${filterCondition}` : ''}`;
      const totalRowsResult = await pool.query(totalRowsQuery, filterValues);
      totalItems = parseInt(totalRowsResult.rows[0].count, 10);
      totalPages = Math.ceil(totalItems / limit);

      const insertMetadataQuery = `
        INSERT INTO pagination_metadata
        (table_name, filter_condition, current_page, items_per_page, total_items, total_pages)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      const insertMetadataValues = [
        tableName,
        filterCondition,
        page,
        limit,
        totalItems,
        totalPages,
      ];
      await pool.query(insertMetadataQuery, insertMetadataValues);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    return { startIndex, endIndex, totalPages };
  } catch (error) {
    throw new Error('Error fetching pagination data');
  }
};

module.exports = {
  getPaginationData,
};