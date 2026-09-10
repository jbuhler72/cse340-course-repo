import db from './db.js'

const getAllProjects = async() => {
    const query = `
    SELECT
            p.project_id,
            p.organization_id,
            p.title,
            p.description,
            p.location,
            p.eventdate,
            TO_CHAR(p.eventdate, 'FMMonth FMDD, YYYY') AS formatted_date,
            o.name AS organization_name
        FROM projects AS p
        JOIN organization AS o
            ON p.organization_id = o.organization_id
        ORDER BY p.eventdate, p.project_id;

        
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllProjects}