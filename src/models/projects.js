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

const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          eventdate
        FROM projects
        WHERE organization_id = $1
        ORDER BY eventdate;
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};

const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT
            projects.project_id,
            projects.title,
            projects.description,
            projects.eventdate,
            project.location,
            project.organization_id,
            organization.name AS organization_name
        FROM project
        INNER JOIN organization
            ON project.organization_id = organization.organization_id
        WHERE project.date >= CURRENT_DATE
        ORDER BY project.date ASC
        LIMIT $1;
    `;

    const queryParams = [number_of_projects];
    const result = await db.query(query, queryParams);

    return result.rows;
};
const getProjectDetails = async (id) => {
    const query = `
        SELECT
            projects.project_id,
            projects.title,
            projects.description,
            projects.eventdate,
            projects.location,
            projects.organization_id,
            organization.name AS organization_name
        FROM projects
        INNER JOIN organization
            ON projects.organization_id = organization.organization_id
        WHERE projects.project_id = $1;
    `;

    const queryParams = [id];
    const result = await db.query(query, queryParams);

    return result.rows[0];
};

export {getAllProjects,getProjectsByOrganizationId,getUpcomingProjects, getProjectDetails}