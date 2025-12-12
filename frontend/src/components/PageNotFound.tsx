import {Link } from 'react-router-dom';

const PageNotFound = () => {

 return (
   <div className="min-h-screen flex items-center justify-center bg-gray-900">
     <div className="text-center">
       <h1 className="text-2xl font-bold text-indigo-400 mb-4">404</h1>
       <p className="text-5xl text-gray-600 mb-8">Page not found</p>
       <Link
         to="/"
         className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
       >
         Go back home
       </Link>
     </div>
   </div>
 );
}
export default PageNotFound
