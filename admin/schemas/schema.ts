// Import document types
import category from './documents/category';
import project from './documents/project';
import employee from './documents/employee';
import settings from './documents/settings';
import studio from './documents/studio';
import richText from './objects/richText';

// Then we give our schema to the builder and provide the result to Sanity
export default [category, project, employee, settings, studio, richText];
