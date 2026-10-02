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
            projects.location,
            projects.organization_id,
            organization.name AS organization_name
        FROM projects
        INNER JOIN organization
            ON projects.organization_id = organization.organization_id
        WHERE projects.eventdate >= CURRENT_DATE
        ORDER BY projects.eventdate ASC
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

const createProject = async (title, description, location, eventdate, organization_id) =>{
    const query =`
    INSERT INTO projects 
    (title, description, location, eventdate, organization_id) VALUES
    ($1, $2, $3, $4, $5)
    returning project_id`;
    const queryParams = [title, description, location, eventdate, parseInt(organization_id)];
    
    queryParams.forEach(param =>{
        console.log(param);
        console.log(Object.prototype.toString.call(param));
    });



    //returns the project ID
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
};


const updateProject = async (projectId, title, description, location, eventdate, organization_id) => {
    const query = `
      UPDATE projects
      SET
      title = $2, description = $3, location = $4, eventdate  = $5, organization_id = $6
      WHERE project_id = $1
      RETURNING project_id
    `;

    const queryParams = [projectId, title, description, location, eventdate, organization_id];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Project not found');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated project with ID:', projectId);
    }

    return result.rows[0].project_id;
};

/**
 * Deletes a project from the database, along with its category associations.
 * @param {string|number} projectId - The id of the project to delete.
 * @returns {string} The id of the deleted project record.
 * @throws Will throw if no project with that id exists.
 */
const deleteProject = async (projectId) => {
    // project_category rows reference this project and have no ON DELETE
    // CASCADE, so they must be removed first or the delete below would fail
    // with a foreign key violation.
    await db.query('DELETE FROM project_category WHERE project_id = $1', [projectId]);

    const query = `
        DELETE FROM projects
        WHERE project_id = $1
        RETURNING project_id;
    `;

    const result = await db.query(query, [projectId]);

    if (result.rows.length === 0) {
        throw new Error('Project not found');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Deleted project with ID:', projectId);
    }

    return result.rows[0].project_id;
};

// Export the model functions
export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails, createProject, updateProject, deleteProject};