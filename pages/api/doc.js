import { withSwagger } from 'next-swagger-doc';

const swaggerHandler = withSwagger({
  openApiVersion: '3.0.0',
  title: 'Next.js API Movie Database',
  version: '1.1.0',
  apiFolder: 'pages/api',

});
export default swaggerHandler();