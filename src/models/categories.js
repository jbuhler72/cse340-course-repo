import db from './db.js'

const getAllCategories = async() => {
    const query = `
     SELECT category_id, name,description
        FROM category
        ORDER BY category_id;

        
    `;

    const result = await db.query(query);

    return result.rows;
}
const getCategoryById = async (categoryId) => {
    const query = `
        SELECT category_id, name
        FROM category
        WHERE category_id = $1;
    `;

    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);

    return result.rows[0];
};

const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT
            category.category_id,
            category.name
        FROM category
        INNER JOIN project_category
            ON category.category_id = project_category.category_id
        WHERE project_category.project_id = $1
        ORDER BY category.name;
    `;

    const queryParams = [projectId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT
            projects.project_id,
            projects.title,
            projects.description,
            projects.location,
            projects.eventdate
        FROM projects
        INNER JOIN project_category
            ON projects.project_id = project_category.project_id
        WHERE project_category.category_id = $1
        ORDER BY projects.eventdate;
    `;

    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

export {getAllCategories,getCategoryById,getCategoriesByProjectId,getProjectsByCategoryId}