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
   } from "./controllers/projects.js";



import {
  showCategoryDetailsPage,
  showCategoriesPage,
  showNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  categoryValidation
 }
from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', showHomePage);
// Route for organization  pages
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/new-organization', showNewOrganizationForm);
router.get('/edit-organization/:id', showEditOrganizationForm);
//post
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);
router.post('/delete-organization/:id', processDeleteOrganization);
router.post('/new-organization', organizationValidation, processNewOrganizationForm);
//Route for project pages
//GET 
router.get('/projects',showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/new-project', showNewProjectForm);
router.get('/edit-project/:id', showEditProjectForm);
// POST
router.post('/new-project',projectValidation, processNewProjectForm);
router.post('/edit-project/:id',projectValidation, processEditProjectForm);
//router.post('/delete-project/:id', processDeleteProject);
//Route for category pages
//GET 
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/new-category', showNewCategoryForm);
router.get('/edit-category/:id', showEditCategoryForm);
router.post('/edit-category/:id', categoryValidation, processEditCategoryForm);

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);




// error-handling routes
router.get('/test-error', testErrorPage);

export default router;