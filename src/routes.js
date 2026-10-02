import express from 'express';

import { showHomePage } from './controllers/index.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm,
    processDeleteOrganization
} from './controllers/organizations.js';



import {
  showProjectsPage,
  showProjectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  projectValidation,
  showEditProjectForm,
  processEditProjectForm,
  processDeleteProject } from "./controllers/projects.js";



import { showCategoriesPage } from './controllers/categories.js';
import { showCategoryDetailsPage } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', showHomePage);
// Route for organization  pages
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', organizationValidation, processNewOrganizationForm);
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);
router.post('/delete-organization/:id', processDeleteOrganization);



//projects
//GET routes
router.get('/projects',showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/new-project', showNewProjectForm);
router.get('/edit-project/:id', showEditProjectForm);
// POST routes
router.post('/new-project',projectValidation, processNewProjectForm);
router.post('/edit-project/:id',projectValidation, processEditProjectForm);
router.post('/delete-project/:id', processDeleteProject);


router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);



// error-handling routes
router.get('/test-error', testErrorPage);

export default router;