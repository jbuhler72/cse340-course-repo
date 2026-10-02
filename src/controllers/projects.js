// Import any needed model functions
import { createProject, getUpcomingProjects, getProjectDetails, updateProject, deleteProject } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations} from '../models/organizations.js';
import {body, validationResult} from 'express-validator';


const NUMBER_OF_UPCOMING_PROJECTS = 5;

const projectValidation = [

    body('title')
        .trim()
        .notEmpty()
        .withMessage('Project Title Required')
        .isLength({min:5, max:200})
        .withMessage("Title must be between 5 and 200 characters long."),

    body('description')
        .trim()
        .notEmpty()
        .withMessage("A description is required")
        .isLength({min:1, max:1000})
        .withMessage("Description must be between 1 and 1,000 characters long.")
        ,
    body('location')
        .trim()
        .notEmpty()
        .withMessage(`A location must be provided, if not done in person, "remote" or "online" will suffice.`)
        .isLength({min:10, max:200})
        .withMessage("Location must be between 10 and 200 characters long."),
    body('eventdate')
        .notEmpty()
        .withMessage('A date for the project is required')
        .isISO8601()
        .withMessage('Date must be a valid date format'),
    body("organizationId")
        .notEmpty()
        .withMessage('An organizer for the project is required')
        .isInt()
        .withMessage("A valid organization id is rquired")
];


// Define any controller functions
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    projects.forEach(project => {
       // project.project_date = formatDate(project.project_date);
    });
    const title = 'Upcoming Service Projects';
    res.render('projects', { title, projects});
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    const categories = await getCategoriesByProjectId(projectId);
    const title = project.title;

    res.render('project', { title, project, categories });
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
}

const processNewProjectForm = async (req, res) => {
    // If validation failed, flash the errors and send the user back to the form
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-project');
    }

    // Extract form data from req.body
    const { title, description, location, eventdate, organizationId } = req.body;

    try {
        // Create the new project in the database
        const newProjectId = await createProject(title, description, location, eventdate, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
}

const showEditProjectForm = async (req, res) => {
    const title = 'Edit Project';

    const projectId = req.params.id;
    const projectDetails = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();
    //format date to be passed in as value to date selector
    const date = projectDetails.project_date;

    const projectDate = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
    ].join('-');
    
    res.render('edit-project', {title, projectId, projectDetails, organizations, projectDate});
};

const processEditProjectForm = async (req, res) => {
    
    //if errors are found in the validation results
    const results = validationResult(req);
    if (results.isEmpty() == false) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
    
        // Redirect back to the edit project form
        return res.redirect(`/edit-project`);
    }
    else{
    const projectId = req.params.id;
    // Extract form data from req.body
    const {title, description, location, date, organization_id} = req.body;

    try {
        await updateProject(projectId, title, description, location, date, organization_id);
        req.flash('success', 'Project updated successfully');
        res.redirect(`/project/${projectId}`);
        }
        catch (error) {
            console.error('Error creating new project:', error);
            req.flash('error', 'There was an error creating the service project.');
            res.redirect(`/edit-project/${projectId}`);
        }
    }
    
};


const processDeleteProject = async (req, res) => {
    const projectId = req.params.id;

    try {
        await deleteProject(projectId);
        req.flash('success', 'Project deleted successfully!');
        res.redirect('/projects');
    } catch (error) {
        console.error('Error deleting project:', error);
        req.flash('error', 'There was an error deleting the project.');
        res.redirect(`/project/${projectId}`);
    }
};

// Export any controller functions
export {showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, projectValidation, showEditProjectForm, processEditProjectForm, processDeleteProject};