import Studio from './SanityStudio';

// Ensures the Studio route is statically generated
export const dynamic = 'force-static';

// Set the right `viewport`, `robots` and `referer` meta tags
export { metadata } from 'next-sanity/studio/metadata';
export { viewport } from 'next-sanity/studio/viewport';

const StudioPage = () => <Studio />;

export default StudioPage;
